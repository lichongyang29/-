import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { getHouseList } from '@/api';
import MapModelDetail from '@/components/map/MapModelDetail';
import axios from 'axios';
import { ScrollView } from 'react-native';
import { houseMessage } from '@/utils/utils';

export default function TabTwoScreen() {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [refreshState, setRefreshState] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [house, setHouse] = useState<houseMessage[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<any>([]);
  const [showResults, setShowResults] = useState(false);
  const { width, height } = useWindowDimensions();
  const webviewRef = useRef<any>(null);

  useEffect(() => {
    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
    };
    getLocationPermission();
  }, []);

  const wait = (timeout: number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshState(true);
    console.log('刷新');
    wait(1500).then(() => setRefreshState(false));
  }, []);

  const handleMessage = (event: any) => {
    const data = event.nativeEvent.data;

    try {
      const parsedData = JSON.parse(data);
      if (parsedData.error) {
        console.error('Error getting location:', parsedData.error);
      } else {
        if (parsedData.reload) {
          onRefresh();
          return;
        }
        console.log('success');
        setHouse(parsedData.data);
        setModalVisible(true); // 显示 Modal
      }
    } catch (e) {
      console.error('Error parsing message:', e);
    }
  };

  const sendMessage = async () => {
    console.log('执行完毕');
    let res = await getHouseList({});
    setHouse(res.data);
    webviewRef.current.postMessage(
      JSON.stringify({
        list: res.data,
      })
    );
  };

  const searchLocation = async () => {
    try {
      const response = await axios.get(`https://restapi.amap.com/v3/assistant/inputtips`, {
        params: {
          keywords: searchValue,
          key: '880a3a07f80d9e38fd41b5f96d0e3e30',
        },
      });
      setSearchResults(response.data.tips);
      setShowResults(true);
    } catch (error) {
      console.error('搜索失败', error);
    }
  };
  let submitLocation = (result: any) => {
    console.log(result);
    if (result.location.length > 0 && result.location != undefined) {
      let name = result.name;
      let location = result.location;
      let longitude = location.split(',')[0];
      let latitude = location.split(',')[1];
      console.log(name, longitude, latitude);

      webviewRef.current.postMessage(
        JSON.stringify({
          type: 'findLocation',
          name,
          longitude,
          latitude,
          list: house,
        })
      );
    }
  };
  return (
    <View style={[styles.container, { minHeight: height }]}>
      <MapModelDetail
        visible={modalVisible}
        message={house}
        onClose={() => setModalVisible(false)}
      />
      <Modal visible={showResults} onRequestClose={() => setShowResults(false)} transparent={true}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowResults(false)}>
          <View style={styles.modalContainer}>
            <ScrollView style={styles.resultContainer}>
              {searchResults.map((result: any, index: number) => (
                <Pressable
                  key={index}
                  style={styles.resultItem}
                  onPress={() => {
                    submitLocation(result);
                    setShowResults(false);
                  }}>
                  <Text style={styles.resultText}>{result.name}</Text>
                  <Text style={styles.resultAddress}>{result.address}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {refreshState ? (
        <ActivityIndicator size={54} color="#0000ff" />
      ) : (
        <View style={[styles.container, { minHeight: height }]}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="输入搜索内容"
              value={searchValue}
              onChangeText={setSearchValue}
              onSubmitEditing={searchLocation} // 按下回车时触发搜索
            />
            <TouchableOpacity style={styles.searchButton} onPress={searchLocation}>
              <Text style={styles.searchButtonText}>搜索</Text>
            </TouchableOpacity>
          </View>
          <WebView
            ref={webviewRef}
            source={{ uri: 'https://wanguji.github.io/getLocation/mapShow.html' }}
            useWebKit={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            geolocationEnabled={true}
            onMessage={handleMessage}
            style={styles.webview}
            onLoadEnd={sendMessage}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  webview: {
    flex: 1,
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 30,
    zIndex: 100,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  searchButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  resultContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    height: 200,
    width: '100%',
  },
  resultItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 10,
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultAddress: {
    fontSize: 14,
    color: 'gray',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 70,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    height: 200,
  },
});
