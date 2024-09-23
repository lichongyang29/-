import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import * as ImagePicker from 'expo-image-picker';
import { Toast } from 'native-base';
import { useDispatch } from 'react-redux';
import { alterChatUri } from '@/redux/module/rentChat';

const useAddImage = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onPressAddImage = async () => {
    console.log('add image');
    setLoading(true);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      try {
        const response1 = await fetch(uri);
        const blob = await response1.blob();
        const arrayBuffer = await new Response(blob).arrayBuffer();
        const fileName = `public/${Date.now()}.jpg`;
        await supabase.storage
          .from('rentProImage')
          .upload(fileName, arrayBuffer, {
            contentType: 'image/jpeg',
            upsert: false,
          })
          .then((res) => {
            let path =
              'https://tdxzdcoghbncmanchrxa.supabase.co/storage/v1/object/public/rentProImage/' +
              res.data?.path;
            dispatch(alterChatUri(path));
          });
        setLoading(false);
      } catch (error) {
        Toast.show({ title: '网络错误,请重新上传图片哦~', duration: 1000 });
        setLoading(false);
      }
    }
    setLoading(false);
  };

  return { onPressAddImage, loading };
};

export default useAddImage;
