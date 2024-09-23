import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import React from 'react';
import { Icon, NativeBaseProvider } from 'native-base';
import { G, Path } from 'react-native-svg';

const NoMessage = () => {
  const { width, height } = useWindowDimensions();
  return (
    <NativeBaseProvider>
      <View style={styles.iconBox}>
        <Icon size={width * 0.6} viewBox="0 0 1024 1024">
          <G
            t="1725355249376"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4126"
            width="200"
            height="200">
            <Path
              d="M865 731.6H618.4l-96 97.5v-0.5c-1.7 3.5-5.2 5.9-9.3 5.9-4.1 0-7.7-2.4-9.3-5.9v0.5l-96-97.5H159c-17.2 0-31.1-13.9-31.1-31.1V222.8c0-17.2 13.9-31.1 31.1-31.1h706c17.2 0 31.1 13.9 31.1 31.1v477.6c0.1 17.2-13.9 31.2-31.1 31.2zM340.7 404.5c-31.5 0-57.1 25.6-57.1 57.1s25.6 57.1 57.1 57.1 57.1-25.6 57.1-57.1-25.6-57.1-57.1-57.1z m171.3 0c-31.5 0-57.1 25.6-57.1 57.1s25.6 57.1 57.1 57.1 57.1-25.6 57.1-57.1-25.6-57.1-57.1-57.1z m171.3 0c-31.5 0-57.1 25.6-57.1 57.1s25.6 57.1 57.1 57.1 57.1-25.6 57.1-57.1-25.5-57.1-57.1-57.1z"
              fill="#dbdbdb"
              p-id="4127"></Path>
          </G>
        </Icon>
        <Text
          style={{
            fontSize: 22,
            color: '#dbdbdb',
          }}>
          暂时没有聊天信息
        </Text>
      </View>
    </NativeBaseProvider>
  );
};

export default NoMessage;

const styles = StyleSheet.create({
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
