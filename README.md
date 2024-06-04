# Blocknotas

Proyecto de Blocknotas es una aplicación móvil que permite a los usuarios crear y guardar notas de texto, dibujos y notas de audio. La aplicación se conecta a una base de datos Firebase para almacenar y recuperar las notas de los usuarios.

## Características

- Crear notas de texto.
- Crear y guardar dibujos.
- Grabar y reproducir notas de audio.
- Guardar las notas en Firebase.
- Recuperar notas desde Firebase.

## Instalación

1. Clona el repositorio:
    ```bash
    git clone https://github.com/Fernant00/BlocknotasP.git
    cd Blocknotas
    ```

2. Instala las dependencias:
    ```bash
    npm install
    ```

## Ejecución

1. Inicia el servidor de desarrollo de Expo:
    ```bash
    npx expo start
    ```
Nota: para los audios es recomendado usar el emulador desde el celular en la aplicacion de "Expo Go", desde el emulador en la computadora no permite grabar audios.
2. Escanea el código QR con la aplicación Expo Go en tu dispositivo móvil o selecciona un simulador para ejecutar la aplicación.
   
## Uso

1. **Crear una nueva nota**: Presiona el botón "+" para crear una nueva nota de texto, dibujo o grabación de audio.
2. **Guardar el dibujo**: En la pantalla de dibujo, dibuja en el área designada y presiona "Guardar" para almacenar el dibujo en Firebase.
3. **Grabar audio**: En la pantalla de grabación de audio, presiona el botón de grabación para empezar a grabar y presiona nuevamente para detener y guardar.
4. **Notas Guardadas**: Todas las notas se listarán en la pantalla principal, donde puedes ver, escuchar y editar cada una de ellas.

## Firebase
-- notas texto: https://bloc-c0e03-default-rtdb.firebaseio.com/notes.json
-- notas audio: https://bloc-c0e03-default-rtdb.firebaseio.com/audio.json
-- notas dibujo: https://bloc-c0e03-default-rtdb.firebaseio.com/drawings.json

