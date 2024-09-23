import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '@/utils/supabaseClient';
import { NativeBaseProvider, Toast } from 'native-base';
import { Provider } from 'react-native-paper';
import * as ImageManipulator from 'expo-image-manipulator';
import { EvilIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Loading from '@/components/login/Loading';
import { alterChatUri } from '@/redux/module/rentChat';
import { useDispatch } from 'react-redux';
import { Audio } from 'expo-av';

const TakePicture = () => {
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [audioPermission, requestAudioPermission] = useState<Audio.PermissionStatus | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [currentUri, setCurrentUri] = useState<string>('');
  const [uploadState, setUploadState] = useState<boolean>(false);
  const [recording, setRecording] = useState<boolean>(false);

  useEffect(() => {
    const getPermissions = async () => {
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      setAudioPermission(audioStatus);

      const cameraPermissionStatus = await Camera.requestPermissionsAsync();
      setCameraPermission(cameraPermissionStatus);
    };

    getPermissions();
  }, []);

  if (!cameraPermission?.granted || !audioPermission) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera and record audio
        </Text>
        <Button onPress={requestCameraPermission} title="Grant camera permission" />
        <Button onPress={requestAudioPermission} title="Grant audio permission" />
      </View>
    );
  }

  const captureImage = async () => {
    if (cameraPermission.granted) {
      const photo = await camera.takePictureAsync({ base64: true });
      const compressedImage = await compressImage(photo.uri);
      setCurrentUri(compressedImage.uri);
    }
  };

  const compressImage = async (uri: string) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipulatedImage;
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const returnToChat = () => {
    router.back();
  };

  const uploadImage = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();
    const fileName = `public/${Date.now()}.jpg`;
    const { error } = await supabase.storage
      .from('rentProImage')
      .upload(fileName, arrayBuffer, { contentType: 'image/jpeg', upsert: false });
    setUploadState(false);
    dispatch(
      alterChatUri(
        'https://tdxzdcoghbncmanchrxa.supabase.co/storage/v1/object/public/rentProImage/' + fileName
      )
    );
    router.back();
    if (error) {
      setUploadState(false);
      console.error('Error uploading image: ', error);
      Toast.show({ title: '上传失败', duration: 1000 });
      setCurrentUri('');
    }
  };

  const recordVideo = async () => {
    if (camera && !recording) {
      setRecording(true);
      try {
        const videoRecordPromise = camera.recordAsync();
        if (videoRecordPromise) {
          const data = await videoRecordPromise;
          const source = data.uri;
          if (source) {
            console.log('Video source:', source);
          }
        }
      } catch (error) {
        console.warn(error);
      } finally {
        setRecording(false);
      }
    }
  };

  const stopVideoRecording = () => {
    if (camera && recording) {
      camera.stopRecording();
      setRecording(false);
    }
  };

  return (
    <NativeBaseProvider isSSR={false}>
      <Provider>
        <View style={styles.container}>
          {currentUri === '' ? (
            <CameraView
              style={styles.camera}
              facing={facing}
              ref={(ref: Camera) => {
                setCamera(ref);
              }}>
              <TouchableOpacity style={styles.returnButton} onPress={returnToChat}>
                <EvilIcons name="chevron-left" size={24} color="black" style={styles.faceText} />
              </TouchableOpacity>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                  <EvilIcons name="refresh" size={24} color="black" style={styles.faceText} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={captureImage}>
                  <MaterialCommunityIcons name="camera" size={36} color="black" />
                </TouchableOpacity>
                {recording ? (
                  <TouchableOpacity style={styles.button} onPress={stopVideoRecording}>
                    <MaterialCommunityIcons name="stop" size={36} color="red" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.button} onPress={recordVideo}>
                    <MaterialCommunityIcons name="video" size={36} color="black" />
                  </TouchableOpacity>
                )}
              </View>
            </CameraView>
          ) : (
            <View style={{ flex: 1 }}>
              <Loading state={uploadState} />
              <Image source={{ uri: currentUri }} style={{ flex: 1 }} />
              <View style={styles.confirmContainer}>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => {
                    setCurrentUri('');
                  }}>
                  <EvilIcons name="chevron-left" size={24} color="black" style={styles.faceText} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButtonF}
                  onPress={() => {
                    setUploadState(true);
                    uploadImage(currentUri);
                  }}>
                  <Text style={{ color: 'white' }}>确认</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Provider>
    </NativeBaseProvider>
  );
};

export default TakePicture;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-around',
    margin: 32,
  },
  returnButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    margin: 32,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  faceText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'black',
  },
  confirmContainer: {
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    top: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    height: 70,
  },
  confirmButton: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  confirmButtonF: {
    width: 70,
    height: 30,
    borderRadius: 35,
    backgroundColor: '#3eabe6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
