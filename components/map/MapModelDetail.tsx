import React from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { houseMessage } from '@/utils/utils';
interface CustomAlertProps {
  visible: boolean;
  message: houseMessage[];
  onClose: () => void;
}
interface houseDetail {
  imgs: string[];
  _id: string;
  price: number;
  time: string;
  address: string;
  name: string;
}
const MapModelDetail: React.FC<CustomAlertProps> = ({ visible, message, onClose }) => {
  const { width, height } = useWindowDimensions();
  const Item1 = ({ imgs, _id, price, time, address, name }: houseDetail) => (
    <View style={[styles.oneComment, { minHeight: height * 0.2 }]}>
      <View style={{}}>
        <Image
          style={{ width: width * 0.85, height: height * 0.15, borderRadius: 20 }}
          source={{ uri: imgs[0] }}
          resizeMode="cover"
        />
      </View>
      <View style={{ paddingLeft: 10 }}>
        <Text>{name}</Text>
      </View>
    </View>
  );
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={styles.centeredView1}>
        <View style={[styles.modalView1, { height: height * 0.6 }]}>
          <View style={styles.header}></View>
          <FlatList
            keyboardDismissMode="on-drag"
            data={message}
            renderItem={({ item }) => (
              <Item1
                name={item.houseName}
                imgs={item.houseImg}
                _id={item._id}
                address={item.houseAddress}
                price={item.housePrice}
                time={item.houseCreateTime}
              />
            )}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

export default MapModelDetail;

const styles = StyleSheet.create({
  centeredView1: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 22,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalView1: {
    margin: 20,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    // shadowColor: '#000',
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 100,
    alignItems: 'center',
    borderBottomWidth: 5,
    borderBottomColor: '#e1e1e1',
  },
  headerText: {
    fontSize: 20,
  },
  oneComment: {
    marginTop: 5,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
});
