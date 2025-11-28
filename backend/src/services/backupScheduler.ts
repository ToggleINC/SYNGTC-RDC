import cron from 'node-cron';
import { ExcelExport } from './excelExport';

class BackupScheduler {
  private cronJob: cron.ScheduledTask | null = null;
  private excelExport: ExcelExport;

  private excelExport: ExcelExport | null = null;

  constructor() {
    try {
      this.excelExport = new ExcelExport();
    } catch (error) {
      console.error('⚠️ Erreur initialisation ExcelExport:', error);
    }
  }

  public start() {
    if (!this.excelExport) {
      console.warn('⚠️ ExcelExport non initialisé, scheduler de backup non démarré');
      return;
    }

    // Planifier le backup tous les jours à 23h59
    // Format cron: minute heure jour mois jour-semaine
    // 59 23 * * * = 23:59 tous les jours
    try {
      this.cronJob = cron.schedule('59 23 * * *', async () => {
        console.log('🔄 Démarrage du backup quotidien...');
        try {
          if (!this.excelExport) {
            console.error('❌ ExcelExport non disponible pour le backup');
            return;
          }
          const filepath = await this.excelExport.generateDailyBackup();
          console.log(`✅ Backup quotidien créé avec succès: ${filepath}`);
        } catch (error) {
          console.error('❌ Erreur lors du backup quotidien:', error);
        }
      }, {
        scheduled: true,
        timezone: 'Africa/Kinshasa', // Fuseau horaire de la RDC
      });

      console.log('📅 Scheduler de backup quotidien démarré (23h59 chaque jour)');
    } catch (error) {
      console.error('❌ Erreur lors du démarrage du scheduler:', error);
    }
  }

  public stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      console.log('⏹️ Scheduler de backup arrêté');
    }
  }

  public async generateBackupNow(): Promise<string> {
    if (!this.excelExport) {
      throw new Error('ExcelExport non initialisé');
    }
    console.log('🔄 Génération manuelle du backup...');
    const filepath = await this.excelExport.generateDailyBackup();
    console.log(`✅ Backup créé avec succès: ${filepath}`);
    return filepath;
  }
}

export const backupScheduler = new BackupScheduler();

