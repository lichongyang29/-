import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Platform,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import { useLocalSearchParams } from 'expo-router';

export default function EditProfileScreen() {
  const params = useLocalSearchParams();
  console.log(params)
  const [username, setUsername] = useState('西瓜');
  const [gender, setGender] = useState('女');
  const [email, setEmail] = useState('192038400032@qq.com');
  const [birthday, setBirthday] = useState('');
  const [phone,setPhone] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [isGenderPickerVisible, setGenderPickerVisible] = useState(false);
  const [isImagePickerVisible, setImagePickerVisible] = useState(false);

  // 显示日期选择器
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // 关闭日期选择器
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // 处理日期选择
  const handleConfirm = (date) => {
    setBirthday(date.toLocaleDateString());
    hideDatePicker();
  };

  // 选择头像
  const pickImage = () => {
    launchImageLibrary({}, (response) => {
      if (response.assets && response.assets.length > 0) {
        setAvatar(response.assets[0].uri);
      }
      setImagePickerVisible(false);
    });
  };

  // 处理性别选择确认
  const handleGenderConfirm = (selectedGender) => {
    setGender(selectedGender);
    setGenderPickerVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.avatarBox}>
          <Pressable onPress={() => setImagePickerVisible(true)} >
            <Image
              source={avatar ? { uri: avatar } : require('@/assets/login/default.png')}
              style={styles.avatar}
            />
          </Pressable>
          <Text style={styles.changeAvatarText}>点击更换头像</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>用户名</Text>
          <TextInput value={username} onChangeText={setUsername} style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>性别</Text>
          <TouchableOpacity onPress={() => setGenderPickerVisible(true)}>
            <Text style={styles.input}>{gender}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>生日</Text>
          <TouchableOpacity onPress={showDatePicker}>
            <Text style={styles.input}>{birthday || '完善生日信息'}</Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>邮箱</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>手机号</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
          />
        </View>

        <Button
          title="保存"
          onPress={() => {
            /* 保存逻辑 */
          }}
        />

        {/* 性别选择器的底部弹出层 */}
        <Modal
          isVisible={isGenderPickerVisible}
          onBackdropPress={() => setGenderPickerVisible(false)}
          style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>选择性别</Text>
            <Picker
              selectedValue={gender}
              onValueChange={handleGenderConfirm}
              style={styles.picker}>
              <Picker.Item label="女" value="女" />
              <Picker.Item label="男" value="男" />
            </Picker>
            <Button title="完成" onPress={() => setGenderPickerVisible(false)} />
          </View>
        </Modal>

        {/* 头像选择器的底部弹出层 */}
        <Modal
          isVisible={isImagePickerVisible}
          onBackdropPress={() => setImagePickerVisible(false)}
          style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>选择头像</Text>
            <Button title="从相册选择" onPress={pickImage} />
            <Button title="取消" onPress={() => setImagePickerVisible(false)} />
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  avatarBox: {
    width: 100,
    alignSelf: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  changeAvatarText: {
    textAlign: 'center',
    color: '#007BFF',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    width: 60,
  },
  input: {
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
