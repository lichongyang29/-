import { View, Text, ActivityIndicator, Button, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { WEIBO_CLIENT_ID, REDIRECT_URI, AUTHORIZATION_ENDPOINT } from '@/utils/login';
import { authWeiBo } from '@/api';
import { router } from 'expo-router';
import Loading from '@/components/login/Loading';
import { useSession } from '@/ctx';
import { setStorageItemAsync } from '@/hooks/useStorageState';
import { Provider } from 'react-native-paper';
import { NativeBaseProvider } from 'native-base';

const WeiBoLogin = () => {
  let num = 0;
  const [state, setState] = useState(false);
  const { signIn } = useSession();
  // 当 WebView URL 发生变化时捕获授权码
  const handleWebViewNavigationStateChange = async (navState: any) => {
    const { url } = navState;
    // 判断是否是回调地址
    if (url.startsWith(REDIRECT_URI)) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const codeInfo = urlParams.get('code');
      if (codeInfo) {
        console.log('授权码:', codeInfo);
        num++;
        setState(true);
        if (num === 1) {
          let { code, accessToken, refreshToken, message, data } = await authWeiBo(codeInfo);
          setState(false);
          if (code === 200) {
            // 登录成功
            await setStorageItemAsync('accessToken', accessToken);
            await setStorageItemAsync('refreshToken', refreshToken);
            await setStorageItemAsync('userInfo', JSON.stringify(data));
            // socket.emit('register', data._id);
            signIn(accessToken);
            router.push('/(pages)/(tabs)/');
          } else {
            console.log('登录失败', message);
          }
        }
      }
    }
  };

  // 微博授权的URL
  const weiboAuthUrl = `${AUTHORIZATION_ENDPOINT}?client_id=${WEIBO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  return (
    <NativeBaseProvider>
      <Provider>
        <View style={{ flex: 1 }}>
          {!state && (
            <WebView
              source={{ uri: weiboAuthUrl }}
              useWebKit={true}
              onNavigationStateChange={handleWebViewNavigationStateChange} // 监听 URL 变化
              style={{ flex: 1 }}
            />
          )}

          {state && (
            <View style={styles.loading}>
              <Loading state={state}></Loading>
            </View>
          )}
        </View>
      </Provider>
    </NativeBaseProvider>
  );
};

export default WeiBoLogin;

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 999,
  },
});
