import { setStorageItemAsync, useStorageState } from '@/hooks/useStorageState';
import { userInfoObj } from '@/utils/utils';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Avatar, Center, Heading, Image, NativeBaseProvider, Pressable, Text } from 'native-base';
import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

const Personal = () => {
  const { width, height } = useWindowDimensions();

  // 获取本地存储的用户信息
  const [[status, userInfo], setUserInfo] = useStorageState('userInfo');
  const user: userInfoObj = userInfo ? JSON.parse(userInfo) : null;

  const dayNum = useMemo(() => {
    return user && user.registerTime
      ? Math.ceil((new Date().getTime() - new Date(user.registerTime).getTime()) / 86400000)
      : 0;
  }, [user]);

  // 退出登录
  const logout = async () => {
    await setStorageItemAsync('accessToken', null);
    await setStorageItemAsync('refreshToken', null);
    await setStorageItemAsync('userInfo', null);
    router.replace('/(pages)/login/Login');
  };

  // 打开编辑资料页面
  const openInformation = () => {
    router.push({
      pathname: '/(pages)/personal/ChangeUser',
      params: { ...user },
    });
  };

  return (
    <NativeBaseProvider>
      <View style={styles.personal}>
        <LinearGradient
          colors={['#E9F6F2', '#B3E3E1', '#A0D6F9']}
          style={[styles.gradient, { height: height * 0.25 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View style={[styles.info, { height: height * 0.15 }]}>
            <Pressable
              onPress={() => {
                openInformation();
              }}>
              <Avatar
                bg="indigo.500"
                size={height * 0.085}
                source={
                  user && user.useImage
                    ? { uri: user.useImage }
                    : require('@/assets/login/default.png')
                }></Avatar>
            </Pressable>
            <View style={styles.infoRight}>
              <Heading
                size="md"
                onPress={() => {
                  openInformation();
                }}>
                {user && user.name}
              </Heading>
              <Text
                fontSize="sm"
                onPress={() => {
                  openInformation();
                }}>
                已加入理想寓{dayNum}天
              </Text>
            </View>
          </View>
        </LinearGradient>
        <View style={[styles.content, { top: -height * 0.07 }]}>
          <View style={[styles.nav, styles.conBox, { height: height * 0.12 }]}>
            <Pressable
              style={styles.navBox}
              onPress={() => router.navigate('/(pages)/personal/MyCollect')}>
              <Center>
                <Image
                  source={require('@/assets/login/my1.png')}
                  alt="Alternate Text"
                  size={height * 0.05}
                />
              </Center>
              <Text>我的收藏</Text>
            </Pressable>
            <Pressable
              style={styles.navBox}
              onPress={() => router.navigate('/(pages)/personal/MyHousing')}>
              <Image
                source={require('@/assets/login/my2.png')}
                alt="Alternate Text"
                size={height * 0.05}
              />
              <Text>我的房源</Text>
            </Pressable>
            <Pressable
              style={styles.navBox}
              onPress={() => router.navigate('/(pages)/personal/MyHousing')}>
              <Image
                source={require('@/assets/login/my3.png')}
                alt="Alternate Text"
                size={height * 0.05}
              />
              <Text>我的求租</Text>
            </Pressable>
          </View>
          <View style={[styles.ability, styles.conBox]}>
            <Pressable
              style={styles.abilityBox}
              onPress={() => router.navigate('/(pages)/personal/SetAccount')}>
              <Text style={{ fontSize: height * 0.017 }}>账号设置</Text>
              <AntDesign name="right" size={12} color="#ccc" />
            </Pressable>
            <Pressable
              style={styles.abilityBox}
              onPress={() => router.navigate('/(pages)/personal/CreateFile')}>
              <Text style={{ fontSize: height * 0.017 }}>生成合同</Text>
              <AntDesign name="right" size={12} color="#ccc" />
            </Pressable>
            <Pressable
              style={styles.abilityBox}
              onPress={() =>
                router.navigate({ pathname: '/login/FaceLogin', params: { title: '录入人脸' } })
              }>
              <Text style={{ fontSize: height * 0.017 }}>录入人脸</Text>
              <AntDesign name="right" size={12} color="#ccc" />
            </Pressable>
            <Pressable
              style={styles.abilityBox}
              onPress={() => router.navigate('/(pages)/(tabs)/message')}>
              <Text style={{ fontSize: height * 0.017 }}>关于我们</Text>
              <AntDesign name="right" size={12} color="#ccc" />
            </Pressable>
            <Pressable
              style={styles.abilityBox}
              onPress={() => {
                logout();
              }}>
              <Text style={{ fontSize: height * 0.017 }}>退出登录</Text>
              <AntDesign name="right" size={12} color="#ccc" />
            </Pressable>
          </View>
        </View>
      </View>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  personal: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  gradient: {
    width: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 20,
  },
  info: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  infoRight: {
    marginLeft: 15,
  },
  content: {
    paddingLeft: 20,
    paddingRight: 20,
    position: 'relative',
  },
  conBox: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  nav: {
    flexDirection: 'row',
    height: 90,
  },
  navBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ability: {},
  abilityBox: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Personal;
