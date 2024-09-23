import houseApi from '../request';
import { obj, houseMessage } from '@/utils/utils';

interface getHouse extends obj {
  data: houseMessage[];
}

export const getHouseList = async (params: {}) =>
  await houseApi.get<getHouse>('/map/getHouseList', { params });
