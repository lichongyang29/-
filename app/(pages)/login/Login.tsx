import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Button,
  NativeBaseProvider,
  Icon,
  Input,
  Pressable,
  Stack,
  Box,
  FormControl,
  Toast,
  Spinner,
  HStack,
  Heading,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { Path, G } from 'react-native-svg';
import { authWeiBo, userLogin } from '@/api';
import { setStorageItemAsync } from '@/hooks/useStorageState';
import { Dialog, Portal, Provider } from 'react-native-paper';
import { useSession } from '@/ctx';
import Loading from '@/components/login/Loading';
import Entypo from '@expo/vector-icons/Entypo';
import socket from '@/utils/socket';

type objInfo = {
  phone: string;
  password: string;
  email: string;
};

const Login = () => {
  const { width, height } = useWindowDimensions();
  const phoneStr = /^1[3-9]\d{9}$/;
  const emailStr = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  const [state, setState] = useState(false);
  const [show, setShow] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [tipUser, setTipUser] = useState('');
  const [tipPassword, setTipPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const { signIn } = useSession();

  // const hideDialog = () => setState(false);

  const changeUser = (text: string) => {
    setUser(text);
    if (phoneStr.test(text) || emailStr.test(text) || text.length === 0) {
      setTipUser('');
    } else {
      setTipUser('输入电话或邮箱的格式不准确');
    }
  };
  const changePassword = (text: string) => {
    setPassword(text);
    if ((text.length > 7 && text.length < 16) || text.length === 0) {
      setTipPassword('');
    } else {
      setTipPassword('密码长度需8~15位');
    }
  };

  const disableBtn = useMemo(() => {
    if (tipUser.length > 0 || tipPassword.length > 0) {
      return true;
    } else if (user.length > 0 && password.length > 0) {
      return false;
    } else {
      return true;
    }
  }, [user, password, tipPassword, tipUser]);

  const loginBtn = async () => {
    setState(true);
    let obj = { password } as objInfo;
    if (phoneStr.test(user)) {
      obj.phone = user;
    }
    if (emailStr.test(user)) {
      obj.email = user;
    }
    let { data, accessToken, refreshToken, message, code } = await userLogin(obj);
    if (code === 200) {
      await setStorageItemAsync('accessToken', accessToken);
      await setStorageItemAsync('refreshToken', refreshToken);
      await setStorageItemAsync('userInfo', JSON.stringify(data));
      socket.emit('register', data._id);
      signIn(accessToken);
      // console.log('登录成功');
      router.replace('/(pages)/(tabs)/');
    } else {
      Toast.show({ title: message, duration: 2000 });
      setState(false);
    }
  };
  return (
    <NativeBaseProvider isSSR={false}>
      <SafeAreaView style={styles.login}>
        <Provider>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.content}>
              {/**icon图标 */}
              <View
                style={{ alignItems: 'center', height: height * 0.3, justifyContent: 'center' }}>
                <View style={styles.icon}>
                  <Entypo name="home" size={50} color="white" />
                </View>
                <Text style={styles.title}>理想寓</Text>
                <Text style={styles.titleSmall}>一站式找房租房 为您推荐合适房源</Text>
              </View>
              {/**登录表单 */}
              <View style={[styles.from, { height: height * 0.3 }]}>
                <Stack space={4} w="100%" mx="auto">
                  <FormControl isInvalid={tipUser.length > 0}>
                    <Input
                      placeholder="输入手机号/邮箱"
                      borderRadius={10}
                      w="100%"
                      size="l"
                      h={{ base: '12' }}
                      borderColor={'#cecece'}
                      value={user}
                      onChangeText={(text) => changeUser(text)}
                    />

                    <FormControl.ErrorMessage>{tipUser}</FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={tipPassword.length > 0}>
                    <Input
                      borderRadius={10}
                      borderColor={'#cecece'}
                      w="100%"
                      h={{
                        base: '12',
                      }}
                      size="l"
                      type={show ? 'text' : 'password'}
                      value={password}
                      onChangeText={(text) => changePassword(text)}
                      InputRightElement={
                        <Pressable onPress={() => setShow(!show)}>
                          <Icon
                            as={<MaterialIcons name={show ? 'visibility' : 'visibility-off'} />}
                            size={5}
                            mr="2"
                            color="muted.400"
                          />
                        </Pressable>
                      }
                      placeholder="输入密码"
                    />
                    <FormControl.ErrorMessage>{tipPassword}</FormControl.ErrorMessage>
                  </FormControl>
                </Stack>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Text
                    style={styles.forgetPassword}
                    onPress={() => {
                      router.push('/(pages)/login/ForgetPassword');
                    }}>
                    忘记密码
                  </Text>
                </View>
                <Box alignItems="center">
                  <Button
                    style={styles.input}
                    onPress={() => {
                      loginBtn();
                    }}
                    size="lg"
                    h={{ base: '12' }}
                    w="100%"
                    isDisabled={disableBtn}>
                    登录
                  </Button>
                </Box>
              </View>
              {/* 其他方式登录 */}
              <View style={[styles.otherLogin, { height: height * 0.2 }]}>
                <Text style={{ color: '#939aa3' }}>-其他方式登录-</Text>
                <View style={styles.otherLoginContent}>
                  {/* qqIcon */}
                  <Icon
                    size="xl"
                    viewBox="0 0 1024 1024"
                    onPress={() => {
                      Toast.show({
                        title: '暂无开发',
                      });
                    }}>
                    <G
                      t="1724290031866"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="5414"
                      width="32"
                      height="32">
                      <Path
                        d="M148.859845 404.057356c-5.11465 15.34395 0 20.4586 0 76.719751 0 15.34395-61.375801 76.719751-86.949052 143.210202-25.57325 66.490451-25.57325 138.095552 10.2293 163.668803 35.802551 30.6879 71.605101-92.063701 76.719752-71.605101 0 5.11465 5.11465 15.34395 5.11465 25.57325 15.34395 35.802551 35.802551 71.605101 61.375801 102.293002 5.11465 5.11465-35.802551 20.4586-61.375801 61.3758-25.57325 40.917201 10.2293 117.636952 132.980902 117.636952 158.554152 0 199.471353-56.261151 199.471353-56.261151h51.1465c10.2293 0 86.949051 66.490451 194.356703 56.261151 184.127403-20.4586 158.554152-81.834401 143.210202-122.751602-15.34395-40.917201-66.490451-61.375801-66.490451-61.375801 46.031851-51.146501 51.146501-76.719751 66.490451-122.751601 5.11465-20.4586 51.146501 102.293002 81.834402 71.605101 15.34395-10.2293 40.917201-61.375801 15.34395-163.668803s-81.834401-127.866252-81.834401-143.210202V404.057356c-10.2293-35.802551-30.6879-25.57325-30.687901-35.802551 0-204.586003-153.439502-368.254805-342.681555-368.254805S174.433095 163.668802 174.433095 368.254805c0 15.34395-15.34395 5.11465-25.57325 35.802551z m0 0"
                        fill="#4A9AFD"
                        p-id="5415"></Path>
                    </G>
                  </Icon>

                  {/* 微博icon */}
                  <Icon
                    size="xl"
                    viewBox="0 0 1024 1024"
                    onPress={() => {
                      router.push('/(pages)/login/WeiBoLogin');
                    }}>
                    <G
                      t="1724291597758"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="6564"
                      width="32"
                      height="32">
                      <Path
                        d="M676.16 232.48s113.28-12 161.44 58.24 27.36 158.56 27.36 158.56a21.92 21.92 0 0 0 22.56 26.08h11.2A30.4 30.4 0 0 0 928 449.12s26.08-138.56-54.4-215.68c-62.72-60.32-148.64-66.88-183.04-66.88h-15.2a27.04 27.04 0 0 0-26.4 26.88v13.12a25.6 25.6 0 0 0 27.2 25.92zM453.12 758.08c79.04-16 132.48-81.92 119.52-148.64-11.2-57.44-67.84-96-133.76-96a163.52 163.52 0 0 0-32 3.2c-79.04 16-132.48 81.92-119.52 148.64s86.88 108.16 165.76 92.8z m2.24-171.68A24.64 24.64 0 1 1 432 611.04a24.48 24.48 0 0 1 23.36-24.64zM368 624.96c24.32-11.36 51.04-5.6 59.52 12.96s-3.52 42.72-27.52 54.08a60.96 60.96 0 0 1-25.12 5.76 36 36 0 0 1-34.4-18.88c-8.96-18.4 3.68-42.56 27.52-53.92z"
                        fill="#F56467"
                        p-id="6565"></Path>
                      <Path
                        d="M467.52 857.44c208 0 374.4-110.24 374.4-246.4 0-114.88-141.76-114.88-141.76-122.4s70.72-74.08 0-115.68c-42.24-24.96-105.6-12.16-148.8 0a330.24 330.24 0 0 1-47.04 14.4c55.68-97.12-23.68-128-64-128-96 0-348.64 214.88-348.64 350.88s168.16 247.2 375.84 247.2z m-34.4-392.64c132.64-18.72 250.24 37.28 262.56 124.8s-85.28 173.76-218.08 192a365.28 365.28 0 0 1-50.72 3.52c-110.72 0-200.96-52.16-211.68-128-12.32-87.52 85.28-173.76 217.92-192.32z"
                        fill="#F56467"
                        p-id="6566"></Path>
                      <Path
                        d="M780.64 444.16h16a21.44 21.44 0 0 0 20.64-17.44s18.88-73.12-24.96-113.12a111.04 111.04 0 0 0-75.84-28.16 108.32 108.32 0 0 0-25.28 2.56 21.12 21.12 0 0 0-17.44 20.16v6.88a16 16 0 0 0 17.92 16.8s48-6.56 71.36 21.6 5.12 73.76 5.12 73.76a12.32 12.32 0 0 0 12.48 16.96z"
                        fill="#F56467"
                        p-id="6567"></Path>
                    </G>
                  </Icon>

                  {/* 手机icon */}
                  <Icon
                    size="xl"
                    viewBox="0 0 1024 1024"
                    onPress={() => {
                      router.push({
                        pathname: '/(pages)/login/OtherLogin',
                        params: { title: '手机号' },
                      });
                    }}>
                    <G
                      t="1724291673001"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="7641"
                      width="32"
                      height="32">
                      <Path
                        d="M713.8 0H309.08A78.24 78.24 0 0 0 230.84 78.24v867.52A78.24 78.24 0 0 0 309.08 1024H714.84a78.24 78.24 0 0 0 78.24-78.24V77.28A80 80 0 0 0 713.8 0z m32.56 897.92H276.6V83.2h469.76z"
                        fill="#2196F3"
                        p-id="7642"></Path>
                    </G>
                  </Icon>

                  {/* 邮箱icon */}
                  <Icon
                    size="xl"
                    viewBox="0 0 1243 1024"
                    onPress={() => {
                      router.push({
                        pathname: '/(pages)/login/OtherLogin',
                        params: { title: '邮箱' },
                      });
                    }}>
                    <G
                      t="1724291782473"
                      class="icon"
                      viewBox="0 0 1243 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="9674"
                      width="32"
                      height="32">
                      <Path
                        d="M1123.401143 1024H120.027429A120.173714 120.173714 0 0 1 0 903.972571V120.027429C0 53.833143 53.833143 0 120.027429 0H1123.474286C1189.595429 0 1243.428571 53.833143 1243.428571 120.027429V904.045714c0 66.121143-53.833143 119.954286-120.027428 119.954286zM120.027429 58.514286a61.586286 61.586286 0 0 0-61.513143 61.513143V904.045714c0 33.865143 27.574857 61.44 61.513143 61.44H1123.474286c33.865143 0 61.44-27.574857 61.44-61.44V120.027429A61.586286 61.586286 0 0 0 1123.474286 58.514286H120.027429z"
                        fill="#FF0000"
                        p-id="9675"></Path>
                      <Path
                        d="M1202.176 30.208L662.601143 569.782857a59.172571 59.172571 0 0 1-81.773714 0L41.252571 30.208a119.369143 119.369143 0 0 0-36.132571 56.978286l529.115429 529.115428c24.137143 24.137143 55.808 36.205714 87.478857 36.205715a123.611429 123.611429 0 0 0 87.478857-36.132572l529.188571-529.188571a120.027429 120.027429 0 0 0-36.205714-56.978286z"
                        fill="#FF0000"
                        p-id="9676"></Path>
                    </G>
                  </Icon>

                  {/* 人脸icon */}
                  <Icon
                    size="xl"
                    viewBox="0 0 1024 1024"
                    onPress={() => {
                      router.push('/(pages)/login/FaceLogin');
                    }}>
                    <G
                      t="1724468207507"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="4468"
                      width="32"
                      height="32">
                      <Path
                        d="M896 0h-96a30.72 30.72 0 0 0-22.656 10.016c-6.08 6.56-9.44 15.2-9.376 24.128 0 8.768 3.136 17.44 9.376 24.128a30.72 30.72 0 0 0 22.656 9.984h96v102.432c0 8.768 3.072 17.376 9.376 24.128a30.72 30.72 0 0 0 45.248 0c6.08-6.56 9.44-15.168 9.376-24.128v-102.4C960 30.56 931.296 0 896 0z m32 512a31.744 31.744 0 0 0-22.656 9.312 31.712 31.712 0 0 0-9.344 22.624v96h-96a31.744 31.744 0 0 0-22.656 9.376c-1.696 1.696-2.624 3.904-3.872 5.952-36.096-34.752-76.672-63.296-121.6-82.304 91.2-54.464 148.928-159.232 131.2-276.992-16.672-110.432-102.4-202.816-211.776-225.632A287.872 287.872 0 0 0 512 64.128a274.24 274.24 0 0 0-274.304 274.24c0 100.16 54.304 186.88 134.4 234.72-44.8 19.008-85.472 47.552-121.6 82.304-1.216-2.08-2.144-4.256-3.904-5.952A31.744 31.744 0 0 0 224 640.064h-96v-96a31.712 31.712 0 0 0-9.344-22.624 31.744 31.744 0 0 0-22.656-9.376 31.744 31.744 0 0 0-22.624 9.376 31.712 31.712 0 0 0-9.344 22.624v96c0 35.296 28.704 64 64 64h78.816c-53.472 69.216-90.56 155.968-102.272 252.832C100.224 992.544 128.672 1024 164.544 1024h694.88c35.904 0 64.224-31.52 60-67.104-11.648-96.992-48.8-183.744-102.304-252.96H896a64.064 64.064 0 0 0 64-64v-96a31.712 31.712 0 0 0-9.344-22.656 31.744 31.744 0 0 0-22.656-9.344V512zM96.032 204.8a30.72 30.72 0 0 0 22.592-9.984c6.08-6.56 9.44-15.168 9.376-24.128v-102.4h96a30.72 30.72 0 0 0 22.656-10.016c6.08-6.56 9.408-15.168 9.344-24.128 0.064-8.96-3.296-17.568-9.376-24.128A30.72 30.72 0 0 0 224 0H128C92.672 0 64 30.592 64 68.32v102.368c0 8.768 3.072 17.376 9.344 24.128a30.72 30.72 0 0 0 22.624 9.984h0.096z"
                        fill="#32C8DA"
                        p-id="4469"></Path>
                    </G>
                  </Icon>
                </View>
              </View>
              {/* 注册 */}
              <View style={[styles.footer, { height: height * 0.2 }]}>
                <Text>
                  还没有账号？
                  <Text
                    onPress={() => {
                      router.push('/(pages)/login/Register');
                    }}>
                    注册
                  </Text>
                </Text>
              </View>
              <Loading state={state}></Loading>
            </View>
          </TouchableWithoutFeedback>
        </Provider>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  login: {
    flex: 1,
    width: '100%',
  },
  webview: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    width: 80,
    height: 80,
    backgroundColor: '#4395AB',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
  },
  titleSmall: {
    fontSize: 15,
    marginTop: 10,
  },
  from: {
    width: '80%',
    marginTop: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    borderRadius: 10,
  },
  forgetPassword: {
    fontSize: 15,
    textAlign: 'right',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  otherLogin: {
    textAlign: 'center',
    alignItems: 'center',
    width: '80%',
    paddingTop: 10,
  },
  otherLoginContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 50,
  },
  footer: {
    justifyContent: 'center',
  },
});

export default Login;
