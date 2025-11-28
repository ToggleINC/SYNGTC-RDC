-- Données de test pour SYNGTC-RDC

-- Utilisateurs de test
INSERT INTO users (email, password_hash, nom, prenom, role, poste, region) VALUES
('admin@ministere.rdc', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Admin', 'Ministère', 'admin_ministere', 'Ministère de l''Intérieur', 'Kinshasa'),
('superviseur@pnc.rdc', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Superviseur', 'PNC', 'superviseur', 'Direction PNC', 'Kinshasa'),
('agent.kasavubu@pnc.rdc', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Agent', 'Kasavubu', 'agent', 'Commissariat Kasavubu', 'Kinshasa'),
('agent.kintambo@pnc.rdc', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Agent', 'Kintambo', 'agent', 'CIAT Kintambo', 'Kinshasa');

-- Parquets de test
INSERT INTO parquets (nom, region, adresse, telephone) VALUES
('Parquet de Kinshasa-Gombe', 'Kinshasa', 'Avenue de la Justice, Gombe', '+243 900 000 001'),
('Parquet de Kinshasa-Kintambo', 'Kinshasa', 'Avenue Kintambo', '+243 900 000 002'),
('Parquet de Lubumbashi', 'Lubumbashi', 'Centre-ville Lubumbashi', '+243 900 000 003');

-- Note: Les mots de passe de test sont "password123" (à changer en production)

