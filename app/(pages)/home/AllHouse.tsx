import React, { useState, useEffect } from 'react';
import _ from 'lodash'; // 导入lodash
import {
  Text,
  Image,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Stack } from 'expo-router';
import Swiper from 'react-native-swiper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getHome } from '@/api';
import { router } from 'expo-router';
import dayjs from 'dayjs'; // 导入day.js

function LogoTitle() {
  return <Text style={{ fontSize: 20, textAlign: 'center', color: '#000' }}>全部房源</Text>;
}

const AllHouse = () => {
  const [value, onChangeText] = useState('');
  const { width, height } = useWindowDimensions();
  const [arr, setArr] = useState<House[]>([]);
  const headList = ['单租', '合租', '整租', '长期租', '短期租'];
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(headList[0]); // 用于记录选中的分类

  interface House {
    houseName: string;
    houseAddress: string;
    housePrice: number;
    houseCreateTime: Date;
    houseImg: { uri: string }[];
  }

  // 定义一个函数来格式化日期
  const formatDateTime = (date: Date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  };

  let search = async () => {
    console.log('搜索');
    let res = await getHome({ houseName: value });
    setArr(res.data as House[]);
  };

  let search2 = async (category: string) => {
    console.log('筛选');
    let res = await getHome({ houseType: category });
    setArr(res.data as House[]);
    setSelectedCategory(category); // 设置选中的分类
  };

  const debouncedSearch = _.debounce(search, 500); // 防抖处理，等待500ms没有新的输入则执行

  const handleChangeText = (text: string) => {
    onChangeText(text);
    debouncedSearch(); // 使用防抖后的函数
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
              marginLeft: -(width * 0.038),
              marginTop: height * 0.015,
            },
          ]}>
          <Swiper style={[styles.wrapper]} autoplay={true}>
            <Image
              style={[
                styles.sliderImage,
                {
                  width: width,
                  height: height * 0.28,
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
                  height: height * 0.28,
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
                  height: height * 0.28,
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
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            headerStyle: { backgroundColor: '#faf4f2' },
            headerTitle: (props) => <LogoTitle />,
          }}
        />
        <View style={{ backgroundColor: '#fff', flex: 1, margin: 0, padding: 0 }}>
          <TextInput
            style={{
              height: 40,
              borderColor: 'white',
              borderWidth: 0.8,
              borderRadius: 20,
              margin: 10,
              padding: 10,
              backgroundColor: '#f5f5f5',
            }}
            placeholder="请输入要搜索的房源信息"
            onChangeText={handleChangeText} // 使用新函数
            value={value}
          />
          <View style={styles.headerListContainer}>
            {headList.map((item: string, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  search2(item);
                }}
                style={[
                  styles.headerListItem,
                  selectedCategory === item ? styles.selectedHeaderListItem : null,
                ]}>
                <Text
                  style={[
                    styles.headerListItemText,
                    selectedCategory === item ? styles.selectedHeaderListItemText : null,
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={search} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>搜索</Text>
          </TouchableOpacity>

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
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : hasMore ? null : (
                  <View style={{ height: height * 0.1, alignItems: 'center' }}>
                    <Text style={styles.centeredText}>加载完成,我是有底线的</Text>
                  </View>
                )}
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AllHouse;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  searchButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  searchButtonText: {
    color: '#000',
    textAlign: 'center',
  },
  headerListContainer: {
    flexDirection: 'row', // 使子元素横向排列
    justifyContent: 'space-around', // 子元素之间平均分布
    flexWrap: 'wrap', // 允许换行
    marginTop: 10, // 根据需要调整间距
    marginHorizontal: 2, // 添加左右边距
  },
  headerListItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 5, // 增加元素之间的间距
    paddingHorizontal: 10, // 增加内边距
    paddingVertical: 10, // 增加内边距
    minHeight: 50, // 确保有足够的高度，以便触摸区域更大
  },
  selectedHeaderListItem: {
    backgroundColor: '#44b3f8', // 选中时的背景色
  },
  headerListItemText: {
    fontSize: 14,
    textAlign: 'center',
  },
  selectedHeaderListItemText: {
    color: '#fff', // 选中时的文字颜色
  },
  houseContainer: {
    marginBottom: 20,
  },
  textStyle: {
    // 文本样式
  },
  wrapper: {
    // swiper样式
  },
  sliderImage: {
    // 图片样式
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
