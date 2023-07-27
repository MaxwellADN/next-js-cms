import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import postReducer from './reducers/post.reducer';

const store = configureStore({
  reducer: {
    postReducer: postReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
