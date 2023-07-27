import { combineReducers } from "@reduxjs/toolkit";

import posts from './post.reducer'

export const reducers = combineReducers({ posts });
