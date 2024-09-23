import React, { useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  FlatList,
  View,
  Text,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ShowHouseMessage from '@/components/home/ShowHouseMessage';

const Index = () => {
  const { width, height } = useWindowDimensions();

  const [staticContent, setStaticContent] = useState([
    {
      type: 'topImage',
      source: require('@/assets/home/top.png'),
    },
    {
      type: 'searchButton',
      label: '点击进行搜索',
      navigateTo: '/(pages)/home/SearchResult',
    },
    {
      type: 'imageRow',
      images: [
        {
          src: require('@/assets/home/homeMian.png'),
          label: '新上房源',
          navigateTo: '/(pages)/home/AllHouse',
        },
        {
          src: require('@/assets/home/sale.png'),
          label: '特惠房源',
          navigateTo: '/(pages)/home/AllHouse',
        },
        {
          src: require('@/assets/home/maps.png'),
          label: '求租广场',
          navigateTo: '/(pages)/home/RendSquare',
        },
        {
          src: require('@/assets/home/apartments.png'),
          label: '品牌公寓',
          navigateTo: '/(pages)/home/AllHouse',
        },
      ],
    },
    {
      type: 'centerImages',
      sources: [
        require('@/assets/home/centerLeft.png'),
        require('@/assets/home/centerTopRight.png'),
        require('@/assets/home/centerBottomRight.png'),
      ],
    },
    {
      type: 'text',
      text: '精选好房',
    },
    {
      type: 'ShowHouseMessage',
    },
  ]);

  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'topImage':
        return (
          <Image
            source={item.source}
            style={[
              {
                width: width,
                height: height * 0.23,
                marginTop: -(height * 0.02),
                marginLeft: -(width * 0.04),
              },
            ]}
            resizeMode="contain"
          />
        );
      case 'searchButton':
        return (
          <Pressable onPress={() => router.navigate(item.navigateTo)}>
            <View
              style={[
                {
                  backgroundColor: '#fff',
                  width: width * 0.6,
                  height: height * 0.045,
                  marginTop: -(height * 0.035),
                  borderRadius: 100,
                  marginLeft: width * 0.18,
                  marginBottom: height * 0.03,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                },
              ]}>
              <Text
                style={{
                  fontSize: width * 0.03,
                  marginLeft: width * 0.03,
                  marginTop: height * 0.01,
                }}>
                {item.label}
              </Text>
            </View>
          </Pressable>
        );
      case 'imageRow':
        return (
          <View style={[styles.imageRow, { marginBottom: height * 0.026 }]}>
            {item.images.map((img, index) => (
              <Pressable key={index} onPress={() => router.navigate(img.navigateTo)}>
                <View>
                  <Image
                    source={img.src}
                    style={[
                      {
                        width: width * 0.5,
                        height: height * 0.045,
                      },
                    ]}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      {
                        marginTop: height * 0.01,
                        fontSize: width * 0.03,
                        textAlign: 'center',
                      },
                    ]}>
                    {img.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        );
      case 'centerImages':
        return (
          <View
            style={[styles.centerImagesContainer, { height: height * 0.37, width: width * 0.96 }]}>
            <Image
              source={item.sources[0]}
              resizeMode="contain"
              style={[
                styles.centerLeft,
                {
                  width: width * 0.46,
                  height: height * 0.2,
                },
              ]}
            />
            <Image
              source={item.sources[1]}
              resizeMode="contain"
              style={[
                styles.centerTopRight,
                {
                  width: width * 0.45,
                  height: height * 0.145,
                  marginTop: -(height * 0.026),
                },
              ]}
            />
            <Image
              source={item.sources[2]}
              resizeMode="contain"
              style={[
                styles.centerBottomRight,
                {
                  width: width * 0.45,
                  height: height * 0.41,
                  marginBottom: height * 0.018,
                },
              ]}
            />
          </View>
        );
      case 'text':
        return (
          <View
            style={{
              width: width * 0.95,
              height: height * 0.04,
              marginTop: -(height * 0.14),
            }}>
            <Text style={{ fontSize: width * 0.03 }}>{item.text}</Text>
          </View>
        );
      case 'ShowHouseMessage':
        return (
          <View
            style={{
              marginTop: -(height * 0.1),
              marginLeft: -(width * 0.038),
              width: width,
            }}>
            <ShowHouseMessage />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <FlatList
          data={staticContent}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatListContentContainer}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  flatListContentContainer: {
    flexGrow: 1,
    paddingVertical: 16, // 添加垂直方向上的内边距以增加间距
    paddingHorizontal: 16,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  centerImagesContainer: {
    position: 'relative',
  },
  centerLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  centerTopRight: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  centerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default Index;
