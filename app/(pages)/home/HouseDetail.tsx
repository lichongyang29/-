import React, { useState, useEffect } from 'react';
import {
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { getHome } from '@/api';
import ShowHouseMessage from '@/components/home/ShowHouseMessage';
import ShowHouse from '@/components/home/ShowHouse';
import FavoriteButton from '@/components/home/FavoriteButton';
import AntDesign from '@expo/vector-icons/AntDesign';
// 定义一个接口来描述数组中的每个元素
interface Item {
  type:
    | 'house'
    | 'message'
    | 'image'
    | 'image1'
    | 'houseFacilities'
    | 'houseInfo'
    | 'houseDesc'
    | 'userMessage'
    | 'notice';
  data?: House | string;
  imgSrc?: any;
  imgSrc1?: any;
  info?: { area: string; layout: string; checkInTime: string; floor: string };
}

interface House {
  houseName: string;
  houseAddress: string;
  housePrice: number;
  houseCreateTime: string;
  houseImg: any[];
}

function LogoTitle() {
  return <Text style={{ fontSize: 20 }}>房源详情</Text>;
}

// 定义HouseInfo组件
const HouseInfo = ({
  item,
}: {
  item: { area: string; layout: string; checkInTime: string; floor: string };
}) => {
  return (
    <View style={styles.houseInfo}>
      <View style={styles.pair}>
        <Text style={styles.label}>面积:</Text>
        <Text>{item.area}</Text>
      </View>
      <View style={styles.pair}>
        <Text style={styles.label}>户型:</Text>
        <Text>{item.layout}</Text>
      </View>
      <View style={styles.pair}>
        <Text style={styles.label}>入住时间:</Text>
        <Text>{item.checkInTime}</Text>
      </View>
      <View style={styles.pair}>
        <Text style={styles.label}>楼层:</Text>
        <Text>{item.floor}</Text>
      </View>
    </View>
  );
};
const renderItem = ({
  item,
  index,
  windowDims,
}: {
  item: Item;
  index: number;
  windowDims: { width: number; height: number };
}) => {
  switch (item.type) {
    case 'house':
      return (
        <View
          style={[
            styles.container,
            {
              width: windowDims.width,
              marginLeft: -(windowDims.width * 0.026),
              marginTop: -(windowDims.height * 0.11),
            },
          ]}>
          <ShowHouse data={item.data as House} />
        </View>
      );

    case 'houseFacilities':
      return (
        <View style={styles.facilitiesContainer}>
          <Text style={styles.facilitiesTitle}>设施</Text>
          <View style={styles.facilitiesList}>
            <Text style={styles.facilityItem}>Wifi</Text>
            <Text style={styles.facilityItem}>冰箱</Text>
            <Text style={styles.facilityItem}>停车场</Text>
            <Text style={styles.facilityItem}>电视</Text>
            <Text style={styles.facilityItem}>密码锁</Text>
            <Text style={styles.facilityItem}>衣柜</Text>
            <Text style={styles.facilityItem}>热水器</Text>
          </View>
        </View>
      );

    case 'image1':
      return (
        <TouchableOpacity
          onPress={() => {
            router.push('/(pages)/(tabs)/explore'); // 跳转路径
          }}>
          <View>
            <Text style={{ ...styles.facilitiesTitle, marginTop: 20 }}>位置周边</Text>
          </View>
          <Image
            source={item.imgSrc1}
            style={[
              styles.secondImage,
              {
                width: windowDims.width * 1,
                height: windowDims.height * 0.3,
                marginLeft: -(windowDims.width * 0.02),
              },
            ]}
            resizeMode="contain" // 使用 contain 以适应宽度
          />
        </TouchableOpacity>
      );

    case 'houseDesc':
      return (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>房源描述</Text>
          <Text style={styles.descriptionText}>位置：杭州萧山区地铁2号线振宁路奥体华悦城</Text>
          <Text style={styles.descriptionText}>
            交通:距离地铁2号线振宁路800米,走近道步行6 分钟;距离钱江世纪城站地铁3站;距离盈丰路地
            铁站左右世界望京博地中心地铁2站;距离建设三 路1站可换乘7号线距离山姆奥体印象城2公里左右
          </Text>
          <Text style={styles.descriptionText}>
            周边环境:楼下有德克士星巴克24小时便利店小餐 馆等对面有宠物店水果店理发店等
          </Text>
          <Text style={styles.descriptionText}>
            房租是押一付二,图片为真实拍摄,视频是当时中 介发我的,视频是楼下的,精装修的布局都是一样的
          </Text>
        </View>
      );
    case 'userMessage':
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
            padding: 10,
            backgroundColor: '#F5F5F5',
          }}>
          <View>
            <Image
              source={require('@/assets/login/default.png')}
              style={{
                width: windowDims.width * 0.12,
                height: windowDims.width * 0.12,
                borderRadius: 50,
              }}
            />
          </View>
          <View>
            <Text
              style={{
                color: '#333333',
                fontSize: windowDims.width * 0.026,
                paddingLeft: windowDims.width * 0.03,
              }}>
              魔法少女
            </Text>
            <Text
              style={{
                color: '#999999',
                fontSize: windowDims.width * 0.023,
                paddingLeft: windowDims.width * 0.03,
              }}>
              3个月之前来过
            </Text>
          </View>
          <View>
            <Image
              source={require('@/assets/home/jb.png')}
              style={{
                width: windowDims.width * 0.12,
                height: windowDims.width * 0.12,
                borderRadius: 50,
                marginLeft: windowDims.width * 0.36,
              }}
              resizeMode="contain"
            />
          </View>
        </View>
      );
    case 'notice':
      return (
        <View style={styles.noticeBar}>
          <Text style={styles.noticeBarText}>
            <AntDesign name="exclamationcircle" size={20} color="#ffc71c" />
          </Text>
          <Text style={styles.noticeBarText}>理想寓提醒：谨防网络诈骗，线下看房注意安全</Text>
        </View>
      );
    case 'message':
      return (
        <View
          style={[
            styles.container,
            { width: windowDims.width, marginLeft: -(windowDims.width * 0.026) },
          ]}>
          <ShowHouseMessage data={item.data as House} />
        </View>
      );

    case 'houseInfo':
      return (
        <HouseInfo
          item={{
            area: item.info?.area || '',
            layout: item.info?.layout || '',
            checkInTime: item.info?.checkInTime || '',
            floor: item.info?.floor || '',
          }}
        />
      );

    default:
      return null;
  }
};

const HouseDetail = () => {
  const { width, height } = useWindowDimensions();
  const [arr, setArr] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false); // 新增一个状态用于控制加载状态
  const [isFirstLoad, setIsFirstLoad] = useState(true); // 标记是否是首次加载

  const getHouse = async () => {
    setLoading(true);
    try {
      const res = await getHome([]);
      const houses = res.data as House[];
      const items: Item[] = [
        { type: 'house', data: houses[0] }, // 使用第一个房源的数据
        {
          type: 'houseInfo',
          info: { area: '45m²', layout: '两室一厅', checkInTime: '2024-09-15', floor: '第3层' },
        },
        { type: 'houseFacilities', data: undefined },
        { type: 'image1', imgSrc1: require('@/assets/home/houseMap.png') },
        { type: 'houseDesc' }, // 添加房源描述项
        { type: 'userMessage' }, // 添加用户描述项
        { type: 'notice' }, // 添加用户描述项
        { type: 'message', data: houses[0] }, // 使用第一个房源的数据
      ];
      if (isFirstLoad) {
        setArr(items);
        setIsFirstLoad(false);
      } else {
        // 这里可以添加逻辑来处理分页加载
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch home data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getHouse();
  }, []);

  const handleLoadMore = () => {
    if (!loading) {
      if (!isFirstLoad) return;
      getHouse();
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            headerStyle: { backgroundColor: '#faf4f2' },
            headerTitle: (props) => <LogoTitle />,
          }}
        />
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
          <FlatList
            data={arr}
            renderItem={({ item, index }) =>
              renderItem({ item, index, windowDims: { width, height } })
            }
            keyExtractor={(item, index) => `${item.type}-${index}`} // 使用类型和索引作为唯一键
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading ? (
                <View
                  style={{ height: height * 0.1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text>加载中...</Text>
                </View>
              ) : (
                <View style={{ height: height * 0.05 }} />
              )
            }
            contentContainerStyle={{
              flexGrow: 1,
              paddingVertical: 16,
              paddingHorizontal: 16,
              width: width * 0.99,
            }}
          />
        </View>
        <View
          style={{
            ...styles.addRendButtonFixed,
            backgroundColor: '#fff',
            margin: 0,
            padding: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
            position: 'fixed', // 确保按钮固定在屏幕底部
            left: 0, // 左侧距离
            right: 0, // 右侧距离
            zIndex: 1000, // 确保覆盖其他内容
          }}>
          <FavoriteButton />

          <View
            style={{
              width: width * 0.38,
              height: height * 0.05,
              backgroundColor: '#FFC71C',
              borderRadius: 13,
              justifyContent: 'center', // 垂直居中
              alignItems: 'center', // 水平居中
              marginTop: height * 0.023,
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
              marginTop: height * 0.023,
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
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default HouseDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  firstImage: {
    backgroundColor: '#fff', // 第一张图片的背景颜色
  },
  secondImage: {
    backgroundColor: '#fff', // 第二张图片的背景颜色
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
    left: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  details: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  facilitiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  facilitiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  facilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  facilityItem: {
    fontSize: 14,
    marginHorizontal: 5,
    marginVertical: 2,
    borderRadius: 5,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  houseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  pair: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  descriptionContainer: {
    padding: 10,
    // backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 10,
  },
  descriptionTitle: {
    lineHeight: 36,
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 36,
  },
  noticeBar: {
    height: 40,
    width: '100%',
    backgroundColor: '#fff5d6',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  noticeBarText: {
    lineHeight: 40,
    fontSize: 12,
    color: '#ffc71c',
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
