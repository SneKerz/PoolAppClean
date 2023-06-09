import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, Text, ScrollView, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


const AddIntervention = ({ route, navigation }) => {
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
    observatii: '', // Added observatii field
  };

  const [fields, setFields] = useState(fieldsInitialState);
  const [startImage, setStartImage] = useState(null);
  const [endImage, setEndImage] = useState(null);
  const [showDataTable, setShowDataTable] = useState(false);

  const labels = Object.keys(fields);

  const fieldRefs = labels.reduce((acc, label) => {
    acc[label] = useRef(null);
    return acc;
  }, {});

  const [emptyFields, setEmptyFields] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      if (startImage === null) {
        setStartImage(result.uri);
      } else {
        setEndImage(result.uri);
      }
    }
  };

  const handleSubmit = async () => {
    const newIntervention = {
      clientId: client.id,
      date: new Date().toISOString().split('T')[0],
      startImage: startImage,
      endImage: endImage,
      ...fields,
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
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to add intervention');
      }
    } catch (error) {
      console.error('Error adding intervention:', error);
      Alert.alert('Error', 'Failed to add intervention');
    }
  };


  useEffect(() => {
    pickImage();
  }, []);

  useEffect(() => {
    const firstEmptyField = emptyFields[0];
    if (firstEmptyField && fieldRefs[firstEmptyField].current) {
      fieldRefs[firstEmptyField].current.focus();
    }
  }, [emptyFields]);

  const data = require('./chimic.json');


  const [recommendation, setRecommendation] = useState('');


  const poolSize = client.poolSize;
  const poolSizes = ["30-40 mc", "50-60 mc", "70-80 mc", "90-100 mc", "110-130 mc", "150-180 mc", "180-200 mc"];
  const numericalPoolSizes = poolSizes.map(size => {
    const [min, max] = size.split(' mc')[0].split('-');
    return { size, avg: (parseInt(min, 10) + parseInt(max, 10)) / 2 };
  });

  // Find the pool size that's closest to the client's pool size
  const nearestPoolSize = numericalPoolSizes.reduce((prev, curr) =>
    Math.abs(curr.avg - poolSize) < Math.abs(prev.avg - poolSize) ? curr : prev
  ).size;
  
  // Access the poolData array in the JSON structure
  const poolData = data.poolSize;
  
  // Find the pool size in the data and get its pHLevels
  const poolSizeData = poolData.find(item => item.poolSize && item.poolSize.some(sizeObj => sizeObj.size === nearestPoolSize));
  const pHLevels = poolSizeData ? poolSizeData.pHLevels : [];
  
  const getRecommendation = (fields) => {
    const { clor, pH } = fields;
    
    if (isNaN(clor) || isNaN(pH)) {
      return {
        error: "Invalid pH or Cl values",
      };
    }
    
    const clorStr = clor.toString() + " ppm";
    const matchingPoolSizeData = poolData.find(item => item.size === nearestPoolSize);
    
    if (matchingPoolSizeData) {
      const matchingPHLevel = matchingPoolSizeData.pH.find(item => item.level === pH);
      if (matchingPHLevel) {
        const clValueObj = matchingPHLevel.Cl_ppm.find(clObj => clObj.Cl === clorStr)
        if (clValueObj) {
          return {
            pH: matchingPHLevel.level,
            Cl: clValueObj.Cl,
            tablets: clValueObj.tablets,
            grams: clValueObj.grams,
            antialgae_liters: clValueObj.antialgae_liters,
            ph_minus_kg: matchingPHLevel.ph_minus_kg,
          };
        }
      }
    }
    return {
      error: "No recommendation found",
    };
  };
  

  
  
  
  // Modified the following function to call getRecommendation() for each input change
  const handleInputChange = (name, value) => {
    let updatedValue = value;
    if (name === 'clor' || name === 'pH') {
      updatedValue = parseFloat(value);
    }
    const updatedFields = { ...fields, [name]: updatedValue };
    setFields(updatedFields);
  };
  
  useEffect(() => {
    setRecommendation(getRecommendation(fields));
  }, [fields]);
  


return (
  <ScrollView style={styles.container}>
 
    <View style={styles.columnContainer}>
  <View style={styles.columnContainer}>
    <View style={styles.collumn3}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryHeaderText}>Data Intervenției</Text>
      </View>
      <View style={[styles.row2]}>
        <Text style={[styles.value2, {maxWidth: '100%', width: 50, justifyContent: 'center'}]}>{new Date().toISOString().split('T')[0]}</Text>
      </View>
    </View>
  </View>
  <View style={[styles.columnContainer]}>
    <View>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryHeaderText}>{client.name}</Text>
      </View>
      <View style={styles.collumn2}>
        <Text style={[styles.row2, {color: 'white'}]}>{client.phoneNumber}</Text>
        <Text style={[styles.row2, {color: 'white'}]}>{client.address}</Text>
        <Text style={[styles.row2, {color: 'white'}]}>Piscină: {client.poolSize}</Text>
      </View>
    </View>
  </View>
</View>

    <View style={styles.titleContainer}>
      <Text style={styles.title}>Valori Măsurate</Text>
    </View>

    <View style={styles.line} />

    <View style={styles.columnContainer}>
      <View style={styles.column2}>
        <View style={styles.row2}>
          <Text style={styles.label}>Clor</Text>
          <TextInput
            ref={fieldRefs.clor}
            style={[
              styles.value2,
              emptyFields.includes('clor') && styles.inputError,
            ]}
            value={fields.clor}
            onChangeText={value => handleInputChange('clor', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row2}>
          <Text style={styles.label}>pH</Text>
          <TextInput
            ref={fieldRefs.pH}
            style={[
              styles.value2,
              emptyFields.includes('pH') && styles.inputError,
            ]}
            value={fields.pH}
            onChangeText={value => handleInputChange('pH', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row2}>
          <Text style={[styles.label, {alignSelf: 'center'}]}>Temp</Text>
          <TextInput
            ref={fieldRefs.temperature}
            style={[
              styles.value2,
              emptyFields.includes('temperature') && styles.inputError,
            ]}
          
            value={fields.temperature}
            onChangeText={value => handleInputChange('temperature', value)}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={[styles.column, {width: '55%',}]}>
        <View style={styles.row2}>
          <Text style={styles.label}>Duritate</Text>
          <TextInput
            ref={fieldRefs.duritate}
            style={[
              styles.value2,
              emptyFields.includes('duritate') && styles.inputError,
            ]}
            value={fields.duritate}
            onChangeText={value => handleInputChange('duritate', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row2}>
          <Text style={styles.label}>Alcalinitate</Text>
          <TextInput
            ref={fieldRefs.alcalinitate}
            style={[
              styles.value2,
              emptyFields.includes('alcalinitate') && styles.inputError,
            ]}
            value={fields.alcalinitate}
            onChangeText={value => handleInputChange('alcalinitate', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row2}>
          <Text style={styles.label}>Salinitate</Text>
          <TextInput
            ref={fieldRefs.salinitate}
            style={[
              styles.value2,
              emptyFields.includes('salinitate') && styles.inputError,
            ]}
            value={fields.salinitate}
            onChangeText={value => handleInputChange('salinitate', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>


    <View style={styles.titleContainer}>
  <Text style={styles.title}>Recomandare</Text>
</View>

<View style={styles.line} />

<View style={styles.columnContainer}>
  <View style={styles.column}>
    <View style={styles.row}>
      <Text style={styles.label}>pH-</Text>
      <Text style={styles.value2}>{recommendation.ph_minus_kg}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Cl. Tab.</Text>
      <Text style={styles.value2}>{recommendation.tablets}</Text>
    </View>
    </View>
    <View style={styles.column}>

    <View style={styles.row2}>
      <Text style={styles.label}>Clor Gr.</Text>
      <Text style={styles.value2}>{recommendation.grams}</Text>
  </View>

    <View style={styles.row2}>
      <Text style={styles.label}>Antialgic</Text>
      <Text style={styles.value2}>{recommendation.antialgae_liters}</Text>
    </View>
  </View>

  </View>
  <View style={styles.buttonContainer}>
  <Button title="Show Data Table" onPress={() => setShowDataTable(!showDataTable)} />
</View>

{showDataTable && (
  <View style={styles.tableContainer}>
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderCell}>pH / Cl ppm</Text>
      {poolData[0].pH[0].Cl_ppm.map((clData, index) => (
        <Text key={index} style={styles.tableHeaderCell}>{clData.Cl}</Text>
      ))}
    </View>
    {poolData
      .filter(item => item.size === nearestPoolSize)
      .map((item, index) => (
        item.pH.map((pHData, pHIndex) => (
          <View key={pHIndex} style={styles.tableRow}>
            <Text style={styles.tableCell}>pH: {pHData.level}</Text>
            
            {pHData.Cl_ppm.map((clData, clIndex) => (
              
              <View key={clIndex} style={styles.tableCell}>
              {pHData.ph_minus_kg && <Text style={styles.tableCell}>pH- {pHData.ph_minus_kg}</Text>}

                {clData.tablets && <Text style={styles.tableText}>Cl Tab. {clData.tablets}</Text>}
                {clData.grams && <Text style={styles.tableText}>Cl gr. {clData.grams}</Text>}
                {clData.antialgae_liters && <Text style={styles.tableText}>Antialg {clData.antialgae_liters}</Text>}
              </View>
            ))}
          </View>
        ))
      ))}
  </View>
)}



    <View style={styles.titleContainer}>
      <Text style={styles.title}>Tratament chimic</Text>
    </View>

    <View style={styles.line} />

    <View style={styles.columnContainer}>
      <View style={styles.column}>
        <View style={styles.row}>
          <Text style={styles.label}>Cl. Granule</Text>
          <TextInput
            ref={fieldRefs.clGranule}
            style={[
              styles.value,
              emptyFields.includes('clGranule') && styles.inputError,
            ]}
            value={fields.clGranule}
            onChangeText={value => handleInputChange('clGranule', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Cl. Tablete</Text>
          <TextInput
            ref={fieldRefs.clTablete}
            style={[
              styles.value,
              emptyFields.includes('clTablete') && styles.inputError,
            ]}
            value={fields.clTablete}
            onChangeText={value => handleInputChange('clTablete', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Cl. Lichid</Text>
          <TextInput
            ref={fieldRefs.clLichid}
            style={[
              styles.value,
              emptyFields.includes('clLichid') && styles.inputError,
            ]}
            value={fields.clLichid}
            onChangeText={value => handleInputChange('clLichid', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>pH Granule</Text>
          <TextInput
            ref={fieldRefs.pHGranule}
            style={[
              styles.value,
              emptyFields.includes('pHGranule') && styles.inputError,
            ]}
            value={fields.pHGranule}
            onChangeText={value => handleInputChange('pHGranule', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>pH Lichid</Text>
          <TextInput
            ref={fieldRefs.pHLichid}
            style={[
              styles.value,
              emptyFields.includes('pHLichid') && styles.inputError,
            ]}
            value={fields.pHLichid}
            onChangeText={value => handleInputChange('pHLichid', value)}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.column}>
      <View style={styles.row}>
          <Text style={styles.label}>Antialgic</Text>
          <TextInput
            ref={fieldRefs.antialgic}
            style={[
              styles.value,
              emptyFields.includes('anticalcar') && styles.inputError,
            ]}
            value={fields.anticalcar}
            onChangeText={value => handleInputChange('anticalcar', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Anticalcar</Text>
          <TextInput
            ref={fieldRefs.anticalcar}
            style={[
              styles.value,
              emptyFields.includes('anticalcar') && styles.inputError,
            ]}
            value={fields.anticalcar}
            onChangeText={value => handleInputChange('anticalcar', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Floculant</Text>
          <TextInput
            ref={fieldRefs.floculant}
            style={[
              styles.value,
              emptyFields.includes('floculant') && styles.inputError,
            ]}
            value={fields.floculant}
            onChangeText={value => handleInputChange('floculant', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Sare</Text>
          <TextInput
            ref={fieldRefs.sare}
            style={[
              styles.value,
              emptyFields.includes('sare') && styles.inputError,
            ]}
            value={fields.sare}
            onChangeText={value => handleInputChange('sare', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Bicarbonat</Text>
          <TextInput
            ref={fieldRefs.bicarbonat}
            style={[
              styles.value,
              emptyFields.includes('bicarbonat') && styles.inputError,
            ]}
            value={fields.bicarbonat}
            onChangeText={value => handleInputChange('bicarbonat', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>

    <View style={styles.line} />
    <View style={styles.columnContainer}>
  <View style={[styles.column, { flex: 1 }]}>
    <View style={styles.row}>
      <Text style={styles.label}>Observatii</Text>
    </View>
    <View style={styles.row}>
      <TextInput
        ref={fieldRefs.observatii}
        style={[
          styles.final,
          emptyFields.includes('observatii') && styles.inputError,
        ]}
        value={fields.observatii}
        onChangeText={value => handleInputChange('observatii', value)}
        multiline={true}
        numberOfLines={4}
      />
    </View>
  </View>
  <View style={styles.column}>
    <View style={styles.row}>
      <TouchableOpacity onPress={pickImage} style={styles.pictureButton}>
        <Text style={styles.pictureButtonText}>Poză final</Text>
      </TouchableOpacity>
      {endImage && <Image source={{ uri: endImage }} style={{ width: 200, height: 200 }} />}
    </View>
  </View>
</View>
<View style={styles.line} />

<View style={styles.buttonContainer}>
  <Button title="Trimite" onPress={handleSubmit}  />
</View>
<Text></Text>
<Text></Text>
<Text></Text>
<Text></Text>

  </ScrollView>
);
};
const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#333333',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryHeader: {
    padding: 8,
    marginBottom: 8,
  },
  categoryHeaderText: {
    flexDirection: `row`,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    justifyContent: `space-around`,
  },
  categoryContent: {
    backgroundColor: '#444444',
    padding: 16,
    borderRadius: 8,
    justifyContent: `space-between`,
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
    backgroundColor: '#919191',
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  collumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '48%',
    backgroundColor: '#444444',
    padding: 16,
    borderRadius: 8,
  },

  columnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  column: {
    width: '47%',
  },
  column2: {
    width: `40%`,
    marginRight: -10,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    
  },
  value: {
    flex: 1,
   
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#919191',
 

    height: 40,
    width: 60,
    minWidth: 60,
    maxWidth: 60,
 
  },
  value2: {
    flex: 1,
   
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#919191',
    justifyContent: `space-around`,
    alignItems: `stretch`,


    height: 40,
    width: 40,
    minWidth: 40,
    maxWidth: 80,
    
    marginRight: 0,
    marginLeft: -20,
 
  },
  pictureButton: {
    backgroundColor: '#919191',
    maxWidth: 140,
    minWidth: 140,
    width: 140,
    maxHeight: 50,

    minHeight: 50,
    marginLeft: 40,
    paddingVertical: 12,
    marginBottom: 0,
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  pictureButtonText: {
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
    height: 45,
    maxHeight: 45,
    minHeight: 45,
    backgroundColor: '#000000',
    color: '#00000',
  },
  buttonFinal: {

    backgroundColor: '#000000',

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
  tableContainer: {
    marginTop: 24,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 8,
  },
  row2: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
 
  },
  pHValue: {
    fontSize: 16,
    color: '#FFFFFF',
    width: 60,
  },
  chlorineContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chlorineItem: {
    marginRight: 16,
    marginBottom: 8,
  },
  clValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  chlorineValues: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  final: {
    flex: 1,
   
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#919191',
 

    height: 35,
    width: 200,
    minWidth: 180,
    maxWidth: 180,
 
  
  },
  box: {
    flex: 1,
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
  },
  boxHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  boxText: {
    fontSize: 14,
  },
  tableContainer: {
    padding: 10,
    
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    margin: 2,
    borderRightWidth:1,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomColor: '#dcdcdc',
    borderBottomWidth: 1,


  },
  tableCell: {
    flex: 1,
    color: 'white',


  },
  tableText: {
    fontSize: 15,
    color: 'white'
  },
  buttonContainer: {
    marginTop: 20,
  },
  collumn2: {
    flex: 1,
    color: `white`,
    
  },
  
});


export default AddIntervention;