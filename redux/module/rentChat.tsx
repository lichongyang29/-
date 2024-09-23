import { createSlice } from '@reduxjs/toolkit';

const rentChatSlice = createSlice({
  name: 'rentChatSlice',
  initialState: {
    chatUri: '',
    imgIndex: 0,
    videoUri: '',
  },
  reducers: {
    alterChatUri: (state, action) => {
      state.chatUri = action.payload;
    },
    deleteChatUri: (state) => {
      state.chatUri = '';
    },
    alterImgIndex: (state, action) => {
      state.imgIndex = action.payload;
    },
    alterVideoUri: (state, action) => {
      state.videoUri = action.payload;
    },
    deleteVideoUri: (state) => {
      state.videoUri = '';
    },
  },
});

export let { alterChatUri, deleteChatUri, alterImgIndex, alterVideoUri, deleteVideoUri } =
  rentChatSlice.actions;

export default rentChatSlice;
