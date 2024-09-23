import React, { useState, useEffect } from 'react';
import {
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  FlatList,
  ActivityIndicator,
  View,
} from 'react-native';
import { router } from 'expo-router';
import Swiper from 'react-native-swiper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getHome } from '@/api';
import dayjs from 'dayjs'; // 导入day.js

const ShowHouseMessages = () => {
  const { width, height } = useWindowDimensions();
  const [arr, setArr] = useState<House[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 定义一个接口来描述数组中的每个元素
  interface House {
    _id: string;
    houseName: string;
    houseAddress: string;
    housePrice: number;
    houseCreateTime: Date;
    houseImg: { uri: string }[];
    // 可以添加其他属性
  }

  // 定义一个函数来格式化日期
  const formatDateTime = (date: Date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  };

  const getHouse = async (currentPage = page) => {
    setLoading(true);
    try {
      let res = await getHome({});
      // 假设 getHome 返回一个包含分页信息的对象，此处模拟分页效果
      const newData = res.data.slice((currentPage - 1) * 2, currentPage * 2);
      if (newData.length < 2) {
        setHasMore(false);
      }
      setArr([...arr, ...newData]);
      // 模拟数据加载延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error fetching houses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHouse(); // 初始化加载前两行数据
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(page + 1);
      getHouse(page + 1);
    }
  };

  const renderItem = ({ item }: { item: House }) => (
    <Pressable onPress={() => router.push('/home/HouseDetail')} key={item._id}>
      <View>
        <View
          style={[
            styles.container,
            {
              height: height * 0.3,
              width: width,
            },
          ]}>
          <Swiper style={[styles.wrapper]} autoplay={true}>
            <Image
              style={[
                styles.sliderImage,
                {
                  width: width,
                  height: height * 0.25,
                  borderRadius: 30,
                },
              ]}
              source={require('@/assets/home/houseOne.png')}
              resizeMode="contain"
            />
            <Image
              style={[
                styles.sliderImage,
                {
                  width: width,
                  height: height * 0.25,
                  borderRadius: 30,
                },
              ]}
              source={require('@/assets/home/houseTwo.png')}
              resizeMode="contain"
            />
            <Image
              style={[
                styles.sliderImage,
                {
                  width: width,
                  height: height * 0.25,
                  borderRadius: 30,
                },
              ]}
              source={require('@/assets/home/houseThree.png')}
              resizeMode="contain"
            />
          </Swiper>
        </View>

        <Text
          style={[
            styles.textStyle,
            {
              marginTop: -(height * 0.01),
              marginRight: width * 0.1,
              marginLeft: width * 0.05,
              fontSize: 18,
            },
          ]}>
          {item.houseName}
        </Text>
        <Text
          style={[
            styles.textStyle,
            {
              marginTop: height * 0.02,
              marginRight: width * 0.1,
              fontSize: 14,
              marginLeft: width * 0.05,
            },
          ]}>
          {item.houseAddress}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[
              styles.textStyle,
              {
                marginTop: height * 0.02,
                marginRight: width * 0.1,
                marginLeft: width * 0.05,
                fontSize: 18,
                color: 'red',
              },
            ]}>
            ￥{item.housePrice}/月
          </Text>
          <Text
            style={[
              styles.textStyle,
              {
                marginTop: height * 0.023,
                fontSize: 14,
                color: 'gray',
                marginLeft: width * 0.26,
              },
            ]}>
            {formatDateTime(item.houseCreateTime)} {/* 使用格式化后的日期 */}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <FlatList
          data={arr}
          renderItem={renderItem}
          keyExtractor={(item: House) => item._id}
          contentContainerStyle={styles.flatListContentContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (
            <View style={styles.footerContainer}>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : hasMore ? null : (
                <View style={{ height: height * 0.1, alignItems: 'center' }}>
                  <Text style={styles.centeredText}>加载完成,我是有底线的</Text>
                </View>
              )}
            </View>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ShowHouseMessages;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
    borderRadius: 10, // 降低 borderRadius 或将其移除
    width: '100%',
    height: '100%',
    marginBottom: -30,
  },
  textStyle: {
    // 文本样式
  },
  wrapper: {
    // swiper样式
  },
  sliderImage: {
    // 图片样式
    position: 'absolute', // 添加此属性
    top: 0, // 添加此属性
    left: 0, // 添加此属性
    bottom: 0, // 添加此属性
    right: 0, // 添加此属性
    margin: 0, // 更改此属性以去除 margins
    width: '100%', // 保留此属性
    height: '100%', // 保留此属性
  },
  flatListContentContainer: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  footerContainer: {
    alignItems: 'center', // 居中显示
    paddingVertical: 16,
  },
  centeredText: {
    fontSize: 16,
    color: '#666',
  },
});
