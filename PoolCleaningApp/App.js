import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ClientList from './src/ClientList';
import ClientDetail from './src/ClientDetail';
import AddClient from './src/AddClient';
import AddIntervention from './src/AddIntervention';
import InterventionFirst from './src/InterventionFirst';
import ClientInterventions from './src/ClientInterventions';
const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();
const headerStyle = {
  headerStyle: {
    backgroundColor: '#333',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="ClientInterventions" component={ClientInterventions} options={{ title: 'Client Interventions' }} />

      <Drawer.Screen name="ClientList" component={ClientList} options={{ title: 'Client List' }} />
      <Drawer.Screen name="InterventionFirst" component={InterventionFirst} options={{title:`Intervention Firsst`}} />
    </Drawer.Navigator> 
  );
};
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DrawerNavigator" screenOptions={headerStyle}>
      <Stack.Screen name="InrerventionFirst" component={InterventionFirst} options={{title: `Intervention First`}} />

        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="ClientDetail" component={ClientDetail} options={{ title: 'Client Detail' }} />
        <Stack.Screen name="ClientIntervention" component={ClientInterventions} options={{ title: 'Client Intervention' }} />
        <Stack.Screen name="AddClient" component={AddClient} options={{ title: 'Add Client' }} />
        <Stack.Screen name="AddIntervention" component={AddIntervention} options={{ title: 'Add Intervention' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
