import { addUser } from '@/api';
import Loading from '@/components/login/Loading';
import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Box, Button, Heading, NativeBaseProvider, Toast, VStack } from 'native-base';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import { Provider } from 'react-native-paper';

interface oTPInputProps {
  codeLength?: number;
}

interface infoObj {
  codeNum: string | string[];
  name: string | string[];
  password: string | string[];
  phone: string | string[];
  email: string | string[];
}

const Authentication: React.FC<oTPInputProps> = ({ codeLength = 6 }) => {
  const { width, height } = useWindowDimensions();
  const { user, name, password } = useLocalSearchParams();
  const [codeNum, setCodeNum] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [seconds, setSeconds] = useState<number>(60);
  const [state, setState] = useState<boolean>(false);
  const navigate = useNavigation();
  const isFocused = useIsFocused();
  const phoneStr = /^1[3-9]\d{9}$/;
  const emailStr = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

  const handleChangeText = (text: string) => {
    const textRegexp = /^[0-9]*$/;

    if (text.length <= codeLength) {
      if (textRegexp.test(text)) {
        setCodeNum(text);
      }
    }
    if (text.length === codeLength) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const renderBoxes = () => {
    const boxes = [];
    for (let i = 0; i < codeLength; i++) {
      boxes.push(
        <View key={i} style={styles.box}>
          <Text style={styles.boxText}>{codeNum[i] || ''}</Text>
        </View>
      );
    }
    return boxes;
  };

  // 手动配置返回上一个页面时出现提示
  useEffect(() => {
    const unsubscribe = navigate.addListener('beforeRemove', (e) => {
      if (!isFocused) {
        // 当前页面失去焦点时不触发逻辑
        return;
      }

      // 判断是否是返回操作
      console.log(e.data.action.type);
      if (e.data.action.type === 'GO_BACK' || e.data.action.type === 'POP') {
        // 阻止默认的返回行为
        e.preventDefault();

        // 显示确认对话框
        Alert.alert('确认', '你确定要返回上一页面吗？', [
          { text: '取消', style: 'cancel', onPress: () => {} },
          {
            text: '确认',
            style: 'destructive',
            onPress: () => {
              // 手动触发返回行为
              navigate.dispatch(e.data.action);
            },
          },
        ]);
      }
    });

    return unsubscribe;
  }, []);

  // 设置倒计时
  useEffect(() => {
    if (seconds === 0) return;

    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds]);

  const sure = async () => {
    if (seconds === 0) {
      Alert.alert('提示', '验证码已过期，请重新获取', [
        {
          text: '确认',
          style: 'destructive',
        },
      ]);
      return false;
    }
    let obj = { name, password, codeNum } as infoObj;
    if (phoneStr.test(user as string)) {
      obj = { ...obj, phone: user };
    } else if (emailStr.test(user as string)) {
      obj = { ...obj, email: user };
    }
    let { code, message } = await addUser(obj);
    if (code === 200) {
      router.push('/login/Login');
    } else {
      setState(false);
      Toast.show({
        title: message,
      });
    }
  };
  return (
    <NativeBaseProvider>
      <Provider>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.Register}>
            <Box safeArea p="2" w="100%" maxW={width * 0.8} py="8">
              <Heading
                size="lg"
                color="coolGray.800"
                _dark={{
                  color: 'warmGray.50',
                }}
                fontWeight="semibold">
                短信验证
              </Heading>
              <Heading
                mt="1"
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
                }}
                fontWeight="medium"
                size="xs">
                短信验证码已发送至您的手机或邮箱，请注意查收
              </Heading>
              <VStack space={3} mt="5">
                <View style={styles.input}>
                  {renderBoxes()}
                  <TextInput
                    style={styles.hiddenInput}
                    value={codeNum}
                    onChangeText={handleChangeText}
                    keyboardType="numeric"
                    maxLength={codeLength}
                    autoFocus
                    caretHidden={true}
                  />
                </View>
                <Button
                  mt="2"
                  borderRadius={10}
                  isDisabled={isDisabled}
                  onPress={() => {
                    sure();
                  }}>
                  确定
                </Button>
                <Text style={styles.timer}>
                  {seconds === 0 ? '验证码已过期，请重新发送' : `倒计时${seconds}S`}
                </Text>
              </VStack>
            </Box>
            <Loading state={state}></Loading>
          </View>
        </TouchableWithoutFeedback>
      </Provider>
    </NativeBaseProvider>
  );
};

export default Authentication;

const styles = StyleSheet.create({
  Register: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
  Title: {
    fontWeight: 'bold',
  },
  titleSmall: {
    color: '#999',
    marginTop: 15,
  },
  timer: {
    marginTop: 10,
    fontSize: 14,
    color: 'gray',
  },
  input: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    fontSize: 18,
    textAlign: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
});
