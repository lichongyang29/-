import React, { useEffect, useState } from 'react';
import {
  View,
  Platform,
  StyleSheet,
  Text,
  FlatList,
  Image,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { getFriendList } from '@/api';
import { useStorageState } from '@/hooks/useStorageState';
import { userInfoObj, friendObj, friendUser } from '@/utils/utils';
import FriendItem from '@/components/chat/FriendItem';
import NoMessage from '@/components/chat/NoMessage';
import socket from '@/utils/socket';
const Message = () => {
  const { width, height } = useWindowDimensions();
  const [[state, userInfo], setUser] = useStorageState('userInfo');
  const user: userInfoObj = userInfo ? JSON.parse(userInfo) : null;
  let [firendList, setFirendList] = useState<friendObj[]>([]);
  let getFriends = async () => {
    let res = await getFriendList({ _id: user._id });
    setFirendList(res.data);
  };
  useEffect(() => {
    if (user) {
      getFriends();
    }
  }, [userInfo]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.noticeBar}>
        <Text style={styles.noticeBarText}>
          <AntDesign name="exclamationcircle" size={20} color="#ffc71c" />
        </Text>
        <Text style={styles.noticeBarText}>理想寓提醒：谨防网络诈骗，线下看房注意安全</Text>
      </View>
      <View style={{ flex: 1 }}>
        {firendList.length > 0 ? (
          <FlatList
            style={{ flex: 1 }}
            data={firendList}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <FriendItem
                friendid={item._id}
                useImage={item.usersid.filter((userIn) => userIn._id !== user._id)[0]?.useImage}
                name={item.usersid.filter((userIn) => userIn._id !== user._id)[0]?.name}
                time={item.time}
                receiveid={item.usersid.filter((userIn) => userIn._id !== user._id)[0]?._id}
                content={item.content}
              />
            )}
          />
        ) : (
          // bug 这里需要修改样式
          <NoMessage></NoMessage>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  noticeBar: {
    height: 40,
    width: '100%',
    backgroundColor: '#fff5d6',
    flexDirection: 'row',
    alignItems: 'center',
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

export default Message;
