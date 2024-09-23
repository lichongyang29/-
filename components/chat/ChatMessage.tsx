import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React, { useState } from 'react';
import getTime from '@/hooks/getTime';
import { Image } from 'expo-image';

interface messageInfo {
  userid: string;
  receiveid: string;
  useImage: string | undefined;
  content: string;
  type: number;
  time: Date;
  useMeImage: string;
  receiveName: string | undefined;
  meName: string;
  handleImagePress: () => void;
  findImageIndex: (img: string) => void;
}

const ChatMessage: React.FC<messageInfo> = ({
  userid,
  receiveid,
  useImage,
  content,
  type,
  time,
  useMeImage,
  receiveName,
  meName,
  handleImagePress,
  findImageIndex,
}) => {
  const { height } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  return (
    <View style={{ flex: 1 }}>
      {userid !== receiveid ? (
        <View style={styles.rightView}>
          <View style={{ flex: 1 }}>
            <View style={[styles.timeContainer, { paddingLeft: height * 0.06 }]}>
              <Text style={styles.timeStyle}>{getTime(time)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              {type === 0 ? (
                <View style={styles.rightContentContainer}>
                  <Text style={[styles.contentText, { color: 'white' }]}>{content}</Text>
                </View>
              ) : type === 1 ? (
                <Pressable
                  onPress={() => {
                    handleImagePress();
                    findImageIndex(content);
                  }}>
                  {loading && (
                    <View
                      style={{
                        height: height * 0.1,
                        minWidth: height * 0.1,
                        borderRadius: 10,
                        marginRight: 10,
                        justifyContent: 'center',
                      }}>
                      <ActivityIndicator size={40} color="#509db5" />
                    </View>
                  )}
                  <Image
                    source={{ uri: content }}
                    style={{
                      height: height * 0.15,
                      width: height * 0.1,
                      borderRadius: 10,
                      marginRight: 10,
                    }}
                    contentFit="contain"
                    blurRadius={1}
                    transition={1000}
                    onLoad={() => setLoading(false)}
                    onLoadEnd={() => setLoading(false)}
                  />
                </Pressable>
              ) : null}
            </View>
          </View>

          <Image
            source={{ uri: useMeImage }}
            style={[
              styles.userImage,
              { width: height * 0.06, height: height * 0.06, borderRadius: height * 0.03 },
            ]}
          />
        </View>
      ) : (
        <View style={styles.leftView}>
          <Image
            source={{ uri: useImage }}
            style={[
              styles.userImage,
              { width: height * 0.06, height: height * 0.06, borderRadius: height * 0.03 },
            ]}
          />
          <View style={{ flex: 1 }}>
            <View style={[styles.timeContainer, { paddingRight: height * 0.06 }]}>
              <Text style={styles.timeStyle}>{getTime(time)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
              {type === 0 ? (
                <View style={styles.leftContentContainer}>
                  <Text style={[styles.contentText, { color: 'black' }]}>{content}</Text>
                </View>
              ) : type === 1 ? (
                <Pressable
                  onPress={() => {
                    handleImagePress();
                    findImageIndex(content);
                  }}>
                  <Image
                    source={{ uri: content }}
                    style={{
                      height: height * 0.2,
                      minWidth: height * 0.1,
                      borderRadius: 10,
                      marginLeft: 10,
                    }}
                    contentFit="cover"
                    blurRadius={1}
                    transition={1000}
                  />
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rightView: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  leftView: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  timeStyle: {
    fontSize: 12,
    color: 'gray',
  },
  rightContentContainer: {
    backgroundColor: '#509db5',
    padding: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    maxWidth: '80%',
    marginRight: 10,
  },
  leftContentContainer: {
    backgroundColor: '#f6f6f6',
    borderTopRightRadius: 15,
    padding: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    maxWidth: '80%',
    marginLeft: 10,
  },
  contentText: {
    fontSize: 16,
  },
  userImage: {
    minWidth: 40,
    minHeight: 40,
  },
});

export default ChatMessage;
