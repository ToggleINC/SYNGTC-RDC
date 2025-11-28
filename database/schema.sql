-- SYNGTC-RDC Database Schema
-- Système National de Gestion et de Traçabilité des Criminels en RDC

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Note: PostGIS n'est pas nécessaire, nous utilisons DECIMAL pour les coordonnées GPS

-- Table des utilisateurs (agents, superviseurs, admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    role VARCHAR(50) NOT NULL CHECK (role IN ('agent', 'superviseur', 'admin_pnc', 'admin_anr', 'admin_ministere')),
    poste VARCHAR(255) NOT NULL, -- Ex: "Commissariat de Kasavubu", "CIAT Kintambo"
    region VARCHAR(100) NOT NULL, -- Ex: "Kinshasa", "Lubumbashi", "Goma"
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des sessions utilisateurs (traçabilité)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des criminels
CREATE TABLE criminals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_criminel VARCHAR(50) UNIQUE NOT NULL, -- Format: CR-{timestamp}-{random}
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE,
    lieu_naissance VARCHAR(255),
    adresse TEXT NOT NULL,
    quartier VARCHAR(255) NOT NULL,
    avenue VARCHAR(255),
    region VARCHAR(100),
    type_infraction JSONB NOT NULL, -- Array: ["kuluna", "braquage", "vol"]
    niveau_dangerosite VARCHAR(20) NOT NULL CHECK (niveau_dangerosite IN ('faible', 'modere', 'eleve')),
    danger_score DECIMAL(5,2) DEFAULT 0, -- Score IA 0-100
    parrainage VARCHAR(255), -- Nom du parrain si connu
    bande VARCHAR(255), -- Nom de la bande
    gang VARCHAR(255), -- Nom du gang
    armes_saisies JSONB DEFAULT '[]', -- Array des armes
    objets_saisis JSONB DEFAULT '[]', -- Array des objets
    photo_url VARCHAR(500),
    empreintes_url VARCHAR(500), -- URL du fichier d'empreintes
    latitude DECIMAL(10, 8), -- GPS
    longitude DECIMAL(11, 8), -- GPS
    is_recidivist BOOLEAN DEFAULT false,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_criminals_numero ON criminals(numero_criminel);
CREATE INDEX idx_criminals_nom ON criminals(nom, prenom);
CREATE INDEX idx_criminals_quartier ON criminals(quartier);
CREATE INDEX idx_criminals_type_infraction ON criminals USING GIN(type_infraction);
CREATE INDEX idx_criminals_location ON criminals(latitude, longitude);
CREATE INDEX idx_criminals_danger ON criminals(danger_score DESC);
CREATE INDEX idx_criminals_recidivist ON criminals(is_recidivist) WHERE is_recidivist = true;

-- Table des cas (arrestations, incidents)
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_cas VARCHAR(50) UNIQUE NOT NULL, -- Format: CAS-{timestamp}-{random}
    criminal_id UUID REFERENCES criminals(id) ON DELETE CASCADE,
    date_arrestation TIMESTAMP NOT NULL,
    lieu_arrestation VARCHAR(255) NOT NULL,
    type_infraction JSONB NOT NULL,
    description TEXT,
    temoins JSONB DEFAULT '[]', -- Array des témoins
    preuves JSONB DEFAULT '[]', -- Array des preuves (photos, vidéos, objets)
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    poste_police VARCHAR(255) NOT NULL, -- Poste qui a enregistré
    agent_arrestant VARCHAR(255),
    statut_judiciaire VARCHAR(50) DEFAULT 'enquete' CHECK (statut_judiciaire IN ('enquete', 'mandat', 'condamne', 'libere', 'recours')),
    parquet_id VARCHAR(100), -- ID du parquet
    date_liberation DATE,
    date_condamnation DATE,
    mandat TEXT,
    recours TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cases_criminal ON cases(criminal_id);
CREATE INDEX idx_cases_date ON cases(date_arrestation DESC);
CREATE INDEX idx_cases_statut ON cases(statut_judiciaire);
CREATE INDEX idx_cases_poste ON cases(poste_police);
CREATE INDEX idx_cases_location ON cases(latitude, longitude);

-- Table des alertes
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('dangerous_criminal', 'recidivist', 'gang_activity', 'zone_rouge', 'other')),
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priorite VARCHAR(20) NOT NULL CHECK (priorite IN ('faible', 'moyenne', 'elevee', 'critique')),
    statut VARCHAR(20) DEFAULT 'non_lue' CHECK (statut IN ('non_lue', 'lue', 'traitee')),
    criminal_id UUID REFERENCES criminals(id) ON DELETE SET NULL,
    location JSONB, -- {latitude, longitude, quartier}
    metadata JSONB, -- Données supplémentaires
    created_by UUID REFERENCES users(id),
    read_by UUID REFERENCES users(id),
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_alerts_type ON alerts(type);
CREATE INDEX idx_alerts_statut ON alerts(statut);
CREATE INDEX idx_alerts_priorite ON alerts(priorite DESC);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);

-- Table des logs d'actions (traçabilité complète)
CREATE TABLE action_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, VIEW
    entity_type VARCHAR(50) NOT NULL, -- criminal, case, alert, etc.
    entity_id UUID,
    details JSONB, -- Détails de l'action
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_action_logs_user ON action_logs(user_id);
CREATE INDEX idx_action_logs_entity ON action_logs(entity_type, entity_id);
CREATE INDEX idx_action_logs_date ON action_logs(created_at DESC);

-- Table des zones rouges (hotspots)
CREATE TABLE hotspots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quartier VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    nombre_cas INTEGER DEFAULT 0,
    niveau_danger VARCHAR(20) CHECK (niveau_danger IN ('faible', 'modere', 'eleve')),
    types_infractions JSONB,
    dernier_incident TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_hotspots_quartier ON hotspots(quartier);
CREATE INDEX idx_hotspots_danger ON hotspots(niveau_danger);

-- Table des parquets (interconnexion judiciaire)
CREATE TABLE parquets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    adresse TEXT,
    telephone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table de synchronisation avec ANR et Ministère
CREATE TABLE sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    destination VARCHAR(50) NOT NULL CHECK (destination IN ('anr', 'ministere', 'backup_kinshasa', 'backup_lubumbashi')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'success', 'failed')),
    error_message TEXT,
    synced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sync_logs_entity ON sync_logs(entity_type, entity_id);
CREATE INDEX idx_sync_logs_status ON sync_logs(status);

-- Table des fichiers (photos, vidéos, documents)
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- photo, video, document, empreintes
    file_size INTEGER,
    mime_type VARCHAR(100),
    entity_type VARCHAR(50), -- criminal, case
    entity_id UUID,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_files_entity ON files(entity_type, entity_id);

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

CREATE TRIGGER update_hotspots_updated_at BEFORE UPDATE ON hotspots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vue pour les statistiques des récidivistes
CREATE OR REPLACE VIEW recidivistes_stats AS
SELECT 
    c.id,
    c.numero_criminel,
    c.nom,
    c.prenom,
    c.quartier,
    COUNT(cs.id) as nombre_cas,
    MAX(cs.date_arrestation) as dernier_cas,
    c.danger_score
FROM criminals c
INNER JOIN cases cs ON c.id = cs.criminal_id
WHERE c.is_recidivist = true
GROUP BY c.id, c.numero_criminel, c.nom, c.prenom, c.quartier, c.danger_score
ORDER BY nombre_cas DESC;

-- Vue pour les zones rouges
CREATE OR REPLACE VIEW zones_rouges AS
SELECT 
    quartier,
    region,
    COUNT(*) as nombre_criminels,
    COUNT(CASE WHEN niveau_dangerosite = 'eleve' THEN 1 END) as danger_eleve,
    AVG(danger_score) as score_moyen,
    AVG(latitude) as latitude,
    AVG(longitude) as longitude
FROM criminals
WHERE latitude IS NOT NULL AND longitude IS NOT NULL
GROUP BY quartier, region
HAVING COUNT(*) >= 3
ORDER BY nombre_criminels DESC;

