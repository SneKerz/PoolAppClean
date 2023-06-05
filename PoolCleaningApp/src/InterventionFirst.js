import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const InterventionFirst = ({ route }) => {
  const { client } = route.params;
  const fieldsInitialState = {
    clor: '',
    pH: '',
    temperature: '',
    duritate: '',
    alcalinitate: '',
    salinitate: '',
    clorRapid: '',
    clorLent: '',
    antialgic: '',
    floculant: '',
    calcar: '',
    clorTab: '',
    clorGr: '',
    clGranule: '',
    clTablete: '',
    clLichid: '',
    pHGranule: '',
    anticalcar: '',
    sare: '',
    pHLichid: '',
    bicarbonat: '',
    observatii: '',
  };

  const [fields, setFields] = useState(fieldsInitialState);
  const [image, setImage] = useState(null);
  const [hasImage, setHasImage] = useState(false);

  const labels = Object.keys(fields);

  const fieldRefs = labels.reduce((acc, label) => {
    acc[label] = useRef(null);
    return acc;
  }, {});

  const [emptyFields, setEmptyFields] = useState([]);

  const handleInputChange = (name, value) => {
    setFields(prevFields => ({ ...prevFields, [name]: value }));
  };

  const openCamera = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Denied', 'Permission to access camera was denied');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      setHasImage(true);
    }
  };

  // const validateFields = () => {
  //   const tempEmptyFields = [];

  //   for (const field in fields) {
  //     if (!fields[field]) {
  //       tempEmptyFields.push(field);
  //     }
  //   }

  //   setEmptyFields(tempEmptyFields);

  //   return tempEmptyFields.length === 0;
  // };

  const handleSubmit = async () => {
    // if (!validateFields()) {
    //   return;
    // }

    const newIntervention = {
      clientId: client.id,
      date: new Date().toISOString().split('T')[0],
      ...fields,
      interventionImage: image,
    };

    try {
      const response = await fetch(`http://192.168.100.16:3000/interventions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newIntervention),
      });

      if (response.ok) {
        Alert.alert('Success', 'Intervention added successfully');
      } else {
        Alert.alert('Error', 'Failed to add intervention');
      }
    } catch (error) {
      console.error('Error adding intervention:', error);
      Alert.alert('Error', 'Failed to add intervention');
    }
  };

  useEffect(() => {
    openCamera();
  }, []);
  
  useEffect(() => {
    const firstEmptyField = emptyFields[0];
    if (firstEmptyField && fieldRefs[firstEmptyField].current) {
      fieldRefs[firstEmptyField].current.focus();
    }
  }, [emptyFields]);



  return (
    <ScrollView style={styles.container}>
      {hasImage && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity onPress={openCamera} style={styles.captureButton}>
        <Text style={styles.captureButtonText}>Capture Image</Text>
      </TouchableOpacity>

      {!hasImage && <Text style={styles.noImageText}>Please capture an image first</Text>}

      {hasImage && (
        <>
        <View style={styles.categoryContainer}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryHeaderText}>Data Intervenției</Text>
        </View>
        <View style={styles.categoryContent}>
          <Text style={styles.categoryContentText}>{new Date().toISOString().split('T')[0]}</Text>
        </View>
      </View>
  
      <View style={styles.categoryContainer}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryHeaderText}>Numele Clientului</Text>
        </View>
        <View style={styles.categoryContent}>
          <Text style={styles.clientName}>{client.name}</Text>
          <Text style={styles.clientInfo}>{client.phoneNumber}</Text>
          <Text style={styles.clientInfo}>{client.address}</Text>
          <Text style={styles.clientInfo}>Dimensiune Piscină: {client.poolSize}</Text>
        </View>
      </View>
  
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Valori Măsurate</Text>
      </View>
  
      <View style={styles.line} />
  
      <View style={styles.row}>
        <View style={styles.collumn}>
          <Text style={styles.label}>Clor</Text>
          <TextInput
            ref={fieldRefs.clor}
            style={[
              styles.value,
              emptyFields.includes('clor') && styles.inputError,
            ]}
            placeholder="Clor"
            value={fields.clor}
            onChangeText={value => handleInputChange('clor', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.collumn}>
          <Text style={styles.label}>Duritate</Text>
          <TextInput
            ref={fieldRefs.duritate}
            style={[
              styles.value,
              emptyFields.includes('duritate') && styles.inputError,
            ]}
            placeholder="Duritate"
            value={fields.duritate}
            onChangeText={value => handleInputChange('duritate', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
  
      <View style={styles.row}>
        <View style={styles.collumn}>
          <Text style={styles.label}>pH</Text>
          <TextInput
            ref={fieldRefs.pH}
            style={[
              styles.value,
              emptyFields.includes('pH') && styles.inputError,
            ]}
            placeholder="pH"
            value={fields.pH}
            onChangeText={value => handleInputChange('pH', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.collumn}>
          <Text style={styles.label}>Alcalinitate</Text>
          <TextInput
            ref={fieldRefs.alcalinitate}
            style={[
              styles.value,
              emptyFields.includes('alcalinitate') && styles.inputError,
            ]}
            placeholder="Alcalinitate"
            value={fields.alcalinitate}
            onChangeText={value => handleInputChange('alcalinitate', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
  
      <View style={styles.row}>
        <View style={styles.collumn}>
          <Text style={styles.label}>Temperatură</Text>
          <TextInput
            ref={fieldRefs.temperature}
            style={[
              styles.value,
              emptyFields.includes('temperature') && styles.inputError,
            ]}
            placeholder="Temperatură"
            value={fields.temperature}
            onChangeText={value => handleInputChange('temperature', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.collumn}>
          <Text style={styles.label}>Salinitate</Text>
          <TextInput
            ref={fieldRefs.salinitate}
            style={[
              styles.value,
              emptyFields.includes('salinitate') && styles.inputError,
            ]}
            placeholder="Salinitate"
            value={fields.salinitate}
            onChangeText={value => handleInputChange('salinitate', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
  
      <View style={styles.line} />
  
      <View style={styles.row}>
        <View style={styles.collumn}>
          <Text style={styles.label}>Recomandare</Text>
        </View>
        <View style={styles.collumn}>
          <Text style={styles.label}>Clor Tab</Text>
          <TextInput
            ref={fieldRefs.clorTab}
            style={[
              styles.value,
              emptyFields.includes('clorTab') && styles.inputError,
            ]}
            placeholder="Clor Tab"
            value={fields.clorTab}
            onChangeText={value => handleInputChange('clorTab', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
  
      <View style={styles.row}>
        <View style={styles.collumn}>
          <Text style={styles.label}>Clor Gr.</Text>
          <TextInput
            ref={fieldRefs.clorGr}
            style={[
              styles.value,
              emptyFields.includes('clorGr') && styles.inputError,
            ]}
            placeholder="Clor Gr."
            value={fields.clorGr}
            onChangeText={value => handleInputChange('clorGr', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.collumn}>
          <Text style={styles.label}>pH</Text>
          <TextInput
            ref={fieldRefs.pH}
            style={[
              styles.value,
              emptyFields.includes('pH') && styles.inputError,
            ]}
            placeholder="pH"
            value={fields.pH}
            onChangeText={value => handleInputChange('pH', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
  
      <View style={styles.row}>
        <View style={styles.collumn}>
          <Text style={styles.label}>Antialgic</Text>
          <TextInput
            ref={fieldRefs.antialgic}
            style={[
              styles.value,
              emptyFields.includes('antialgic') && styles.inputError,
            ]}
            placeholder="Antialgic"
            value={fields.antialgic}
            onChangeText={value => handleInputChange('antialgic', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
  
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Tratament chimic</Text>
      </View>
  
      <View style={styles.line} />
  
      <View style={styles.row}>
        <View style={styles.collumn}>
          <Text style={styles.label}>Cl. Granule</Text>
          <TextInput
            ref={fieldRefs.clGranule}
            style={[
              styles.value,
              emptyFields.includes('clGranule') && styles.inputError,
            ]}
            placeholder="Cl. Granule"
            value={fields.clGranule}
            onChangeText={value => handleInputChange('clGranule', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.collumn}>
          <Text style={styles.label}>Anticalcar</Text>
          <TextInput
            ref={fieldRefs.anticalcar}
            style={[
              styles.value,
              emptyFields.includes('anticalcar') && styles.inputError,
            ]}
            placeholder="Anticalcar"
            value={fields.anticalcar}
            onChangeText={value => handleInputChange('anticalcar', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
  
      <View style={styles.row}>
        <View style={styles.collumn}>
          <Text style={styles.label}>Cl. Tablete</Text>
          <TextInput
            ref={fieldRefs.clTablete}
            style={[
              styles.value,
              emptyFields.includes('clTablete') && styles.inputError,
            ]}
            placeholder="Cl. Tablete"
            value={fields.clTablete}
            onChangeText={value => handleInputChange('clTablete', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.collumn}>
          <Text style={styles.label}>Floculant</Text>
          <TextInput
            ref={fieldRefs.floculant}
            style={[
              styles.value,
              emptyFields.includes('floculant') && styles.inputError,
            ]}
            placeholder="Floculant"
            value={fields.floculant}
            onChangeText={value => handleInputChange('floculant', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
  
      <View style={styles.row}>
        <View style={styles.collumn}>
          <Text style={styles.label}>Cl. Lichid</Text>
          <TextInput
            ref={fieldRefs.clLichid}
            style={[
              styles.value,
              emptyFields.includes('clLichid') && styles.inputError,
            ]}
            placeholder="Cl. Lichid"
            value={fields.clLichid}
            onChangeText={value => handleInputChange('clLichid', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.collumn}>
          <Text style={styles.label}>Sare</Text>
          <TextInput
            ref={fieldRefs.sare}
            style={[
              styles.value,
              emptyFields.includes('sare') && styles.inputError,
            ]}
            placeholder="Sare"
            value={fields.sare}
            onChangeText={value => handleInputChange('sare', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
  
      <View style={styles.row}>
        <View style={styles.collumn}>
          <Text style={styles.label}>pH Granule</Text>
          <TextInput
            ref={fieldRefs.pHGranule}
            style={[
              styles.value,
              emptyFields.includes('pHGranule') && styles.inputError,
            ]}
            placeholder="pH Granule"
            value={fields.pHGranule}
            onChangeText={value => handleInputChange('pHGranule', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.collumn}>
          <Text style={styles.label}>Bicarbonat</Text>
          <TextInput
            ref={fieldRefs.bicarbonat}
            style={[
              styles.value,
              emptyFields.includes('bicarbonat') && styles.inputError,
            ]}
            placeholder="Bicarbonat"
            value={fields.bicarbonat}
            onChangeText={value => handleInputChange('bicarbonat', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
  
      <View style={styles.row}>
        <View style={styles.collumn}>
          <Text style={styles.label}>pH Lichid</Text>
          <TextInput
            ref={fieldRefs.pHLichid}
            style={[
              styles.value,
              emptyFields.includes('pHLichid') && styles.inputError,
            ]}
            placeholder="pH Lichid"
            value={fields.pHLichid}
            onChangeText={value => handleInputChange('pHLichid', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
  
      <View style={styles.line} />
  
      <View style={styles.row}>
        <View style={styles.collumn}>
          <Text style={styles.label}>Observații</Text>
          <TextInput
            ref={fieldRefs.observatii}
            style={[
              styles.value,
              emptyFields.includes('observatii') && styles.inputError,
            ]}
            placeholder="Observații"
            value={fields.observatii}
            onChangeText={value => handleInputChange('observatii', value)}
            multiline={true}
            numberOfLines={4}
          />
        </View>
     
      </View>
  
      <View style={styles.line} />
          <View style={styles.buttonContainer}>
            <Button title="Submit" onPress={handleSubmit} color="#EDEDED" />
          </View>
        </>
      )}
    </ScrollView>
  );
};



const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#333333',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryHeader: {
    backgroundColor: '#222222',
    padding: 8,
    marginBottom: 8,
  },
  categoryHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  categoryContent: {
    backgroundColor: '#444444',
    padding: 16,
    borderRadius: 8,
  },
  categoryContentText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  titleContainer: {
    marginTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  line: {
    height: 1,
    backgroundColor: '#FFFFFF',
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  collumn: {
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
  inputError: {
    borderColor: 'red',
  },
  pictureButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  pictureButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 24,
  },
  clientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  clientInfo: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },

};

export default InterventionFirst;
