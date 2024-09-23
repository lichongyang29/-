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
import { alterChatUri, deleteChatUri } from '@/redux/module/rentChat';
import { useDispatch, useSelector } from 'react-redux';
import { Audio, Video, ResizeMode } from 'expo-av';
import { requestPermissionsAsync } from 'expo-av/build/Audio';
// import { Video as VideoCompress } from 'react-native-compressor';

const TakePicture = () => {
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [audioPermission, requestAudioPermission] = useState<Audio.PermissionStatus | null | any>(
    null
  );
  const [camera, setCamera] = useState<any>(null);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [currentUri, setCurrentUri] = useState<string>('');
  const [uploadState, setUploadState] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<'video' | 'picture'>('picture');
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [recording, setRecording] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [status, setStatus] = useState({});

  useEffect(() => {
    const getPermissions = async () => {
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      // setAudioPermission(audioStatus);
      // const cameraPermissionStatus = await Camera.requestPermissionsAsync();
      // setCameraPermission(cameraPermissionStatus);
    };
    getPermissions();
  }, []);

  // if (!cameraPermission?.granted || !audioPermission) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={{ textAlign: 'center' }}>需要获取相机与音频权限</Text>
  //       <Button onPress={requestCameraPermission} title="获取相机权限" />
  //       <Button onPress={requestAudioPermission} title="获取音频权限" />
  //     </View>
  //   );
  // }

  const captureImage = async () => {
    if (cameraPermission?.granted) {
      setAddLoading(true);
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
    setAddLoading(false);
    return manipulatedImage;
  };
  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const returnToChat = () => {
    router.back();
  };

  const uploadImage = async (uri: any) => {
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
      startTimer();
      try {
        console.log('Starting video recording...');
        const videoRecordPromise = camera.recordAsync();
        if (videoRecordPromise) {
          const data = await videoRecordPromise;
          console.log('Video recording complete:', data);
          const source = data.uri;
          if (source) {
            setVideoUri(source);
            console.log('Video source:', source);
          } else {
            console.warn('No video source URI found');
          }
        } else {
          console.warn('Video recording promise is undefined');
        }
      } catch (error) {
        console.error('Error during video recording:', error);
      } finally {
        stopTimer();
        setRecording(false);
      }
    }
  };

  const stopVideoRecording = () => {
    if (camera && recording) {
      console.log('stopRecording');
      camera.stopRecording();
      setRecording(false);
      stopTimer();
      setCameraMode('picture');
    }
  };
  // 视频时间
  const startTimer = () => {
    setTimer(0);
    const id = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);
    setIntervalId(id);
    // 怎么比较Timer和15
    if (timer === 15) {
      stopVideoRecording();
    }
  };

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const compressVideo = async (videoUri: string) => {
    try {
      const compressedResult = await VideoCompress.compress(videoUri, {}, (progress) => {
        console.log('Compression Progress: ', progress);
      });

      const compressedVideoUri = compressedResult.uri; // 获取压缩后的视频 URI

      // 上传到云服务器
      const uploadResult = await backgroundUpload(
        'https://your-cloud-server-url/upload',
        compressedVideoUri,
        {
          httpMethod: 'POST',
          // 添加任何需要的请求头
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
        (written, total) => {
          console.log('Upload Progress: ', written, total);
        }
      );

      console.log('Upload Result: ', uploadResult);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (videoUri) {
    return (
      <View style={styles.containerVideo}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            setVideoUri(null);
          }}>
          <EvilIcons name="chevron-left" size={56} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.videoSubmitButton}
          onPress={() => {
            setUploadState(true);
            uploadImage(currentUri);
          }}>
          <Text style={{ color: 'white' }}>确认</Text>
        </TouchableOpacity>
        <Video
          source={{ uri: videoUri }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          isLooping
        />
      </View>
    );
  }
  return (
    <NativeBaseProvider isSSR={false}>
      <Provider>
        <View style={styles.container}>
          {currentUri === '' ? (
            <CameraView
              style={styles.camera}
              facing={facing}
              mode={cameraMode}
              ref={(ref: any) => {
                setCamera(ref);
              }}>
              <Loading state={addLoading} />
              <TouchableOpacity style={styles.returnButton} onPress={returnToChat}>
                <EvilIcons name="chevron-left" size={24} color="black" style={styles.faceText} />
              </TouchableOpacity>
              <View style={styles.buttonContainer}>
                {cameraMode === 'picture' ? (
                  <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                    <EvilIcons name="refresh" size={24} color="black" style={styles.faceText} />
                  </TouchableOpacity>
                ) : null}
                {cameraMode === 'picture' ? (
                  <TouchableOpacity style={styles.button} onPress={captureImage}>
                    <MaterialCommunityIcons name="camera" size={36} color="black" />
                  </TouchableOpacity>
                ) : null}
                {recording ? (
                  <TouchableOpacity style={styles.button} onPress={stopVideoRecording}>
                    <MaterialCommunityIcons name="stop" size={36} color="red" />
                    <Text>{`${Math.floor(timer / 60)}:${(timer % 60)
                      .toString()
                      .padStart(2, '0')}`}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      setCameraMode('video');
                      setTimeout(() => {
                        recordVideo();
                      }, 200);
                    }}>
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
    marginVertical: 32,
    marginHorizontal: 12,
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
  containerVideo: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  video: {
    width: '100%',
    flex: 1, // 填满父容器
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  videoSubmitButton: {
    position: 'absolute',
    width: 70,
    height: 30,
    borderRadius: 35,
    backgroundColor: '#3eabe6',
    justifyContent: 'center',
    alignItems: 'center',
    top: 50,
    right: 20,
    zIndex: 1,
  },
});
