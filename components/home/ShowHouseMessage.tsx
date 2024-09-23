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

interface House {
  _id: string;
  houseName: string;
  houseAddress: string;
  housePrice: number;
  houseCreateTime: Date;
  houseImg: { uri: string }[];
  // 可以添加其他属性
}

const ShowHouseMessage = () => {
  const [arr, setArr] = useState<House[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const windowDimensions = useWindowDimensions(); // 使用 useWindowDimensions

  useEffect(() => {
    // 初始化数据
    getHouse();
  }, []);

  // 定义一个函数来格式化日期
  const formatDateTime = (date: Date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  };

  // 异步获取房源数据
  const getHouse = async (currentPage = page) => {
    setLoading(true); // 开始加载时设置 loading 状态
    try {
      let res = await getHome({}); // 调用 API 获取数据
      // 假设 getHome 返回一个包含分页信息的对象，此处模拟分页效果
      const newData = res.data.slice((currentPage - 1) * 2, currentPage * 2);
      if (newData.length < 2) {
        setHasMore(false); // 如果新数据长度小于 2，则没有更多数据
      }
      setArr([...arr, ...newData]); // 更新数据数组
      // 模拟数据加载延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error fetching houses:', error); // 错误处理
    } finally {
      setLoading(false); // 加载完成后关闭 loading 状态
    }
  };

  // 加载更多数据
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      // 如果没有加载中且还有更多数据
      setPage(page + 1); // 增加页码
      getHouse(page + 1); // 加载下一页数据
    }
  };

  const renderItem = ({ item }: { item: House }) => (
    <Pressable onPress={() => router.push('/home/HouseDetail')}>
      <View>
        <View
          style={[
            styles.container,
            {
              height: windowDimensions.height * 0.3,
              width: windowDimensions.width,
            },
          ]}>
          <Swiper style={[styles.wrapper]} autoplay={true}>
            <Image
              style={[
                styles.sliderImage,
                {
                  width: windowDimensions.width,
                  height: windowDimensions.height * 0.28,
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
                  width: windowDimensions.width,
                  height: windowDimensions.height * 0.28,
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
                  width: windowDimensions.width,
                  height: windowDimensions.height * 0.28,
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
              marginTop: -(windowDimensions.height * 0.01),
              marginRight: windowDimensions.width * 0.1,
              marginLeft: windowDimensions.width * 0.05,
              fontSize: 18,
            },
          ]}>
          {item.houseName}
        </Text>
        <Text
          style={[
            styles.textStyle,
            {
              marginTop: windowDimensions.height * 0.02,
              marginRight: windowDimensions.width * 0.1,
              fontSize: 14,
              marginLeft: windowDimensions.width * 0.05,
            },
          ]}>
          {item.houseAddress}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[
              styles.textStyle,
              {
                marginTop: windowDimensions.height * 0.02,
                marginRight: windowDimensions.width * 0.1,
                marginLeft: windowDimensions.width * 0.05,
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
                marginTop: windowDimensions.height * 0.023,
                fontSize: 14,
                color: 'gray',
                marginLeft: windowDimensions.width * 0.26,
                marginBottom: windowDimensions.height * 0.026,
              },
            ]}>
            {formatDateTime(item.houseCreateTime)}
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
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatListContentContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (
            <View style={styles.footerContainer}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#0000ff" />
                  <Text style={styles.loadingText}>玩命加载中...</Text>
                </View>
              ) : hasMore ? null : (
                <View style={{ height: windowDimensions.height * 0.1, alignItems: 'center' }}>
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

export default ShowHouseMessage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
    borderRadius: 10, // 降低 borderRadius 或将其移除
    width: '100%',
    height: '100%',
  },
  textStyle: {
    // 文本样式
  },
  wrapper: {
    // height: 200,
  },
  sliderImage: {
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
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
});
