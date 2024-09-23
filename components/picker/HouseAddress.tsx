import type { PickerValue, PickerValueExtend } from '@ant-design/react-native';
import { Button, List, Picker, Provider } from '@ant-design/react-native';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Dimensions, useWindowDimensions } from 'react-native';
import data from '@bang88/china-city-data';
const data = require('@bang88/china-city-data'); // 确保正确安装并导入

function BasicDemo() {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState<PickerValue[]>([]);
  const [extend, setExtend] = useState<PickerValueExtend>();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingLeft: 16,
      }}>
      <Button
        style={{
          marginRight: 10,
          borderRadius: 100,
        }}
        onPress={() => {
          setVisible(true);
        }}>
        选择
      </Button>

      {/* extend渲染所选值 */}
      <Text>{extend?.items?.map((item: any) => item.label).join(',') || ' 未选择'}</Text>

      {/* visible控制显示/隐藏 */}
      <Picker
        data={data}
        cols={3}
        onChange={(values: PickerValue[]) => setValue(values)}
        onClose={() => {
          setVisible(false);
        }}
        visible={visible}
        value={value}
        onOk={(values: PickerValue[], ext: PickerValueExtend) => {
          setValue(values);
          setExtend(ext);
        }}
      />
    </View>
  );
}

const PopupExample = () => {
  const [value, setValue] = useState<PickerValue[]>([]);

  const onChange = (values: PickerValue[]) => {
    setValue(values);
  };

  return (
    <Provider>
      <View>
        <BasicDemo />
      </View>
    </Provider>
  );
};

export default PopupExample;
