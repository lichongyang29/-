import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  useWindowDimensions,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RentHouse from '@/components/home/RentHouse';
import FavoriteButton from '@/components/home/FavoriteButton';

const RendDetail = () => {
  const { width, height } = useWindowDimensions();
  const [tenant, setTenant] = useState(null);
  const router = useRouter();

  useEffect(() => {
    console.log(router.params, 1111111);
    const { tenant } = router?.params || {};
    setTenant(tenant);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        {/* <ScrollView>
          {tenant && (
            <View key={tenant._id} style={{ marginTop: -(height * 0.03) }}>
              <RentHouse item={tenant} />
            </View>
          )}
        </ScrollView>
        <View
          style={{
            ...styles.addRendButtonFixed,
            backgroundColor: '#fff',
            margin: 0,
            padding: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
            position: 'fixed', // 确保按钮固定在屏幕底部
            bottom: 60, // 距离底部的距离
            left: 0, // 左侧距离
            right: 0, // 右侧距离
            zIndex: 1000, // 确保覆盖其他内容
          }}>
          <View style={{ marginTop: -(height * 0.015) }}>
            <FavoriteButton />
          </View>
          <View
            style={{
              width: width * 0.38,
              height: height * 0.05,
              backgroundColor: '#FFC71C',
              borderRadius: 13,
              justifyContent: 'center', // 垂直居中
              alignItems: 'center', // 水平居中
            }}>
            <Text
              style={{
                fontSize: width * 0.04,
                color: '#fff',
                textAlign: 'center', // 水平居中
              }}>
              电话咨询
            </Text>
          </View>
          <View
            style={{
              width: width * 0.38,
              height: height * 0.05,
              backgroundColor: '#509DB5',
              borderRadius: 13,
              justifyContent: 'center', // 垂直居中
              alignItems: 'center', // 水平居中
            }}>
            <Text
              style={{
                fontSize: width * 0.04,
                color: '#fff',
                textAlign: 'center', // 水平居中
              }}>
              在线咨询
            </Text>
          </View>
        </View> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default RendDetail;

const styles = StyleSheet.create({
  addRendButton: {
    backgroundColor: '#509DB5',
    fontSize: 20,
    color: 'white',
    width: '30%',
    padding: 10,
    textAlign: 'center',
    borderRadius: 10,
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  addRendButtonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  addRendButtonFixed: {
    backgroundColor: '#fff',
    margin: 0,
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: 60,
    left: 0,
  },
});
