import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import React, { useEffect, useMemo } from 'react';
import {
  NativeBaseProvider,
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  Toast,
} from 'native-base';
import { Provider } from 'react-native-paper';
import Loading from '@/components/login/Loading';
import { forgetPassword } from '@/api';
import { router } from 'expo-router';

const ForgetPassword = () => {
  const { width, height } = useWindowDimensions();
  const [value, setValue] = React.useState('');
  const [tipValue, setTipValue] = React.useState('');
  const [codeValue, setCodeValue] = React.useState('');
  const [codeNum, setCodeNum] = React.useState('');
  const [state, setState] = React.useState(false);
  const [tryAgain, setTryAgain] = React.useState(true);
  const [seconds, setSeconds] = React.useState(60);
  const phoneStr = /^1[3-9]\d{9}$/;
  const emailStr = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  const codeNumStr = /^[0-9]*$/;

  const changeInfo = (text: string) => {
    setValue(text);
    if (phoneStr.test(text) || emailStr.test(text) || text.length === 0) {
      setTipValue('');
    } else {
      setTipValue('输入电话或邮箱的格式不准确');
    }
  };

  const changeCode = (text: string) => {
    if (codeNumStr.test(text)) {
      setCodeValue(text);
    }
  };

  const disableBtn = useMemo(() => {
    if (tipValue.length > 0 || value.length === 0 || codeValue.length === 0) {
      return true;
    }
    return false;
  }, [tipValue, value, codeValue]);

  // 获取验证码
  const getCode = async () => {
    setState(true);
    let obj = phoneStr.test(value) ? { phone: value } : { email: value };
    let { code, message, codeNum } = await forgetPassword(obj);
    if (code === 200) {
      setState(false);
      setCodeNum(codeNum);
      Toast.show({
        title: '验证码已发送',
      });
    } else {
      setState(false);
      Toast.show({
        title: message,
      });
      return false;
    }
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 0) {
          setTryAgain(false);
          clearInterval(intervalId);
          return 60;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  };

  const submit = () => {
    // setState(true);
    if (codeNum === '') {
      Toast.show({
        title: '验证码无效,请先获取验证码',
      });
      return false;
    }
    if (seconds === 60 || seconds === 0) {
      Toast.show({
        title: '验证码已过期，请重新获取',
      });
      return false;
    }
    if (codeNum !== codeValue) {
      Toast.show({
        title: '验证码错误',
      });
      return false;
    }
    router.push({
      pathname: '/login/SetPassword',
      params: { value },
    });
  };
  return (
    <NativeBaseProvider>
      <Provider>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.ForgetPassword}>
            <Box safeArea p="2" w="100%" maxW={width * 0.8} py="8">
              <Heading
                size="lg"
                color="coolGray.800"
                _dark={{
                  color: 'warmGray.50',
                }}
                fontWeight="semibold">
                忘记密码
              </Heading>
              <Heading
                mt="1"
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
                }}
                fontWeight="medium"
                size="xs">
                请输入您所绑定的手机号或邮箱，以便找回您的密码
              </Heading>
              <VStack space={3} mt="5">
                <FormControl isInvalid={tipValue.length > 0}>
                  <Input
                    placeholder="输入手机号或邮箱"
                    borderRadius={10}
                    value={value}
                    onChangeText={(text) => changeInfo(text)}
                  />
                  <FormControl.ErrorMessage>{tipValue}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl>
                  <Input
                    type="text"
                    InputRightElement={
                      <Button
                        size="sm"
                        rounded="none"
                        h="full"
                        w="2/5"
                        isDisabled={value.length === 0 || tipValue.length > 0 || seconds !== 60}
                        onPress={() => getCode()}>
                        {seconds === 60
                          ? tryAgain
                            ? '获取验证码'
                            : '重新获取验证码'
                          : `${seconds}秒后重试`}
                      </Button>
                    }
                    placeholder="输入验证码"
                    borderRadius={10}
                    maxLength={6}
                    value={codeValue}
                    onChangeText={(text) => changeCode(text)}
                  />
                </FormControl>

                <Button mt="2" borderRadius={10} isDisabled={disableBtn} onPress={() => submit()}>
                  确认
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

export default ForgetPassword;

const styles = StyleSheet.create({
  ForgetPassword: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
});
