import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import InterventionPopup from './InterventionPopup';

const ClientDetail = ({ route }) => {
  const { client } = route.params;
  const [interventions, setInterventions] = useState([]);
  const navigation = useNavigation();
  const [selectedIntervention, setSelectedIntervention] = useState(null);

  useEffect(() => {
    fetchInterventions();
  }, []);

  const fetchInterventions = async () => {
    try {
      const response = await fetch(`http://192.168.100.16:3000/interventions/${client.id}`);
      const data = await response.json();
      setInterventions(data);
    } catch (error) {
      console.error('Error fetching interventions:', error);
    }
  };

  const openInterventionPopup = (intervention) => {
    setSelectedIntervention(intervention);
  };

  const closeInterventionPopup = () => {
    setSelectedIntervention(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Client Detail</Text>
      <Text style={styles.info}>Name: {client.name}</Text>
      <Text style={styles.info}>Phone Number: {client.phoneNumber}</Text>
      <Text style={styles.info}>Address: {client.address}</Text>
      <Text style={styles.info}>Pool Size: {client.poolSize}</Text>

      {client.clientImage && <Image source={{ uri: client.clientImage }} style={styles.image} />}

      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddIntervention', { client })}
        >
          <Text style={styles.addButtonText}>Add Intervention</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.interventionsContainer}>
        {interventions.length > 0 ? (
          interventions.map((intervention) => (
            <TouchableOpacity
              key={intervention.id}
              style={styles.interventionButton}
              onPress={() => openInterventionPopup(intervention)}
            >
              <Text style={styles.interventionButtonText}>{intervention.date}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No interventions found.</Text>
        )}
      </View>

      {selectedIntervention && (
        <InterventionPopup
          intervention={selectedIntervention}
          client={client}
          onClose={closeInterventionPopup}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  contentContainer: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  box: {
    width: '48%',
    backgroundColor: '#444444',
    padding: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  greenText: {
    color: '#00FF00',
  },
  buttonContainer: {
    marginTop: 24,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    color: '#FFFFFF',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  addButtonContainer: {
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  interventionsContainer: {},
  interventionButton: {
    marginBottom: 8,
    backgroundColor: '#666666', // Darker gray color
    borderRadius: 8,
    paddingVertical: 12,
  },
  interventionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ClientDetail;
