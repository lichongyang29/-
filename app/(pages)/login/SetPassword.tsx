import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import React, { useMemo } from 'react';
import {
  NativeBaseProvider,
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  Icon,
  Toast,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { resetPassword } from '@/api';
import Loading from '@/components/login/Loading';
import { Provider } from 'react-native-paper';

const SetPassword = () => {
  const { width, height } = useWindowDimensions();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [confirmShow, setConfirmShow] = React.useState(false);
  const [tipPassword, setTipPassword] = React.useState('');
  const [tipConfirmPassword, setTipConfirmPassword] = React.useState('');
  const [state, setState] = React.useState(false);
  const params = useLocalSearchParams(); // 获取路由参数
  const phoneStr = /^1[3-9]\d{9}$/;
  const emailStr = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

  const changePassword = (text: string) => {
    setPassword(text);
    if (confirmPassword.length > 0) {
      if (text === confirmPassword) {
        setTipConfirmPassword('');
      } else {
        setTipConfirmPassword('两次输入的密码不一致');
      }
    }
    if ((text.length > 7 && text.length < 16) || text.length === 0) {
      setTipPassword('');
    } else {
      setTipPassword('密码长度需8~15位');
    }
  };

  const changeConfirmPassword = (text: string) => {
    setConfirmPassword(text);
    if (text.length === 0) {
      setTipConfirmPassword('');
      return;
    }
    if (password.length === 0) {
      setTipConfirmPassword('请先输入密码');
      return;
    }
    if (text.length > 7 && text.length < 16) {
      if (password === text) {
        setTipConfirmPassword('');
      } else {
        setTipConfirmPassword('两次输入的密码不一致');
      }
    } else {
      setTipConfirmPassword('密码长度需8~15位');
    }
  };

  const disableBtn = useMemo(() => {
    if (tipPassword.length > 0 || tipConfirmPassword.length > 0) {
      return true;
    } else if (password.length > 0 && confirmPassword.length > 0) {
      return false;
    } else {
      return true;
    }
  }, [password, confirmPassword, tipPassword, tipConfirmPassword]);

  const save = async () => {
    setState(true);
    //TODO: 保存密码
    let obj = phoneStr.test(params.value as string)
      ? { phone: params.value, password }
      : { email: params.value, password };
    let { code, message } = await resetPassword(obj);
    if (code === 200) {
      setState(false);
      router.replace('/login/Login');
    } else {
      setState(false);
      Toast.show({ title: message });
    }
  };
  return (
    <NativeBaseProvider>
      <Provider>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.SetPassword}>
            <Box safeArea p="2" w="100%" maxW={width * 0.8} py="8">
              <Heading
                size="lg"
                color="coolGray.800"
                _dark={{
                  color: 'warmGray.50',
                }}
                fontWeight="semibold">
                设置新密码
              </Heading>
              <Heading
                mt="1"
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
                }}
                fontWeight="medium"
                size="xs">
                请设置8~15位数字字母组合的密码
              </Heading>
              <VStack space={3} mt="5">
                <FormControl isInvalid={tipPassword.length > 0}>
                  <Input
                    borderRadius={10}
                    placeholder="密码"
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
                  />
                  <FormControl.ErrorMessage>{tipPassword}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={tipConfirmPassword.length > 0}>
                  <Input
                    borderRadius={10}
                    placeholder="确认密码"
                    type={confirmShow ? 'text' : 'password'}
                    value={confirmPassword}
                    onChangeText={(text) => changeConfirmPassword(text)}
                    InputRightElement={
                      <Pressable onPress={() => setConfirmShow(!confirmShow)}>
                        <Icon
                          as={
                            <MaterialIcons name={confirmShow ? 'visibility' : 'visibility-off'} />
                          }
                          size={5}
                          mr="2"
                          color="muted.400"
                        />
                      </Pressable>
                    }
                  />
                  <FormControl.ErrorMessage>{tipConfirmPassword}</FormControl.ErrorMessage>
                </FormControl>

                <Button mt="2" borderRadius={10} isDisabled={disableBtn} onPress={() => save()}>
                  保存
                </Button>
              </VStack>
            </Box>
            <Loading state={state}></Loading>
          </View>
        </TouchableWithoutFeedback>
      </Provider>
    </NativeBaseProvider>
  );
};

export default SetPassword;

const styles = StyleSheet.create({
  SetPassword: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
});
