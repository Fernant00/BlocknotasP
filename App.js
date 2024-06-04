import { registerRootComponent } from 'expo';

import React, { useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  TouchableOpacity, 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  Modal, 
  TextInput, 
  Button 
} from 'react-native';

// Importa tus pantallas
import Home from './app/screens/Home';
import Notasg from './app/screens/NotasG';
import NewPage from './app/screens/NewPage';
import NewPageAudio from './app/screens/NewPageaudio';
import NewPageDibujo from './app/screens/NewPagedibujo';

const Stack = createStackNavigator();

function App() {
  
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

const AppNavigator = () => {
  
  const [screens, setScreens] = useState([
    { name: 'Home', component: Home },
    { name: 'Notas Guardadas', component: Notasg },
    // Agrega aquí las pantallas iniciales
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newScreenName, setNewScreenName] = useState('');
  const [newScreenCategory, setNewScreenCategory] = useState('Texto');

  const navigation = useNavigation();

  const addScreen = () => {
    let screenComponent;

    switch (newScreenCategory) {
      case 'Audio':
        screenComponent = NewPageAudio;
        break;
      case 'Dibujo':
        screenComponent = NewPageDibujo;
        break;
      case 'Texto':
      default:
        screenComponent = NewPage;
        break;
    }

    const newScreens = [...screens, { name: newScreenName || `Página ${screens.length + 1}`, component: screenComponent }];
    setScreens(newScreens);
    setModalVisible(false);
    setNewScreenName('');
    setNewScreenCategory('Texto');
  };

  const goToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    
    <SafeAreaView style={styles.container}>
      <Stack.Screen
          name="bd"
          component={Home}
          
        />
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {screens.map((screen, index) => (
          <Stack.Screen
            key={index}
            name={screen.name}
            component={screen.component}
          />
          
        ))}
      </Stack.Navigator>
      <View style={styles.footer}>
        <ScrollView horizontal style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>Pantallas creadas:</Text>
          {/* Botón para abrir el modal */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>Nueva +</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            {screens.map((screen, index) => (
              <TouchableOpacity
                key={index}
                style={styles.button}
                onPress={() => goToScreen(screen.name)}
              >
                <Text style={styles.buttonText}>{screen.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      
      {/* Modal para añadir nueva pantalla */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Añadir Nueva Pantalla</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la pantalla"
              value={newScreenName}
              onChangeText={setNewScreenName}
            />
            <Text style={styles.label}>Categoría:</Text>
            <View style={styles.categoryContainer}>
              {['Texto', 'Dibujo', 'Audio'].map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    newScreenCategory === category && styles.categoryButtonSelected
                  ]}
                  onPress={() => setNewScreenCategory(category)}
                >
                  <Text style={styles.categoryButtonText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setModalVisible(false)}
                color="#007BFF"
              />
              <Button
                title="Agregar"
                onPress={addScreen}
                color="#007BFF"
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    borderColor: 'gray', // Cambiado a gris
    backgroundColor: '#007BFF',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#28A745',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 20,
  },
  footer: {
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 5,
  },
  categoryButtonSelected: {
    backgroundColor: '#007BFF',
  },
  categoryButtonText: {
    color: '#007BFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
registerRootComponent(App);
export default App;
