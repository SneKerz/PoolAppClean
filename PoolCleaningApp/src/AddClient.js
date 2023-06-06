import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// Define a custom style object for the components
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 10,
  },
  input: {
    height: 40,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    color: '#fff',
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#555',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 10,
  },
};

const AddClient = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [poolSize, setPoolSize] = useState('');
  const [clientImage, setClientImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setClientImage(result.uri);
    }
  };

 
 const handleAddClient = async () => {
 // Create a new client object
 const newClient = {
 name: name,
 phoneNumber: phoneNumber,
 address: address,
 poolSize: poolSize,
 clientImage: clientImage,
 interventions: [{}]
 };

 try {
 const response = await fetch('http://192.168.100.16:3000/clients', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 },
 body: JSON.stringify(newClient),
 });

 if (response.ok) {
 Alert.alert('Success', 'Client adăugat');
 if (typeof onClientAdded === 'function') {
 onClientAdded(); // Invoke the onClientAdded callback if it's a function
 }
 } else {
 Alert.alert('Error', 'Clientul NU a fost adăugat');
 }
 } catch (error) {
 console.error('Error adding client:', error);
 Alert.alert('Error', 'Failed to add client');
 }
 };

 return (
 <View style={styles.container}>
 <TextInput style={styles.input} placeholder="Nume Client" placeholderTextColor="#999" value={name} onChangeText={setName} />
 <TextInput keyboardType="numeric" style={styles.input} placeholder="Număr de telefon client" placeholderTextColor="#999" value={phoneNumber} onChangeText={setPhoneNumber} />
 <TextInput style={styles.input} placeholder="Adresă client" placeholderTextColor="#999" value={address} onChangeText={setAddress} />
 <TextInput keyboardType="numeric" style={styles.input} placeholder="Dimensiune piscină (mc)" placeholderTextColor="#999" value={poolSize} onChangeText={setPoolSize} />
 <TouchableOpacity style={styles.button} onPress={pickImage}>
 <Text style={styles.buttonText}>Select Image</Text>
 </TouchableOpacity>
 {clientImage && <Image source={{ uri: clientImage }} style={styles.image} />}
 <Button title="Submit" onPress={handleAddClient} />
 </View>
 );
 
};

export default AddClient;
