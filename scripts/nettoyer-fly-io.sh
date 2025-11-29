#!/bin/bash
# Script de nettoyage pour Fly.io
# Supprime les machines créées lors d'un mauvais déploiement

echo "========================================"
echo "Nettoyage Fly.io - Machines"
echo "========================================"
echo ""

# Vérifier que flyctl est installé
if ! command -v flyctl &> /dev/null; then
    echo "[ERREUR] flyctl n'est pas installé."
    echo "Installez-le depuis : https://fly.io/docs/hands-on/install-flyctl/"
    exit 1
fi

echo "[1/4] Liste des applications Fly.io..."
flyctl apps list
echo ""

echo "[2/4] Liste des machines de l'application syngtc-rdc..."
flyctl machines list -a syngtc-rdc
echo ""

echo "[3/4] ATTENTION : Voulez-vous supprimer toutes les machines ?"
echo "Cela supprimera toutes les machines de l'application syngtc-rdc."
echo ""
read -p "Tapez 'OUI' pour confirmer : " confirm

if [ "$confirm" != "OUI" ]; then
    echo "Nettoyage annulé."
    exit 0
fi

echo ""
echo "[4/4] Suppression des machines..."
flyctl machines list -a syngtc-rdc --json | jq -r '.[].id' | while read machine_id; do
    echo "Suppression de la machine $machine_id..."
    flyctl machines destroy "$machine_id" --force -a syngtc-rdc
done

echo ""
echo "========================================"
echo "Nettoyage terminé !"
echo "========================================"
echo ""
echo "Vous pouvez maintenant redéployer avec :"
echo "  flyctl deploy --remote-only"
echo ""

