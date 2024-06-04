import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height, width } = Dimensions.get('window');

const DrawingModal = ({ visible, onClose, onSave }) => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);

  const onTouchEnd = () => {
    const newPaths = [...paths, currentPath];
    setPaths(newPaths);
    setCurrentPath([]);
  };

  const onTouchMove = (event) => {
    const newPath = [...currentPath];
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;
    const newPoint = `${newPath.length === 0 ? 'M' : ''}${locationX.toFixed(0)},${locationY.toFixed(0)} `;
    newPath.push(newPoint);
    setCurrentPath(newPath);
  };

  const handleClear = () => {
    setPaths([]);
    setCurrentPath([]);
  };

  const handleSave = async () => {
    onSave(paths); // Agregar el dibujo a la lista de dibujos
    handleClear();
    onClose();

    // Realizar el POST a la URL con los datos del dibujo
    try {
      const response = await fetch('https://bloc-c0e03-default-rtdb.firebaseio.com/drawings.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paths),
      });

      if (response.ok) {
        console.log('Dibujo guardado con éxito en Firebase.');
      } else {
        console.error('Error al guardar el dibujo en Firebase.');
      }
    } catch (error) {
      console.error('Error al enviar el dibujo:', error);
    }
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.svgContainer} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            <Svg height={height * 0.5} width={width}>
              <Path
                d={paths.join('')}
                stroke={'red'}
                fill={'transparent'}
                strokeWidth={3}
                strokeLinejoin={'round'}
                strokeLinecap={'round'}
              />
            </Svg>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={handleClear}>
              <Text style={styles.buttonText}>Borrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const NewPagedibujo = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchDrawings = async () => {
      try {
        const response = await fetch('https://bloc-c0e03-default-rtdb.firebaseio.com/drawings.json');
        const data = await response.json();
        if (data) {
          const parsedData = Object.keys(data).map(key => ({ id: key, drawingPaths: data[key] }));
          setNotes(parsedData);
        }
      } catch (error) {
        console.error('Error al obtener los dibujos:', error);
      }
    };

    fetchDrawings();
  }, []);

  const handleSaveDrawing = async (paths) => {
    const newNote = { id: notes.length.toString(), drawingPaths: paths };
    setNotes([...notes, newNote]);
    setModalVisible(false); // Cerrar el modal después de guardar la nota

    // Guardar los dibujos en AsyncStorage
    try {
      await AsyncStorage.setItem('drawings', JSON.stringify([...notes, newNote]));
      console.log('Dibujo guardado en AsyncStorage.');
    } catch (error) {
      console.error('Error al guardar el dibujo en AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <DrawingModal visible={modalVisible} onClose={() => setModalVisible(false)} onSave={handleSaveDrawing} />
      <Text style={styles.header}>Notas</Text>
     
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.note}>
            <View style={styles.drawingContainer}>
              <Svg height={200} width={200}>
                <Path
                  d={item.drawingPaths.join('')}
                  stroke={'black'}
                  fill={'transparent'}
                  strokeWidth={1}
                  strokeLinejoin={'round'}
                  strokeLinecap={'round'}
                />
              </Svg>
            </View>
            <View style={styles.noteContent}></View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  svgContainer: {
    height: 200,
    width: 200,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  buttonsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  drawingContainer: {
    marginRight: 10,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  noteContent: {
    flex: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
  },
});

export default NewPagedibujo;
