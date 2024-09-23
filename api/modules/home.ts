import { AxiosResponse } from 'axios';
import houseApi from '../request';

export const getHome = (params: {}) => {
  // console.log(321);

  return houseApi.get('/homepage/showhouse', { params });
};
const addtenant = (params = {}) => {
  houseApi.post('/homepage/addtenant', params);
};
const getTenant = (params = {}) => {
  console.log('触发了');
  return houseApi.get('/homepage/showtenant', { params });
};
export { getTenant, addtenant };
