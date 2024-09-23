import { emailRegister, phoneRegister } from '@/api';
import Loading from '@/components/login/Loading';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  AlertDialog,
  Box,
  Button,
  FormControl,
  Heading,
  Icon,
  Input,
  Link,
  NativeBaseProvider,
  Pressable,
  Radio,
  Toast,
  VStack,
} from 'native-base';
import React, { useMemo } from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import { Provider } from 'react-native-paper';

const Register = () => {
  const { width, height } = useWindowDimensions();
  const [show, setShow] = React.useState(false);
  const [confirmShow, setConfirmShow] = React.useState(false);
  const [value, setValue] = React.useState('');
  const phoneStr = /^1[3-9]\d{9}$/;
  const emailStr = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  const nameStr = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
  const [tipUser, setTipUser] = React.useState('');
  const [tipPassword, setTipPassword] = React.useState('');
  const [tipConfirmPassword, setTipConfirmPassword] = React.useState('');
  const [tipName, setTipName] = React.useState('');
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [state, setState] = React.useState(false);

  const onClose = () => setIsOpen(false);

  const cancelRef = React.useRef(null);

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

  const changeName = (text: string) => {
    setName(text);
    if (text.length === 0 || nameStr.test(text)) {
      setTipName('');
    } else {
      setTipName('输入的昵称不符合规范');
    }
  };

  const disableBtn = useMemo(() => {
    if (
      tipUser.length > 0 ||
      tipPassword.length > 0 ||
      tipConfirmPassword.length > 0 ||
      tipName.length > 0
    ) {
      return true;
    } else if (
      (user.length > 0 && password.length > 0 && confirmPassword.length > 0) ||
      name.length > 0
    ) {
      return false;
    } else {
      return true;
    }
  }, [user, password, confirmPassword, tipPassword, tipUser, tipConfirmPassword, name, tipName]);

  const register = async () => {
    setState(true);
    if (value === '') {
      setIsOpen(!isOpen);
      setState(false);
      return false;
    }
    let res = null;
    if (phoneStr.test(user)) {
      res = await phoneRegister({
        phone: user,
        name: name,
      });
    } else {
      res = await emailRegister({
        email: user,
        name: name,
      });
    }
    let { code, message, codeNum } = res;
    if (code === 200) {
      setState(false);
      console.log(codeNum);
      router.push({ pathname: '/(pages)/login/Authentication', params: { user, name, password } });
    } else {
      Toast.show({
        title: message,
      });
      setState(false);
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
                注册
              </Heading>
              <Heading
                mt="1"
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
                }}
                fontWeight="medium"
                size="xs">
                一站式找房租房 为您推荐合适房源
              </Heading>
              <VStack space={3} mt="5">
                <FormControl isInvalid={tipUser.length > 0}>
                  <Input
                    placeholder="输入手机号或邮箱"
                    borderRadius={10}
                    value={user}
                    onChangeText={(text) => changeUser(text)}
                  />
                  <FormControl.ErrorMessage>{tipUser}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={tipName.length > 0}>
                  <Input
                    placeholder="输入昵称"
                    borderRadius={10}
                    value={name}
                    onChangeText={(text) => changeName(text)}
                  />
                  <FormControl.ErrorMessage>{tipName}</FormControl.ErrorMessage>
                </FormControl>
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
                <Button mt="2" borderRadius={10} isDisabled={disableBtn} onPress={() => register()}>
                  注册
                </Button>
                <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                  <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>提示</AlertDialog.Header>
                    <AlertDialog.Body>请先同意用户隐私政策</AlertDialog.Body>
                    <AlertDialog.Footer>
                      <Button.Group space={2}>
                        <Button
                          variant="unstyled"
                          colorScheme="coolGray"
                          onPress={onClose}
                          ref={cancelRef}>
                          确认
                        </Button>
                      </Button.Group>
                    </AlertDialog.Footer>
                  </AlertDialog.Content>
                </AlertDialog>
                <Radio.Group
                  name="myRadioGroup"
                  accessibilityLabel="favorite number"
                  value={value}
                  onChange={(nextValue) => {
                    setValue(nextValue);
                  }}>
                  <Radio value="one" my={1}>
                    注册即表示同意
                    <Link isUnderlined={false} color="#4395AB">
                      《用户隐私政策》
                    </Link>
                  </Radio>
                </Radio.Group>
              </VStack>
            </Box>
            <Loading state={state}></Loading>
          </View>
        </TouchableWithoutFeedback>
      </Provider>
    </NativeBaseProvider>
  );
};

export default Register;

const styles = StyleSheet.create({
  Register: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
});
