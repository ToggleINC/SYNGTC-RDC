import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const CriminalDetailScreen: React.FC = ({ route }: any) => {
  const { criminalId } = route.params;
  const [criminal, setCriminal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCriminal();
  }, []);

  const fetchCriminal = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/criminals/${criminalId}`);
      setCriminal(response.data.criminal);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!criminal) {
    return (
      <View style={styles.center}>
        <Text>Criminel introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>
          {criminal.nom} {criminal.prenom}
        </Text>
        <Text style={styles.number}>{criminal.numero_criminel}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Quartier:</Text>
          <Text style={styles.value}>{criminal.quartier}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Dangerosité:</Text>
          <Text style={styles.value}>{criminal.niveau_dangerosite}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Score:</Text>
          <Text style={styles.value}>{criminal.danger_score}/100</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#1976d2',
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  number: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CriminalDetailScreen;

