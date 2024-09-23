import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import React from 'react';
import { userInfoObj, friendObj, friendUser } from '@/utils/utils';
import { Image } from 'react-native';
import getTime from '@/hooks/getTime';
import { router } from 'expo-router';
interface friendUserInner {
  name: string;
  useImage: string;
  time: Date;
  receiveid: string;
  friendid: string;
  content: string;
}
const FriendItem: React.FC<friendUserInner> = ({
  receiveid,
  name,
  useImage,
  time,
  friendid,
  content,
}) => {
  const { width, height } = useWindowDimensions();
  return (
    <Pressable
      style={[styles.friendView, { height: height * 0.1, borderRadius: height * 0.05 }]}
      onPress={() => {
        router.push({
          pathname: '/(pages)/chat/ChatDetail',
          params: { friendid: friendid, receiveid: receiveid },
        });
      }}>
      <Image
        style={[
          styles.firendAvatar,
          { width: height * 0.07, height: height * 0.07, borderRadius: height * 0.035 },
        ]}
        source={{ uri: useImage }}
      />
      <View
        style={[styles.friendCon, { height: height * 0.07, width: width - 80 - height * 0.07 }]}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text
            style={[styles.friendName, { maxWidth: width * 0.4 }]}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.friendTime]}>{getTime(time)}</Text>
        </View>
        <Text
          style={[styles.friendContent, { maxWidth: width * 0.5 }]}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {content}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  friendView: {
    borderWidth: 1,
    borderColor: '#eef7f7',
    marginVertical: 10,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    shadowColor: '#c2cbcb',
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  friendCon: {
    marginLeft: 10,
    position: 'relative',
  },
  friendName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  friendContent: {
    position: 'absolute',
    bottom: 5,
    fontSize: 15,
    color: '#94a1b5',
  },
  friendTime: {
    fontSize: 13,
    color: '#94a1b5',
  },
  firendAvatar: {},
});

export default FriendItem;
