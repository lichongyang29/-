import { faceAdd, faceLogin } from '@/api';
import Loading from '@/components/login/Loading';
import { useSession } from '@/ctx';
import { setStorageItemAsync, useStorageState } from '@/hooks/useStorageState';
import { userInfoObj } from '@/utils/utils';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { CameraType } from 'expo-camera/build/legacy/Camera.types';
import * as ImageManipulator from 'expo-image-manipulator';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { NativeBaseProvider, Toast } from 'native-base';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-native-paper';

type Camera = any;

export default function FaceLogin() {
  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [state, setState] = useState(false);
  const params: { title: string } = useLocalSearchParams();
  // const hideDialog = () => setState(false);
  const { signIn } = useSession();
  const [[status, userInfo], setUser] = useStorageState('userInfo');
  const user: userInfoObj = userInfo ? JSON.parse(userInfo) : null;

  let camera: Camera;

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>需要权限来打开相机</Text>
        <Button onPress={requestPermission} title="确认" />
      </View>
    );
  }
  const __takePicture = async () => {
    setState(true);
    if (!camera) return;
    const photo = await camera.takePictureAsync({ base64: true });
    const manipResult = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: 200, height: 200 } }],
      {
        compress: 0,
        format: ImageManipulator.SaveFormat.PNG,
        base64: true,
      }
    );
    const base64 = manipResult.base64 ? manipResult.base64 : '';
    if (params.title) {
      let { code, message } = await faceAdd({
        img: base64,
        PersonName: user.name,
        PersonId: user._id,
      });
      setState(false);
      if (code === 200) {
        Toast.show({ title: message, duration: 2000 });
      } else {
        Toast.show({ title: message, duration: 2000 });
      }
    } else {
      let { code, message, data, accessToken, refreshToken } = await faceLogin(base64);
      if (code === 200) {
        await setStorageItemAsync('accessToken', accessToken);
        await setStorageItemAsync('refreshToken', refreshToken);
        await setStorageItemAsync('userInfo', JSON.stringify(data));
        signIn(accessToken);
        console.log('登录成功');
        router.replace('/(pages)/(tabs)/');
      } else {
        Toast.show({ title: message, duration: 2000 });
        setState(false);
      }
    }
  };

  return (
    <NativeBaseProvider>
      <Provider>
        <View style={styles.containerCamera}>
          <Stack.Screen
            options={{
              title: params.title || '人脸识别登录',
              headerShown: true,
              headerTitleAlign: 'center',
            }}></Stack.Screen>
          <View style={styles.cameraBox}>
            <CameraView
              style={styles.camera}
              facing={CameraType.front}
              ref={(r) => {
                camera = r;
              }}></CameraView>
          </View>
          <Button title={params.title || '人脸识别登录'} onPress={__takePicture}></Button>
          <Loading state={state} />
        </View>
      </Provider>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  containerCamera: {
    flex: 1,
    alignItems: 'center',
  },
  cameraBox: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    marginTop: 50,
  },
  camera: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
});
