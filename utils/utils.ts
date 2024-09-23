export interface obj {
  data: any | null;
  message: string;
  code: number;
}

export interface houseMessage {
  houseName: string;
  housePrice: number;
  houseImg: string[];
  houseAddress: string;
  houseType: string;
  houseStatus: boolean;
  fans: string[];
  lnglat: string[];
  weight: number;
  houseCreateTime: string;
  _id: string;
}

export interface messageObj {
  _id: string;
  userid: string;
  receiveid: string;
  friendid: string;
  content: string;
  time: Date;
  isRead: boolean;
  type: number;
}

export interface friendUser {
  _id: string;
  name: string;
  useImage: string;
}

export interface userInfoObj {
  _id: string;
  phone: string;
  password: string;
  message: string;
  name: string;
  registerTime: string;
  useImage: string;
}
export interface friendObj {
  _id: string;
  usersid: friendUser[];
  time: Date;
  content: string;
}

export interface loginObj extends obj {
  data: userInfoObj;
  accessToken: string;
  refreshToken: string;
}

// 手机号验证码类型
export interface phoneCodeObj extends obj {
  data: {
    code: string;
  };
}
