import rentChatSlice from './module/rentChat';
const { configureStore } = require('@reduxjs/toolkit');
const store = configureStore({
  reducer: {
    rentChatSlice: rentChatSlice.reducer,
  },
});

export default store;
