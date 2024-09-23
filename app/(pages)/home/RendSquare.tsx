import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RentHouse from '@/components/home/RentHouse';
import { getTenant } from '@/api';

const RendSquare = () => {
  const { width, height } = useWindowDimensions();
  const [tenant, setTenant] = useState([]);

  const getTenan = async () => {
    let res = await getTenant({});
    setTenant(res.data);
  };

  let search = async () => {
    console.log('搜索');
  };
  function LogoTitle() {
    return <Text style={{ fontSize: 20 }}>求租广场</Text>;
  }
  useEffect(() => {
    getTenan();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Stack.Screen
          options={{
            headerStyle: { backgroundColor: '#faf4f2' },
            headerTitle: (props) => <LogoTitle />,
          }}
        />
        <ScrollView>
          <TextInput
            style={[
              {
                width: width * 0.9,
                height: height * 0.048,
                borderColor: 'white',
                borderWidth: 0.8,
                borderRadius: 20,
                padding: 10,
                backgroundColor: '#f9f7f7',
                marginLeft: width * 0.06,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              },
              styles.input,
            ]}
            placeholder="请输入地区"
          />
          <TouchableOpacity
            onPress={search}
            style={[styles.searchButton, { marginLeft: width * 0.06, width: width * 0.9 }]}>
            <Text style={styles.searchButtonText}>搜索</Text>
          </TouchableOpacity>
          {tenant.map((item: any) => (
            <TouchableOpacity
              key={item._id}
              style={{ marginTop: -(height * 0.03) }}
              onPress={() =>
                router.push({
                  pathname: '/(pages)/home/RendDetail',
                  params: { tenant: item._id },
                })
              }>
              <RentHouse item={item} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Pressable
          style={[
            styles.addRendButtonFixed,
            { marginTop: -(width * 0.13), marginLeft: width * 0.36 },
          ]}
          onPress={() => router.navigate('/(pages)/home/AddRend')}>
          <Text style={styles.addRendButtonText}>+发布求租</Text>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default RendSquare;

const styles = StyleSheet.create({
  input: {},
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
  addRendButtonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  addRendButtonFixed: {
    backgroundColor: '#509DB5',
    fontSize: 20,
    color: 'white',
    width: '30%',
    padding: 10,
    textAlign: 'center',
    borderRadius: 10,
  },
});
