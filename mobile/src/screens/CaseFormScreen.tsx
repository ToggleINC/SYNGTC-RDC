import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const CaseFormScreen: React.FC = () => {
  const [criminalId, setCriminalId] = useState('');
  const [lieu, setLieu] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const getCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'La géolocalisation est nécessaire');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      Alert.alert('Succès', 'Position GPS enregistrée');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'obtenir la position');
    } finally {
      setGettingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!criminalId || !lieu) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/cases`, {
        criminal_id: criminalId,
        date_arrestation: new Date().toISOString(),
        lieu_arrestation: lieu,
        type_infraction: ['kuluna'],
        description,
        latitude: location?.latitude,
        longitude: location?.longitude,
      });
      Alert.alert('Succès', 'Cas enregistré avec succès');
      // Reset form
      setCriminalId('');
      setLieu('');
      setDescription('');
      setLocation(null);
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.error || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>ID Criminel *</Text>
        <TextInput
          style={styles.input}
          value={criminalId}
          onChangeText={setCriminalId}
          placeholder="Numéro criminel ou ID"
        />

        <Text style={styles.label}>Lieu d'arrestation *</Text>
        <TextInput
          style={styles.input}
          value={lieu}
          onChangeText={setLieu}
          placeholder="Quartier, avenue..."
        />

        <TouchableOpacity
          style={styles.locationButton}
          onPress={getCurrentLocation}
          disabled={gettingLocation}
        >
          {gettingLocation ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.locationButtonText}>
              {location ? 'Position GPS enregistrée ✓' : 'Obtenir position GPS'}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Détails de l'arrestation..."
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Enregistrer le cas</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  locationButton: {
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CaseFormScreen;

