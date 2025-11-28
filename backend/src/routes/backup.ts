import express from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { backupScheduler } from '../services/backupScheduler';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Tous les endpoints nécessitent une authentification admin
router.use(authenticate);
router.use(authorize('admin_pnc', 'admin_anr', 'admin_ministere'));

// Générer un backup manuel
router.post('/generate', async (req: AuthRequest, res) => {
  try {
    const filepath = await backupScheduler.generateBackupNow();
    const filename = path.basename(filepath);
    
    res.json({
      message: 'Backup généré avec succès',
      filename,
      filepath,
    });
  } catch (error: any) {
    console.error('Erreur génération backup:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du backup' });
  }
});

// Lister les backups disponibles
router.get('/list', async (req: AuthRequest, res) => {
  try {
    const backupsDir = path.join(process.cwd(), 'backups');
    const backups: any[] = [];

    if (!fs.existsSync(backupsDir)) {
      return res.json({ backups: [] });
    }

    // Parcourir les dossiers de dates
    const dateFolders = fs.readdirSync(backupsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort()
      .reverse(); // Plus récent en premier

    for (const dateFolder of dateFolders) {
      const datePath = path.join(backupsDir, dateFolder);
      if (!fs.existsSync(datePath)) continue;
      
      const files = fs.readdirSync(datePath)
        .filter(file => file.endsWith('.xlsx'))
        .map(file => {
          const filepath = path.join(datePath, file);
          const stats = fs.statSync(filepath);
          return {
            filename: file,
            date: dateFolder,
            filepath: path.join(dateFolder, file),
            size: stats.size,
            created: stats.birthtime || stats.mtime,
          };
        })
        .sort((a, b) => {
          const timeA = a.created instanceof Date ? a.created.getTime() : new Date(a.created).getTime();
          const timeB = b.created instanceof Date ? b.created.getTime() : new Date(b.created).getTime();
          return timeB - timeA;
        });

      backups.push(...files);
    }

    res.json({ backups });
  } catch (error: any) {
    console.error('Erreur liste backups:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la liste' });
  }
});

// Télécharger un backup
router.get('/download/:date/:filename', async (req: AuthRequest, res) => {
  try {
    const { date, filename } = req.params;
    const filepath = path.join(process.cwd(), 'backups', date, filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Fichier introuvable' });
    }

    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Erreur téléchargement:', err);
        res.status(500).json({ error: 'Erreur lors du téléchargement' });
      }
    });
  } catch (error: any) {
    console.error('Erreur téléchargement backup:', error);
    res.status(500).json({ error: 'Erreur lors du téléchargement' });
  }
});

export default router;

