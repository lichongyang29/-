import { loginObj } from '@/utils/utils';
import houseApi from '../request';

// 用户登录
export const userLogin = async (obj: {}) => {
  return await houseApi.post<loginObj>('/login/userLogin', obj);
};

// 人脸识别
export const faceLogin = async (b64: string) => {
  return await houseApi.post<loginObj>('/login/faceLogin', { b64 });
};

// 录入人脸
export const faceAdd = async (obj: {}) => {
  return await houseApi.post<loginObj>('/login/addFace', obj);
};

// 手机号注册
export const phoneRegister = async (obj: {}) => {
  return await houseApi.post('/login/sms', obj);
};

// 邮箱注册
export const emailRegister = async (obj: {}) => {
  return await houseApi.post('/login/sendMail', obj);
};

// 判断验证码有效性并进行添加用户
export const addUser = async (obj: {}) => {
  return await houseApi.post('/login/addUser', obj);
};

export const forgetPassword = async (obj: {}) => {
  return await houseApi.post('/login/forgetPassword', obj);
};

// 重置密码
export const resetPassword = async (obj: {}) => {
  return await houseApi.put('/login/resetPassword', obj);
};

// 手机号/邮箱登录
export const otherLogin = async (obj: {}) => {
  return await houseApi.post('/login/otherLogin', obj);
};

// 编辑微博授权回调的逻辑
export const authWeiBo = async (code: string) => {
  return await houseApi.get('/login/auth/weibo/callback', { params: { code } });
};
