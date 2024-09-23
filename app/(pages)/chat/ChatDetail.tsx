import {
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { getMessage, getUserInfo, addMessageApi } from '@/api';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { messageObj, userInfoObj } from '@/utils/utils';
import Ionicons from '@expo/vector-icons/Ionicons';
import NoticeModal from '@/components/chat/NoticeModal';
import { NativeBaseProvider, Toast } from 'native-base';
import { Provider } from 'react-native-paper';
import ChatMessage from '@/components/chat/ChatMessage';
import { useStorageState } from '@/hooks/useStorageState';
import socket from '@/utils/socket';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import FunctionButton from '@/components/chat/FunctionButton';
import { alterChatUri, deleteChatUri } from '@/redux/module/rentChat';
import { useDispatch, useSelector } from 'react-redux';
import ImageView from 'react-native-image-viewing';
import useAddImage from './photoAlbum';
import Loading from '@/components/login/Loading';

const ChatDetail = () => {
  let { chatUri } = useSelector((store: any) => store.rentChatSlice);
  let dispatch = useDispatch();
  const { onPressAddImage, loading } = useAddImage();
  const { width, height } = useWindowDimensions();
  const [[state, userMessage], setUser] = useStorageState('userInfo');
  const user: userInfoObj = userMessage ? JSON.parse(userMessage) : null;
  let [messages, setMessages] = useState<messageObj[]>([]);
  let [userInfo, setUserInfo] = useState<userInfoObj | null>(null);
  let [inputValue, setInputValue] = useState<string>('');
  let [inputHeight, setInputHeight] = useState<number>(height * 0.055);
  const [isFunctionMenuVisible, setFunctionMenuVisible] = useState<boolean>(false);
  const animationValue = useSharedValue(0); // Animated value for functionMenu
  const menuHeight = useSharedValue(0);
  const navigation = useNavigation();
  const { friendid, receiveid } = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);
  const [visible, setIsVisible] = useState(false);
  let [images, setImages] = useState<any[]>([]);
  let [imgCount, setImgCount] = useState<number>(0);
  let buttonList = [
    {
      iconName: 'camera',
      label: '拍照',
    },
    {
      iconName: 'image',
      label: '相册',
    },
    {
      iconName: 'attach',
      label: '文件',
    },
    {
      iconName: 'location',
      label: '位置',
    },
    {
      iconName: 'videocam',
      label: '视频通话',
    },
  ];
  let getMessageList = async () => {
    let res = await getMessage({ _id: friendid });
    setMessages(res.data);
  };
  let getUser = async () => {
    let res = await getUserInfo({ _id: receiveid });
    setUserInfo(res.data);
  };
  interface messageObject {
    _id?: string | Date;
    userid: string;
    receiveid: string;
    friendid: string;
    content: string;
    time: Date | number;
    type: number;
    isRead: boolean;
  }
  let clickMatter = (label: string) => {
    if (label === '拍照') {
      router.push('/(pages)/chat/TakePicture');
    } else if (label === '相册') {
      onPressAddImage();
    }
  };
  let addFile = async (type: number) => {
    let messageInfo: messageObject = {
      userid: user?._id,
      receiveid: receiveid as string,
      friendid: friendid as string,
      content: chatUri,
      type: type,
      time: Date.now(),
      isRead: false,
    };

    setInputValue('');
    let res = await addMessageApi(messageInfo);
    console.log(messageInfo, 'send');
    messageInfo._id = new Date();
    setMessages((prev: any) => [...prev, messageInfo]);
    socket.emit('sendMessage', {
      toUserId: receiveid,
      message: messageInfo,
    });
    setFunctionMenuVisible(false); // 发送消息后隐藏 functionMenu
    dispatch(deleteChatUri());
    if (res.code !== 200) {
      Toast.show({ title: '发送失败', duration: 1000 });
      messages.pop();
      socket.emit('sendMessage', {
        toUserId: receiveid,
        message: 'error',
      });
    }
  };
  let addMessage = async () => {
    if (inputValue === '') {
      Toast.show({ title: '不能发送空内容', duration: 1000 });
      return;
    }
    let messageInfo: messageObject = {
      userid: user?._id,
      receiveid: receiveid as string,
      friendid: friendid as string,
      content: inputValue,
      type: 0,
      time: Date.now(),
      isRead: false,
    };

    setInputValue('');
    let res = await addMessageApi(messageInfo);
    console.log(messageInfo, 'send');
    messageInfo._id = new Date();
    setMessages((prev: any) => [...prev, messageInfo]);
    socket.emit('sendMessage', {
      toUserId: receiveid,
      message: messageInfo,
    });
    setFunctionMenuVisible(false); // 发送消息后隐藏 functionMenu
    if (res.code !== 200) {
      Toast.show({ title: '发送失败', duration: 1000 });
      messages.pop();
      socket.emit('sendMessage', {
        toUserId: receiveid,
        message: 'error',
      });
    }
  };
  // 从相册选择图片
  useEffect(() => {
    // 注册消息监听器
    const handleMessage = (data: any) => {
      console.log(data, 'receive');
      // 更新消息列表
      if (data === 'error') {
        messages.pop();
      } else {
        setMessages((prev) => [...prev, data]);
      }
    };
    socket.on('message', handleMessage);
    // 在组件卸载或依赖变化时移除监听器
    return () => {
      socket.off('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    getMessageList();
    getUser();
  }, []);
  useEffect(() => {
    if (messages.length > 0) {
      let messagesImg = messages.filter((item: any) => item.type === 1);
      // 遍历出上面这种格式的
      const newImages = messagesImg.map((item: any, index: number) => {
        return {
          uri: item.content,
        };
      });
      setImages(newImages);
    }
  }, [messages]);
  // 图片内容
  useEffect(() => {
    if (chatUri) {
      // 完成操作后，可以选择清除 URI
      addFile(1);
    }
  }, [chatUri]);
  useEffect(() => {
    navigation.setOptions({
      title: '', // 设置标题为用户的名称
    });
    if (userInfo) {
      navigation.setOptions({
        title: userInfo.name, // 设置标题为用户的名称
      });
    }
  }, [userInfo]);
  // 修改图片详情状态
  const handleImagePress = () => {
    setIsVisible(true);
  };
  // 寻找图片下标
  const findImageIndex = (uri: string) => {
    setImgCount(images.findIndex((image) => image.uri === uri));
  };
  let toBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };
  useEffect(() => {
    menuHeight.value = isFunctionMenuVisible ? height * 0.25 : 0;
    animationValue.value = isFunctionMenuVisible
      ? withSpring(1, { damping: 10, stiffness: 100 })
      : withSpring(0, { damping: 10, stiffness: 100 });
  }, [isFunctionMenuVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animationValue.value,
      transform: [{ translateY: withSpring(animationValue.value * 0) }],
      height: menuHeight.value,
      padding: animationValue.value * 20, // 动态的 padding
    };
  });
  return (
    <NativeBaseProvider isSSR={false}>
      <Provider>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Loading state={loading}></Loading>
          <ImageView
            images={images}
            imageIndex={imgCount}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
          />
          <FlatList
            ref={flatListRef} // Attach ref to FlatList
            style={{ flex: 1 }}
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ChatMessage
                userid={user._id}
                receiveid={item.receiveid}
                content={item.content}
                type={item.type}
                time={item.time}
                useImage={userInfo?.useImage}
                useMeImage={user.useImage}
                receiveName={userInfo?.name}
                meName={user.name}
                handleImagePress={handleImagePress}
                findImageIndex={findImageIndex}
              />
            )}
            ListFooterComponent={() => (
              <View style={{ height: inputHeight + height * 0.06 }}></View>
            )}
            onTouchStart={() => setFunctionMenuVisible(false)}
            onContentSizeChange={() => {
              setTimeout(() => {
                toBottom();
              }, 400);
            }}
          />
          <View style={[styles.inputView, { minHeight: height * 0.075 }]}>
            <View
              style={[
                styles.inputControl,
                {
                  width: width * 0.85,
                  maxWidth: width - height * 0.09,
                  minHeight: height * 0.055,
                  borderRadius: height * 0.0275,
                },
              ]}>
              <TextInput
                style={[styles.inputInner, { height: inputHeight }]}
                placeholder="说点什么..."
                placeholderTextColor="#ededed"
                onChangeText={(text) => setInputValue(text)}
                value={inputValue}
                multiline={true}
                numberOfLines={1}
                onContentSizeChange={(e) => {
                  const newHeight = Math.min(e.nativeEvent.contentSize.height, height * 0.22);
                  setInputHeight(newHeight);
                }}
                onFocus={() => {
                  setFunctionMenuVisible(false);
                  setTimeout(() => {
                    toBottom();
                  }, 200);
                }}
              />
              <Pressable
                onPress={() => {
                  addMessage();
                }}>
                <View
                  style={{
                    backgroundColor: '#509db5',
                    width: 50,
                    height: 30,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ color: 'white' }}>发送</Text>
                </View>
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                setFunctionMenuVisible(!isFunctionMenuVisible);
                Keyboard.dismiss();
                setTimeout(() => {
                  toBottom();
                }, 400);
              }}>
              <Ionicons name="add-circle-outline" size={height * 0.05} color="#999999" />
            </Pressable>
          </View>
        </View>
        <Animated.View style={[styles.functionMenu, animatedStyle]}>
          {buttonList.map((item, index) => {
            return (
              <Pressable
                key={item.iconName}
                style={{ marginTop: 15 }}
                onPress={() => {
                  clickMatter(item.label);
                }}>
                <FunctionButton key={item.iconName} iconName={item.iconName} label={item.label} />
              </Pressable>
            );
          })}
        </Animated.View>
      </Provider>
    </NativeBaseProvider>
  );
};

export default ChatDetail;

const styles = StyleSheet.create({
  inputView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopColor: '#f2f2f2',
    borderTopWidth: 1,
  },
  inputInner: {
    flex: 1,
    marginLeft: 10,
    color: 'gray',
    fontSize: 18,
  },
  inputControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderColor: '#f2f2f2',
  },
  functionMenu: {
    backgroundColor: '#f7f7f7',
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
});
