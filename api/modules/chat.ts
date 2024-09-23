import houseApi from '../request';
import { obj, friendObj, messageObj, userInfoObj } from '@/utils/utils';

interface getFriend extends obj {
  data: friendObj[];
}
interface getMessage extends obj {
  data: messageObj[];
}

interface getUserInfo extends obj {
  data: userInfoObj;
}
interface addMessageInfo extends obj {
  data: messageObj;
}
export const addMessageApi = async (params: {}) =>
  await houseApi.post<addMessageInfo>('/chat/addMessage', params);

export const getUserInfo = async (params: {}) =>
  await houseApi.get<getUserInfo>('/chat/getUserInfo', { params });

export const getMessage = async (params: {}) =>
  await houseApi.get<getMessage>('/chat/getMessageList', { params });

export const getFriendList = async (params: {}) =>
  await houseApi.get<getFriend>('/chat/getFriendList', { params });
