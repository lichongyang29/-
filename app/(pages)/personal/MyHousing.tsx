import { Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';

const MyHousing = () => {
  const { width, height } = useWindowDimensions();
  let concernList = [
    {
      name: '我的房源',
    },
    {
      name: '收藏房源',
    },
    {
      name: '关注帖子',
    },
  ];
  let [chooseName, setChooseName] = useState(concernList[0].name);
  // 切换导航
  let changeNav = (name: string) => {
    setChooseName(name);
  };
  type ItemProps = {
    name: string;
  };
  const Item = ({ name }: ItemProps) => (
    <TouchableWithoutFeedback onPress={() => changeNav(name)}>
      <View
        style={[
          name === chooseName ? styles.item1 : styles.item,
          { width: width * 0.3, marginLeft: width * 0.025 },
        ]}>
        <Text style={name === chooseName ? styles.title1 : styles.title}>{name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
  return (
    <View style={styles.container}>
      <View style={styles.srollNav}>
        <FlatList
          data={concernList}
          horizontal
          keyboardDismissMode="on-drag"
          renderItem={({ item }) => <Item name={item.name} />}
          keyExtractor={(item) => item.name}
        />
      </View>

      <Text>关注内容123</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  },
  webview: {
    flex: 1,
    width: '100%',
  },
  srollNav: {
    height: 40,
    backgroundColor: '#fcfcfc',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
  },
  item: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item1: {
    height: 40,
    paddingHorizontal: 10,
    paddingVertical: 0,
    margin: 0,
    borderBottomWidth: 3,
    borderBottomColor: '#509db5',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    lineHeight: 40,
    color: 'gray',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title1: {
    fontSize: 18,
    lineHeight: 40,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#509db5',
  },
});
export default MyHousing;
