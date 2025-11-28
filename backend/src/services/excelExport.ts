import ExcelJS from 'exceljs';
import { supabase } from '../config/supabase';
import path from 'path';
import fs from 'fs';

interface BackupData {
  criminals: any[];
  cases: any[];
  alerts: any[];
  actionLogs: any[];
}

export class ExcelExport {
  private backupDir: string;

  constructor() {
    this.backupDir = path.join(process.cwd(), 'backups');
    try {
      this.ensureBackupDir();
    } catch (error) {
      console.error('⚠️ Erreur lors de la création du dossier backups:', error);
    }
  }

  private ensureBackupDir() {
    try {
      if (!fs.existsSync(this.backupDir)) {
        fs.mkdirSync(this.backupDir, { recursive: true });
      }
    } catch (error) {
      console.error('⚠️ Erreur création dossier backups:', error);
      throw error;
    }
  }

  private getDateFolder(): string {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const dateFolder = path.join(this.backupDir, dateStr);
    
    if (!fs.existsSync(dateFolder)) {
      fs.mkdirSync(dateFolder, { recursive: true });
    }
    
    return dateFolder;
  }

  private async fetchDailyData(date: Date): Promise<BackupData> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Récupérer les criminels créés/modifiés aujourd'hui
    const { data: criminalsData, error: criminalsError } = await supabase
      .from('criminals')
      .select('id, numero_criminel, nom, prenom, date_naissance, lieu_naissance, adresse, quartier, avenue, type_infraction, niveau_dangerosite, danger_score, parrainage, bande, gang, armes_saisies, objets_saisis, latitude, longitude, created_at, updated_at')
      .or(`created_at.gte.${startOfDay.toISOString()},updated_at.gte.${startOfDay.toISOString()}`)
      .or(`created_at.lte.${endOfDay.toISOString()},updated_at.lte.${endOfDay.toISOString()}`)
      .order('created_at', { ascending: false });

    if (criminalsError) {
      console.error('Erreur récupération criminels:', criminalsError);
    }

    // Récupérer les cas créés aujourd'hui
    const { data: casesData, error: casesError } = await supabase
      .from('cases')
      .select(`
        id, criminal_id, date_arrestation, lieu_arrestation, description,
        type_infraction, statut_judiciaire, latitude, longitude, created_at, updated_at,
        criminals!cases_criminal_id_fkey(numero_criminel, nom, prenom)
      `)
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString())
      .order('created_at', { ascending: false });

    // Récupérer aussi les cas modifiés aujourd'hui
    const { data: casesUpdated, error: casesUpdatedError } = await supabase
      .from('cases')
      .select(`
        id, criminal_id, date_arrestation, lieu_arrestation, description,
        type_infraction, statut_judiciaire, latitude, longitude, created_at, updated_at,
        criminals!cases_criminal_id_fkey(numero_criminel, nom, prenom)
      `)
      .gte('updated_at', startOfDay.toISOString())
      .lte('updated_at', endOfDay.toISOString())
      .not('updated_at', 'is', null);

    // Combiner et dédupliquer par ID
    const allCases = [...(casesData || []), ...(casesUpdated || [])];
    const uniqueCases = Array.from(
      new Map(allCases.map(c => [c.id, c])).values()
    );

    if (casesError) {
      console.error('Erreur récupération cas:', casesError);
    }

    // Transformer les cas pour inclure les données du criminel
    const cases = uniqueCases.map((c: any) => ({
      ...c,
      numero_criminel: c.criminals?.numero_criminel || null,
      criminal_nom: c.criminals?.nom || null,
      criminal_prenom: c.criminals?.prenom || null,
    }));

    // Récupérer les alertes créées aujourd'hui
    const { data: alertsData, error: alertsError } = await supabase
      .from('alerts')
      .select('id, type, titre, description, priorite, criminal_id, case_id, location, statut, created_at')
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString())
      .order('created_at', { ascending: false });

    if (alertsError) {
      console.error('Erreur récupération alertes:', alertsError);
    }

    // Transformer les alertes pour extraire latitude/longitude du location JSON
    const alerts = (alertsData || []).map((a: any) => {
      const location = typeof a.location === 'string' ? JSON.parse(a.location) : a.location;
      return {
        ...a,
        lieu: location?.address || null,
        latitude: location?.latitude || null,
        longitude: location?.longitude || null,
      };
    });

    // Récupérer les logs d'actions d'aujourd'hui
    const { data: logsData, error: logsError } = await supabase
      .from('action_logs')
      .select(`
        id, user_id, action_type, entity_type, entity_id, details, created_at,
        users!action_logs_user_id_fkey(email, nom, prenom)
      `)
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString())
      .order('created_at', { ascending: false });

    if (logsError) {
      console.error('Erreur récupération logs:', logsError);
    }

    // Transformer les logs pour inclure les données de l'utilisateur
    const actionLogs = (logsData || []).map((log: any) => ({
      ...log,
      user_email: log.users?.email || null,
      user_nom: log.users?.nom || null,
      user_prenom: log.users?.prenom || null,
    }));

    return {
      criminals: uniqueCriminals || [],
      cases: cases || [],
      alerts: alerts || [],
      actionLogs: actionLogs || [],
    };
  }

  public async generateDailyBackup(date: Date = new Date()): Promise<string> {
    const data = await this.fetchDailyData(date);
    const workbook = new ExcelJS.Workbook();

    // Feuille Criminels
    const criminalsSheet = workbook.addWorksheet('Criminels');
    criminalsSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Numéro Criminel', key: 'numero_criminel', width: 20 },
      { header: 'Nom', key: 'nom', width: 15 },
      { header: 'Prénom', key: 'prenom', width: 15 },
      { header: 'Date Naissance', key: 'date_naissance', width: 15 },
      { header: 'Lieu Naissance', key: 'lieu_naissance', width: 20 },
      { header: 'Adresse', key: 'adresse', width: 30 },
      { header: 'Quartier', key: 'quartier', width: 20 },
      { header: 'Avenue', key: 'avenue', width: 20 },
      { header: 'Type Infraction', key: 'type_infraction', width: 25 },
      { header: 'Niveau Dangerosité', key: 'niveau_dangerosite', width: 18 },
      { header: 'Score Danger', key: 'danger_score', width: 12 },
      { header: 'Parrainage', key: 'parrainage', width: 20 },
      { header: 'Bande', key: 'bande', width: 20 },
      { header: 'Gang', key: 'gang', width: 20 },
      { header: 'Armes Saisies', key: 'armes_saisies', width: 25 },
      { header: 'Objets Saisis', key: 'objets_saisis', width: 25 },
      { header: 'Latitude', key: 'latitude', width: 12 },
      { header: 'Longitude', key: 'longitude', width: 12 },
      { header: 'Date Création', key: 'created_at', width: 20 },
      { header: 'Date Modification', key: 'updated_at', width: 20 },
    ];

    data.criminals.forEach((criminal) => {
      criminalsSheet.addRow({
        id: criminal.id,
        numero_criminel: criminal.numero_criminel,
        nom: criminal.nom,
        prenom: criminal.prenom,
        date_naissance: criminal.date_naissance ? new Date(criminal.date_naissance).toLocaleDateString('fr-FR') : '',
        lieu_naissance: criminal.lieu_naissance,
        adresse: criminal.adresse,
        quartier: criminal.quartier,
        avenue: criminal.avenue,
        type_infraction: Array.isArray(criminal.type_infraction) 
          ? criminal.type_infraction.join(', ') 
          : criminal.type_infraction,
        niveau_dangerosite: criminal.niveau_dangerosite,
        danger_score: criminal.danger_score,
        parrainage: criminal.parrainage,
        bande: criminal.bande,
        gang: criminal.gang,
        armes_saisies: Array.isArray(criminal.armes_saisies) 
          ? criminal.armes_saisies.join(', ') 
          : criminal.armes_saisies,
        objets_saisis: Array.isArray(criminal.objets_saisis) 
          ? criminal.objets_saisis.join(', ') 
          : criminal.objets_saisis,
        latitude: criminal.latitude,
        longitude: criminal.longitude,
        created_at: criminal.created_at ? new Date(criminal.created_at).toLocaleString('fr-FR') : '',
        updated_at: criminal.updated_at ? new Date(criminal.updated_at).toLocaleString('fr-FR') : '',
      });
    });

    // Feuille Cas
    const casesSheet = workbook.addWorksheet('Cas');
    casesSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'ID Criminel', key: 'criminal_id', width: 15 },
      { header: 'Numéro Criminel', key: 'numero_criminel', width: 20 },
      { header: 'Nom Criminel', key: 'criminal_nom', width: 15 },
      { header: 'Prénom Criminel', key: 'criminal_prenom', width: 15 },
      { header: 'Date Arrestation', key: 'date_arrestation', width: 18 },
      { header: 'Lieu Arrestation', key: 'lieu_arrestation', width: 25 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Type Infraction', key: 'type_infraction', width: 25 },
      { header: 'Statut Judiciaire', key: 'statut_judiciaire', width: 20 },
      { header: 'Latitude', key: 'latitude', width: 12 },
      { header: 'Longitude', key: 'longitude', width: 12 },
      { header: 'Date Création', key: 'created_at', width: 20 },
      { header: 'Date Modification', key: 'updated_at', width: 20 },
    ];

    data.cases.forEach((caseItem) => {
      casesSheet.addRow({
        id: caseItem.id,
        criminal_id: caseItem.criminal_id,
        numero_criminel: caseItem.numero_criminel,
        criminal_nom: caseItem.criminal_nom,
        criminal_prenom: caseItem.criminal_prenom,
        date_arrestation: caseItem.date_arrestation ? new Date(caseItem.date_arrestation).toLocaleDateString('fr-FR') : '',
        lieu_arrestation: caseItem.lieu_arrestation,
        description: caseItem.description,
        type_infraction: Array.isArray(caseItem.type_infraction) 
          ? caseItem.type_infraction.join(', ') 
          : caseItem.type_infraction,
        statut_judiciaire: caseItem.statut_judiciaire,
        latitude: caseItem.latitude,
        longitude: caseItem.longitude,
        created_at: caseItem.created_at ? new Date(caseItem.created_at).toLocaleString('fr-FR') : '',
        updated_at: caseItem.updated_at ? new Date(caseItem.updated_at).toLocaleString('fr-FR') : '',
      });
    });

    // Feuille Alertes
    const alertsSheet = workbook.addWorksheet('Alertes');
    alertsSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Titre', key: 'titre', width: 30 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Priorité', key: 'priorite', width: 12 },
      { header: 'ID Criminel', key: 'criminal_id', width: 15 },
      { header: 'ID Cas', key: 'case_id', width: 15 },
      { header: 'Lieu', key: 'lieu', width: 25 },
      { header: 'Latitude', key: 'latitude', width: 12 },
      { header: 'Longitude', key: 'longitude', width: 12 },
      { header: 'Statut', key: 'statut', width: 12 },
      { header: 'Date Création', key: 'created_at', width: 20 },
    ];

    data.alerts.forEach((alert) => {
      alertsSheet.addRow({
        id: alert.id,
        type: alert.type,
        titre: alert.titre,
        description: alert.description,
        priorite: alert.priorite,
        criminal_id: alert.criminal_id,
        case_id: alert.case_id,
        lieu: alert.lieu,
        latitude: alert.latitude,
        longitude: alert.longitude,
        statut: alert.statut,
        created_at: alert.created_at ? new Date(alert.created_at).toLocaleString('fr-FR') : '',
      });
    });

    // Feuille Logs d'Actions
    const logsSheet = workbook.addWorksheet('Logs Actions');
    logsSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'ID Utilisateur', key: 'user_id', width: 15 },
      { header: 'Email Utilisateur', key: 'user_email', width: 25 },
      { header: 'Nom Utilisateur', key: 'user_nom', width: 15 },
      { header: 'Prénom Utilisateur', key: 'user_prenom', width: 15 },
      { header: 'Type Action', key: 'action_type', width: 15 },
      { header: 'Type Entité', key: 'entity_type', width: 15 },
      { header: 'ID Entité', key: 'entity_id', width: 15 },
      { header: 'Détails', key: 'details', width: 40 },
      { header: 'Date', key: 'created_at', width: 20 },
    ];

    data.actionLogs.forEach((log) => {
      logsSheet.addRow({
        id: log.id,
        user_id: log.user_id,
        user_email: log.user_email,
        user_nom: log.user_nom,
        user_prenom: log.user_prenom,
        action_type: log.action_type,
        entity_type: log.entity_type,
        entity_id: log.entity_id,
        details: typeof log.details === 'string' ? log.details : JSON.stringify(log.details),
        created_at: log.created_at ? new Date(log.created_at).toLocaleString('fr-FR') : '',
      });
    });

    // Générer le nom du fichier
    const timestamp = date.toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `backup_${timestamp}.xlsx`;
    const dateFolder = this.getDateFolder();
    const filepath = path.join(dateFolder, filename);

    // Sauvegarder le fichier
    await workbook.xlsx.writeFile(filepath);

    return filepath;
  }
}

