import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Modal, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewPageAudio = () => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState('');

  const addNote = async () => {
    if (title.trim() && audioUri) {
      const newNote = { id: notes.length.toString(), title, audioUri };
      setNotes([...notes, newNote]);
      setTitle('');
      setAudioUri('');
      setModalVisible(false); // Cierra el modal después de agregar la nota

      // Guardar la información del audio en AsyncStorage
      try {
        await AsyncStorage.setItem('audioNotes', JSON.stringify([...notes, newNote]));
        console.log('Datos de audio guardados en AsyncStorage.');
      } catch (error) {
        console.error('Error al guardar los datos de audio en AsyncStorage:', error);
      }

      // Realizar el POST a la URL con los datos del audio
      try {
        const response = await fetch('https://bloc-c0e03-default-rtdb.firebaseio.com/audio.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newNote),
        });

        if (response.ok) {
          console.log('Datos de audio enviados con éxito.');
        } else {
          console.error('Error al enviar los datos de audio.');
        }
      } catch (error) {
        console.error('Error al enviar los datos de audio:', error);
      }
    }
  };

  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setAudioUri(uri);
    console.log('Recording stopped and stored at', uri);
  };

  const deleteAudio = () => {
    setAudioUri('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notas audio</Text>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.note}>
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Button title="Reproducir Audio" onPress={async () => {
              const soundObject = new Audio.Sound();
              try {
                await soundObject.loadAsync({ uri: item.audioUri });
                await soundObject.playAsync();
              } catch (error) {
                console.error('Error al reproducir el audio', error);
              }
            }} />
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Agregar Nueva Nota</Text>
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={title}
              onChangeText={setTitle}
            />
        
            <View style={styles.audioButtons}>
              <Button
                title={recording ? 'Detener Grabación' : 'Grabar Audio'}
                onPress={recording ? stopRecording : startRecording}
              />
              {audioUri ? (
                <View style={styles.audioControl}>
                  <Text>Audio grabado</Text>
                  <Button title="Borrar Audio" onPress={deleteAudio} color="#dc3545" />
                </View>
              ) : null}
            </View><View style={styles.modalButtons}>
               <Button title="Cerrar" onPress={() => setModalVisible(false)} />
            <Button title="Agregar Nota" onPress={addNote} />
             </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  note: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteDescription: {
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#28A745',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  audioButtons: {
    marginVertical: 10,
    width: '100%',
  },
  audioControl: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default NewPageAudio;
