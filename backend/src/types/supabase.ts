/**
 * Types Supabase générés automatiquement
 * 
 * ⚠ IMPORTANT : Ce fichier doit être régénéré après chaque modification du schéma Supabase
 * 
 * Pour générer les types :
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
 * 
 * Pour trouver votre PROJECT_ID :
 * 1. Allez sur https://supabase.com/dashboard
 * 2. Sélectionnez votre projet
 * 3. Allez dans Settings → API
 * 4. L'ID du projet se trouve dans l'URL ou dans les paramètres
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          nom: string | null
          prenom: string | null
          role: string
          poste: string | null
          region: string | null
          telephone: string | null
          is_active: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          nom?: string | null
          prenom?: string | null
          role?: string
          poste?: string | null
          region?: string | null
          telephone?: string | null
          is_active?: boolean
          created_at?: string | Date
          updated_at?: string | Date | null
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          nom?: string | null
          prenom?: string | null
          role?: string
          poste?: string | null
          region?: string | null
          telephone?: string | null
          is_active?: boolean
          created_at?: string | Date
          updated_at?: string | Date | null
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string | Date
        }
        Update: {
          id?: string
          user_id?: string
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string | Date
        }
      }
      criminals: {
        Row: {
          id: string
          numero_criminel: string
          nom: string
          prenom: string
          date_naissance: string | null
          lieu_naissance: string | null
          adresse: string | null
          quartier: string | null
          avenue: string | null
          type_infraction: Json | null
          niveau_dangerosite: string | null
          danger_score: number | null
          parrainage: string | null
          bande: string | null
          gang: string | null
          armes_saisies: Json | null
          objets_saisis: Json | null
          latitude: number | null
          longitude: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          numero_criminel: string
          nom: string
          prenom: string
          date_naissance?: string | null
          lieu_naissance?: string | null
          adresse?: string | null
          quartier?: string | null
          avenue?: string | null
          type_infraction?: Json | null
          niveau_dangerosite?: string | null
          danger_score?: number | null
          parrainage?: string | null
          bande?: string | null
          gang?: string | null
          armes_saisies?: Json | null
          objets_saisis?: Json | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string | Date
          updated_at?: string | Date | null
        }
        Update: {
          id?: string
          numero_criminel?: string
          nom?: string
          prenom?: string
          date_naissance?: string | null
          lieu_naissance?: string | null
          adresse?: string | null
          quartier?: string | null
          avenue?: string | null
          type_infraction?: Json | null
          niveau_dangerosite?: string | null
          danger_score?: number | null
          parrainage?: string | null
          bande?: string | null
          gang?: string | null
          armes_saisies?: Json | null
          objets_saisis?: Json | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string | Date
          updated_at?: string | Date | null
        }
      }
      cases: {
        Row: {
          id: string
          criminal_id: string
          date_arrestation: string | null
          lieu_arrestation: string | null
          description: string | null
          type_infraction: Json | null
          statut_judiciaire: string | null
          latitude: number | null
          longitude: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          criminal_id: string
          date_arrestation?: string | null
          lieu_arrestation?: string | null
          description?: string | null
          type_infraction?: Json | null
          statut_judiciaire?: string | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string | Date
          updated_at?: string | Date | null
        }
        Update: {
          id?: string
          criminal_id?: string
          date_arrestation?: string | null
          lieu_arrestation?: string | null
          description?: string | null
          type_infraction?: Json | null
          statut_judiciaire?: string | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string | Date
          updated_at?: string | Date | null
        }
      }
      alerts: {
        Row: {
          id: string
          type: string
          titre: string
          description: string | null
          priorite: string | null
          criminal_id: string | null
          case_id: string | null
          location: Json | null
          metadata: Json | null
          statut: string
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          titre: string
          description?: string | null
          priorite?: string | null
          criminal_id?: string | null
          case_id?: string | null
          location?: Json | null
          metadata?: Json | null
          statut?: string
          created_at?: string | Date
        }
        Update: {
          id?: string
          type?: string
          titre?: string
          description?: string | null
          priorite?: string | null
          criminal_id?: string | null
          case_id?: string | null
          location?: Json | null
          metadata?: Json | null
          statut?: string
          created_at?: string | Date
        }
      }
      action_logs: {
        Row: {
          id: string
          user_id: string
          action_type: string
          entity_type: string
          entity_id: string | null
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action_type: string
          entity_type: string
          entity_id?: string | null
          details?: Json | null
          created_at?: string | Date
        }
        Update: {
          id?: string
          user_id?: string
          action_type?: string
          entity_type?: string
          entity_id?: string | null
          details?: Json | null
          created_at?: string | Date
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

