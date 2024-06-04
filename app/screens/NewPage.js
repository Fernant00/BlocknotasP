import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Modal, TouchableOpacity } from 'react-native';
import { firebase } from '../../firebase'; // Ajusta la ruta según sea necesario

const NewPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const addNote = () => {
    if (title.trim() && description.trim()) {
      const newNote = { title, description };
      setNotes([...notes, newNote]);
      setTitle('');
      setDescription('');
      setModalVisible(false); // Cierra el modal después de agregar la nota
   
  }
};

const enviar = () => { 
  if (selectedNote.title.trim() && selectedNote.description.trim()) {
    const updatedNote = { ...selectedNote }; // Copia la nota seleccionada
   
    setEditModalVisible(false); 
    // Cierra el modal después de editar la nota
    sendNoteToFirebase(updatedNote); // Envía la nota editada a Firebase
  }
};

  const sendNoteToFirebase = async (note) => {
    try {
      // Enviar la nota a la base de datos de Firebase
      const response = await fetch('https://bloc-c0e03-default-rtdb.firebaseio.com/notes.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
      
      if (response.ok) {
        console.log('Nota enviada con éxito.');
      } else {
        console.error('Error al enviar la nota.');
      }
    } catch (error) {
      console.error('Error al enviar la nota:', error);
    }
  };

  const editNote = () => {
    // Aquí puedes implementar la lógica para editar la nota seleccionada
    // Por ahora, simplemente cerramos el modal de edición
    setEditModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notas</Text>
      <FlatList
        data={notes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.note}
            onPress={() => {
              setSelectedNote(item);
              setEditModalVisible(true);
            }}
          >
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text style={styles.noteDescription}>{item.description}</Text>
          </TouchableOpacity>
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
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={description}
              onChangeText={setDescription}
            />
             <View style={styles.modalButtons}>
              <Button title="Cerrar" onPress={() => setModalVisible(false)} />
            <Button title="Agregar" onPress={addNote} />
            
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal para editar la nota */}
      <Modal
  visible={editModalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setEditModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalHeader}>Deseas guardar la Nota</Text>
      <TextInput
        style={[styles.input, { display: 'none' }]}
        placeholder="Título"
        value={selectedNote ? selectedNote.title : ''}
        onChangeText={(text) => setSelectedNote(prevNote => ({ ...prevNote, title: text }))}
      />
      <TextInput
        style={[styles.input, { display: 'none' }]}
        placeholder="Descripción"
        value={selectedNote ? selectedNote.description : ''}
        onChangeText={(text) => setSelectedNote(prevNote => ({ ...prevNote, description: text }))}
      />
       <View style={styles.modalButtons}> 
      <Button title="Cancelar" onPress={() => setEditModalVisible(false)} style={styles.cancelButton} />
    
        <Button title="Guardar" onPress={enviar} />
       
      </View>
    </View>
  </View>
</Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
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
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    
    width: '45%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(0, 0, 0, 0.5)',
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
    },shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtons: {
    
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});



export default NewPage;
