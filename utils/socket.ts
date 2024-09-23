import { io } from 'socket.io-client';

const socket = io('http://192.168.1.34:4000', {
  extraHeaders: {
    'my-custom-header': 'lxy-socket',
  },
});

export default socket;
