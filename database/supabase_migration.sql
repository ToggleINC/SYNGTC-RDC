-- Migration SQL pour Supabase
-- Ce fichier contient le schéma complet adapté pour Supabase

-- Extension pour UUID (déjà disponible dans Supabase)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- Non nécessaire, Supabase l'a déjà

-- Table des utilisateurs (agents, superviseurs, admins)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    role VARCHAR(50) NOT NULL CHECK (role IN ('agent', 'superviseur', 'admin_pnc', 'admin_anr', 'admin_ministere')),
    poste VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des sessions utilisateurs (traçabilité)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des criminels
CREATE TABLE IF NOT EXISTS criminals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_criminel VARCHAR(50) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE,
    lieu_naissance VARCHAR(255),
    adresse TEXT NOT NULL,
    quartier VARCHAR(255) NOT NULL,
    avenue VARCHAR(255),
    region VARCHAR(100),
    type_infraction JSONB NOT NULL,
    niveau_dangerosite VARCHAR(20) NOT NULL CHECK (niveau_dangerosite IN ('faible', 'modere', 'eleve')),
    danger_score DECIMAL(5,2) DEFAULT 0,
    parrainage VARCHAR(255),
    bande VARCHAR(255),
    gang VARCHAR(255),
    armes_saisies JSONB DEFAULT '[]',
    objets_saisis JSONB DEFAULT '[]',
    photo_url VARCHAR(500),
    empreintes_url VARCHAR(500),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_recidivist BOOLEAN DEFAULT false,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_criminals_numero ON criminals(numero_criminel);
CREATE INDEX IF NOT EXISTS idx_criminals_nom ON criminals(nom, prenom);
CREATE INDEX IF NOT EXISTS idx_criminals_quartier ON criminals(quartier);
CREATE INDEX IF NOT EXISTS idx_criminals_type_infraction ON criminals USING GIN(type_infraction);
CREATE INDEX IF NOT EXISTS idx_criminals_location ON criminals(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_criminals_danger ON criminals(danger_score DESC);
CREATE INDEX IF NOT EXISTS idx_criminals_recidivist ON criminals(is_recidivist) WHERE is_recidivist = true;

-- Table des cas (arrestations, incidents)
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_cas VARCHAR(50) UNIQUE NOT NULL,
    criminal_id UUID REFERENCES criminals(id) ON DELETE CASCADE,
    date_arrestation TIMESTAMP NOT NULL,
    lieu_arrestation VARCHAR(255) NOT NULL,
    type_infraction JSONB NOT NULL,
    description TEXT,
    temoins JSONB DEFAULT '[]',
    preuves JSONB DEFAULT '[]',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    poste_police VARCHAR(255) NOT NULL,
    agent_arrestant VARCHAR(255),
    statut_judiciaire VARCHAR(50) DEFAULT 'enquete' CHECK (statut_judiciaire IN ('enquete', 'mandat', 'condamne', 'libere', 'recours')),
    parquet_id VARCHAR(100),
    date_liberation DATE,
    date_condamnation DATE,
    mandat TEXT,
    recours TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cases_criminal ON cases(criminal_id);
CREATE INDEX IF NOT EXISTS idx_cases_date ON cases(date_arrestation DESC);
CREATE INDEX IF NOT EXISTS idx_cases_statut ON cases(statut_judiciaire);
CREATE INDEX IF NOT EXISTS idx_cases_location ON cases(latitude, longitude);

-- Table des alertes
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    priorite VARCHAR(20) DEFAULT 'moyenne' CHECK (priorite IN ('faible', 'moyenne', 'elevee')),
    criminal_id UUID REFERENCES criminals(id) ON DELETE SET NULL,
    case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
    is_lue BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);
CREATE INDEX IF NOT EXISTS idx_alerts_priorite ON alerts(priorite);
CREATE INDEX IF NOT EXISTS idx_alerts_lue ON alerts(is_lue);

-- Table des logs d'actions (traçabilité)
CREATE TABLE IF NOT EXISTS action_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_action_logs_user ON action_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_action_logs_entity ON action_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_action_logs_date ON action_logs(created_at DESC);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_criminals_updated_at BEFORE UPDATE ON criminals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

