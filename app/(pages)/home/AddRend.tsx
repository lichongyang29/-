import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TextInput,
  Switch,
  Pressable,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { setStorageItemAsync, useStorageState } from '@/hooks/useStorageState';
import DropDownPicker from 'react-native-dropdown-picker';
import { addtenant } from '@/api';

function LogoTitle() {
  return <Text style={{ fontSize: 20 }}>发布求租</Text>;
}

const AddRend = () => {
  const [[status, userInfo], setUserInfo] = useStorageState('userInfo');
  let useobj = JSON.parse((userInfo as string) || '{}'); // 使用空对象作为默认值
  console.log(useobj, '2222');
  const { width, height } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('不限');
  const [isCallable, setIsCallable] = useState(true);
  const [inputheight, setinputheight] = useState(0); // 用于管理文本输入框的高度
  const [items, setItems] = useState([
    { label: '单租', value: '单租' },
    { label: '合租', value: '合租' },
    { label: '不限', value: '不限' },
  ]);

  const [formData, setFormData] = useState({
    tenantTime: '',
    tenantUser: useobj?._id,
    teaddress: '',
    tenantDemand: '',
    tenantPrice: '',
    tenantType: '',
  });

  useEffect(() => {
    console.log('Props changed');
  }, [value]);

  const validateForm = () => {
    if (!formData.teaddress.trim()) {
      Alert.alert('提示', '请输入期望租房位置');
      return false;
    }
    if (!formData.tenantPrice.trim()) {
      Alert.alert('提示', '请输入预算租金');
      return false;
    }
    if (!formData.tenantType.trim()) {
      Alert.alert('提示', '请选择租房类型');
      return false;
    }
    if (!formData.tenantDemand.trim()) {
      Alert.alert('提示', '请输入需求详情');
      return false;
    }
    return true;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;
    setFormData({
      ...formData,
      tenantTime: new Date().toLocaleString(),
      tenantUser: useobj._id,
    });
    try {
      await addtenant(formData);
      Alert.alert('提示', '添加成功');
    } catch (error) {
      console.error('Failed to add tenant:', error);
      Alert.alert('提示', '添加失败，请稍后再试');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: '#faf4f2' },
          headerTitle: (props) => <LogoTitle />,
        }}
      />
      <Text style={[styles.label, { fontSize: width * 0.03, fontWeight: 'bold' }]}>
        当前租客姓名
      </Text>
      <View
        style={[
          styles.input,
          {
            width: width * 0.96,
            height: height * 0.04,
            justifyContent: 'center',
          },
        ]}>
        <Text>{useobj?.name}</Text>
      </View>
      <Text style={[styles.label, { fontSize: width * 0.03, fontWeight: 'bold' }]}>
        期望租房位置
      </Text>
      <TextInput
        style={[styles.input, { width: width * 0.96, height: height * 0.04 }]}
        placeholder="请输入期望租房位置"
        onChangeText={(text) => {
          setFormData({ ...formData, teaddress: text });
        }}
      />
      <Text style={[styles.label, { fontSize: width * 0.03, fontWeight: 'bold' }]}>租房类型</Text>
      <DropDownPicker
        open={open}
        value={value} // 这里设置默认值
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        style={[styles.dropdownPicker, { width: width * 0.95 }]}
        dropdownStyle={styles.dropdownStyle}
        itemStyle={styles.itemStyle}
        listStyle={styles.listStyle}
        onChangeValue={(val) => {
          setValue(val); // 更新状态
          setFormData({ ...formData, tenantType: val as string }); // 更新表单数据
        }}
      />
      <Text style={[styles.label, { fontSize: width * 0.03, fontWeight: 'bold' }]}>租金</Text>
      <TextInput
        style={[styles.input, { width: width * 0.96, height: height * 0.04 }]}
        placeholder="请输入预算租金"
        onChangeText={(text) => setFormData({ ...formData, tenantPrice: text })}
      />
      <Text style={[styles.label, { fontSize: width * 0.03, fontWeight: 'bold' }]}>需求详情</Text>
      <TextInput
        style={[styles.textArea, { width: width * 0.96 }]} // 移除固定的height属性
        placeholder="请输入需求详情"
        multiline={true}
        numberOfLines={5}
        onChangeText={(text) => setFormData({ ...formData, tenantDemand: text })}
        onContentSizeChange={(event) => {
          const { contentSize } = event.nativeEvent;
          setinputheight(contentSize.height); // 动态调整高度
        }}
      />
      <Text style={[styles.label, { fontSize: width * 0.03, fontWeight: 'bold' }]}>联系方式</Text>
      <View
        style={[
          styles.input,
          {
            width: width * 0.96,
            height: height * 0.04,
            justifyContent: 'center',
          },
        ]}>
        <Text>{useobj?.phone}</Text>
      </View>
      <View style={styles.callableRow}>
        <Text style={styles.callableText}>可拨打电话</Text>
        <Switch
          onValueChange={(value) => {
            setIsCallable(value);
          }}
          value={isCallable}
        />
      </View>
      <Pressable
        onPress={handleFormSubmit}
        style={[
          styles.submitButton,
          { width: width * 0.8, height: height * 0.05, marginLeft: width * 0.08 },
        ]}>
        <Text
          style={[
            styles.submitButtonText,
            { fontSize: width * 0.04, color: '#fff', textAlign: 'center' },
          ]}>
          提交
        </Text>
      </Pressable>
    </View>
  );
};

export default AddRend;

const styles = StyleSheet.create({
  // 保持原有的样式定义
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#fff',
  },
  label: {
    marginVertical: 10,
  },
  input: {
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: -5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textArea: {
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: -5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  radioGroupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  radioButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownPicker: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dropdownStyle: {
    backgroundColor: '#f5f5f5',
  },
  itemStyle: {
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  listStyle: {
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#509DB5',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    fontSize: 16, // 使用固定字体大小
  },
  callableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  callableText: {
    fontWeight: 'bold',
  },
});
