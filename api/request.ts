import axios, { AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import * as secureStore from 'expo-secure-store';
import { router } from 'expo-router';
import socket from '@/utils/socket';

export function createAxios(option = {}) {
  return axios.create({
    ...option,
  });
}

export const houseApi = createAxios({
  baseURL: 'http://192.168.1.27:3000',
  timeout: 5000,
});

/**
 * 重试机制
 */
let retryCount = 0;
const customRetryCondition = async (error: any) => {
  if (axios.isAxiosError(error) && error.response?.status !== 200) {
    // 如果后端返回的是403
    if (error.response?.status === 403) {
      await secureStore.deleteItemAsync('accessToken');
      await secureStore.deleteItemAsync('refreshToken');
      await secureStore.deleteItemAsync('userInfo');
      router.replace('/login/Login');
      return false;
    }

    if (error.response?.status === 401) {
      await refresh();
      console.log('刷新token');
      return true;
    }

    retryCount++;
    console.log(`第${retryCount}次重试`);
    return (
      error.response!.status >= 500 ||
      (error.response!.status < 500 && error.response?.status !== 401)
    );
  }
  return false;
};

axiosRetry(houseApi, {
  retries: 3,
  retryCondition: customRetryCondition,
  retryDelay: axiosRetry.exponentialDelay,
});

/**
 * 请求拦截器
 */
houseApi.interceptors.request.use(
  async function (config) {
    const accessToken = await secureStore.getItemAsync('accessToken');
    const refreshToken = await secureStore.getItemAsync('refreshToken');
    config.headers.accessToken = accessToken ? accessToken : '';
    config.headers.refreshToken = refreshToken ? refreshToken : '';
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
houseApi.interceptors.response.use(
  async function (response) {
    if (response.status) {
      if (response.status === 200) {
        return response.data;
      } else {
        return Promise.reject(response.data.message || '未知错误');
      }
    } else {
      return response;
    }
  },
  function (error) {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '错误请求';
          break;
        case 401:
          error.message = '未授权，请重新登录';
          break;
        case 403:
          error.message = '拒绝访问';
          break;
        case 404:
          error.message = '请求错误，未找到该资源';
          break;
        case 405:
          error.message = '请求方法未允许';
          break;
        case 408:
          error.message = '请求超时';
          break;
        case 500:
          error.message = '服务器端出错';
          break;
        case 501:
          error.message = '网络未实现';
          break;
        case 502:
          error.message = '网络错误';
          break;
        case 503:
          error.message = '服务不可用';
          break;
        case 504:
          error.message = '网络超时';
          break;
        case 505:
          error.message = 'http版本不支持该请求';
          break;
        default:
          error.message = `连接错误${error.response.status}`;
      }
    } else {
      error.message = '连接服务器失败';
    }
    return Promise.reject(error.message);
  }
);

// 重新刷新token
async function refresh() {
  let res = await houseApi.get('/login/refresh');
  const userMessage = await secureStore.getItemAsync('userInfo');
  let userMessageInfo = JSON.parse(userMessage as string);
  socket.emit('register', userMessageInfo?._id);
  await secureStore.setItemAsync('accessToken', res.accessToken);
}

export default houseApi;
