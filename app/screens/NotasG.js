import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image,Dimensions } from 'react-native';
import { Audio } from 'expo-av';
const NotasG = () => {
  const [notas, setNotas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseAudio = await fetch('https://bloc-c0e03-default-rtdb.firebaseio.com/audio.json');
        const dataAudio = await responseAudio.json();

        const responseNotes = await fetch('https://bloc-c0e03-default-rtdb.firebaseio.com/notes.json');
        const dataNotes = await responseNotes.json();

        // Combinar los datos de las dos fuentes en una lista única
        const combinedData = [
          ...parseData(dataAudio, 'audioUri', 'audio'),
          ...parseData(dataNotes, 'description', 'text')
        ];

        setNotas(combinedData);
      } catch (error) {
        console.error('Error al obtener las notas:', error);
      }
    };

    fetchData();
  }, []);

  // Función para analizar los datos y devolver una lista de notas
  const parseData = (data, field, type) => {
    if (!data) return [];
    console.log('Datos recibidos:', data);
    return Object.keys(data).map(key => {
      console.log('Llave:', key);
      console.log('Valor:', data[key]);
      return { id: key, content: data[key][field], type };
    });
  };

  // Función para reproducir el audio
  const playAudio = async (uri) => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri });
      await soundObject.playAsync();
    } catch (error) {
      console.error('Error al reproducir el audio', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todas las Notas</Text>
      
      <FlatList
        data={notas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.note}>
            <View style={styles.noteHeader}>
              <Text style={styles.noteType}>{item.type}</Text>
              {item.type === 'audio' && (
                <TouchableOpacity onPress={() => playAudio(item.content)}>
                  <Image source={require('../../assets/play-button.png')} style={styles.audioIcon} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.noteContent}>
              {item.type === 'text' && (
                <Text>{item.content}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  note: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  noteType: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteContent: {
    alignItems: 'center',
  },
  audioIcon: {
    width: 50,
    height: 50,
  },

});

export default NotasG;
