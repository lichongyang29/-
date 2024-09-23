import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

// const { width, height } = useWindowDimensions();

export const icon: { [key: string]: any } = {
  index: (props: any) => <AntDesign name="home" size={24} {...props} />,
  explore: (props: any) => <Ionicons name="compass" size={24} {...props} />,
  message: (props: any) => (
    <MaterialCommunityIcons name="message-processing" size={24} {...props} />
  ),
  personal: (props: any) => <FontAwesome name="user-circle" size={24} {...props} />,
};
