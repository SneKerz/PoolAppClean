
import React from 'react';
import { View, Text, Button, Modal, StyleSheet, ScrollView, Image } from 'react-native';

const InterventionPopup = ({ intervention, client, onClose }) => {
return (
<Modal visible={true} onRequestClose={onClose}>
<View style={styles.container}>
<ScrollView>
<View style={styles.categoryContainer}>
<View style={styles.categoryHeader}>
<Text style={styles.categoryHeaderText}>Data Intervenției</Text>
</View>
<View style={styles.categoryContent}>
<Text style={styles.categoryContentText}>{intervention.date}</Text>
</View>
</View>
<View style={styles.categoryContainer}>
<View style={styles.categoryHeader}>
<Text style={styles.categoryHeaderText}>{client.name}</Text>
</View>
<View style={styles.categoryContent}>
<Text style={styles.clientInfo}>{client.phoneNumber}</Text>
<Text style={styles.clientInfo}>{client.address}</Text>
<Text style={styles.clientInfo}>Pool Size: {client.poolSize}</Text>
</View>
</View>
<View style={styles.titleContainer}>
<Text style={styles.title}>Valori Măsurate</Text>
</View>
<View style={styles.line} />
<View style={styles.row}>
<View style={styles.collumn}>
<Text style={styles.label}>Clor</Text>
<Text style={styles.value}>{intervention.clor}</Text>
</View>
<View style={styles.collumn}>
<Text style={styles.label}>Duritate</Text>
<Text style={styles.value}>{intervention.duritate}</Text>
</View>
</View>
<View style={styles.row}>
<View style={styles.collumn}>
<Text style={styles.label}>pH</Text>
<Text style={styles.value}>{intervention.pH}</Text>
</View>
<View style={styles.collumn}>
<Text style={styles.label}>Alcalinitate</Text>
<Text style={styles.value}>{intervention.alcalinitate}</Text>
</View>
</View>
<View style={styles.row}>
<View style={styles.collumn}>
<Text style={styles.label}>Temperatură</Text>
<Text style={styles.value}>{intervention.temperature}</Text>
</View>
<View style={styles.collumn}>
<Text style={styles.label}>Salinitate</Text>
<Text style={styles.value}>{intervention.salinitate}</Text>
</View>
</View>
<View style={styles.line} />

<View style={styles.titleContainer}>
<Text style={styles.title}>Tratament chimic</Text>
</View>
<View style={styles.line} />
<View style={styles.row}>
<View style={styles.collumn}>
<Text style={styles.label}>Cl. Granule</Text>
<Text style={styles.value}>{intervention.clGranule}</Text>
</View>
<View style={styles.collumn}>
<Text style={styles.label}>Anialgic</Text>
<Text style={styles.value}>{intervention.anialgic}</Text>
</View>
</View>
<View style={styles.row}>
<View style={styles.collumn}>
<Text style={styles.label}>Cl. Tablete</Text>
<Text style={styles.value}>{intervention.clTablete}</Text>
</View>
<View style={styles.collumn}>
<Text style={styles.label}>Anticalcar</Text>
<Text style={styles.value}>{intervention.anticalcar}</Text>
</View>
</View>
<View style={styles.row}>
<View style={styles.collumn}>
<Text style={styles.label}>Cl. Lichid</Text>
<Text style={styles.value}>{intervention.clLichid}</Text>
</View>
<View style={styles.collumn}>
<Text style={styles.label}>Floculant</Text>
<Text style={styles.value}>{intervention.floculant}</Text>
</View>
</View>
<View style={styles.row}>
<View style={styles.collumn}>
<Text style={styles.label}>pH Granule</Text>
<Text style={styles.value}>{intervention.pHGranule}</Text>
</View>
<View style={styles.collumn}>
<Text style={styles.label}>Sare</Text>
<Text style={styles.value}>{intervention.sare}</Text>
</View>
</View>
<View style={styles.row}>
<View style={styles.collumn}>
<Text style={styles.label}>pH Lichid</Text>
<Text style={styles.value}>{intervention.pHLichid}</Text>
</View>
<View style={styles.collumn}>
<Text style={styles.label}>Bicarbonat</Text>
<Text style={styles.value}>{intervention.bicarbonat}</Text>
</View>
</View>
<View style={styles.line} />
<View style={styles.row}>
<View style={styles.collumn2}>
<Text style={styles.label}>Observatii</Text>
<Text style={styles.label}>{intervention.observatii}</Text>
</View>
</View>
<View style={styles.row}>
<View style={styles.collumn2}>
{intervention.startImage && <Image source={{ uri: intervention.startImage }} style={styles.image} />}
{intervention.endImage && <Image source={{ uri: intervention.endImage }} style={styles.image} />}
</View>
</View>
<View style={styles.buttonContainer}>
<Button title="Close" onPress={onClose} color="#EDEDED" />
</View>

</ScrollView>
</View>
</Modal>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#333333',
padding: 16,
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
collumn2: {
  width: '100%',
  height: '100%',
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
label2: {
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
image: {
    width: 300,
    height: 200,
    marginBottom: 16,
    
    borderRadius: 8,
  },
});

export default InterventionPopup;