import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ScrollView, TouchableHighlight } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('lastIntervention');
  const navigation = useNavigation();
 
  useEffect(() => {
    fetchClients();
  }, []);
 
  useFocusEffect(
    React.useCallback(() => {
      fetchClients();
    }, [])
  );
 
  const fetchClients = async () => {
    try {
      const response = await fetch('http://192.168.100.16:3000/clients');
      const data = await response.json();
      setClients(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  const handleSort = async () => {
    if (sortOption === 'lastIntervention') {
      try {
        setLoading(true);
        const response = await fetch('http://192.168.100.16:3000/interventions');
        const allInterventions = await response.json();
 
        const clientsWithLastIntervention = clients.map((client) => {
          const clientInterventions = allInterventions.filter(
            (intervention) => intervention.clientId === client.id
          );
          if (clientInterventions.length > 0) {
            client.lastInterventionDate = clientInterventions[
              clientInterventions.length - 1
            ].date;
          } else {
            client.lastInterventionDate = null;
          }
          return client;
        });
 
        setClients(clientsWithLastIntervention);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching interventions:', error);
        setLoading(false);
      }
    } else {
      setClients([...clients].sort((a, b) => a.name.localeCompare(b.name)));
    }
  };
 
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
 

 
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Adaugă client nou"
          onPress={() => navigation.navigate('AddClient')}
        />
      </View>
     
      <TextInput
        style={styles.searchBar}
        placeholder="🔎 Căutare client după nume"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
     
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <Text style={styles.loadingText}>Încărcare clienți...</Text>
        ) : (
          <View>
            {filteredClients.map((client) => (
              <TouchableHighlight
                key={client.id}
                onPress={() => navigation.navigate('ClientDetail', { client })}
                style={styles.button}
              >
                <Text style={styles.buttonText}>{client.name}</Text>
              </TouchableHighlight>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#333333',
  },
  buttonContainer: {
    marginBottom: 40,
    marginTop: 40,
  },
  searchBar: {
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#333333',
    fontSize: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  loadingText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  button: {
    marginBottom: 8,
    backgroundColor: '#666666',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
 
export default ClientList;
