import { IAuthParams, IToken } from '@/types/auth/auth';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { tryPostAuth } from '@/api/auth/auth';

import { setCookie } from '@/utils/cookie';
import { saveToken } from '@/utils/token';

interface IAuthState {
  token: IToken | null;
  fetchingGetConfiguration: boolean;
}

const initialState: IAuthState = {
  token: null,
  fetchingGetConfiguration: false,
};

export const fetchAuth = createAsyncThunk(
  '/auth',
  async (data: IAuthParams, { rejectWithValue }) => {
    const result = await tryPostAuth(data);
    if (result) saveToken(result);

    if (result) {
      return result;
    } else {
      return rejectWithValue(null);
    }
  }
);

export const logout = createAsyncThunk('/logout', async (data: null) => {
  setCookie('token', '');
  localStorage.clear();

  return data;
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuth.pending, (state) => {
        state.fetchingGetConfiguration = true;
      })
      .addCase(fetchAuth.fulfilled, (state, action) => {
        state.fetchingGetConfiguration = false;
        state.token = action.payload;
      })
      .addCase(fetchAuth.rejected, (state) => {
        state.fetchingGetConfiguration = false;
        state.token = null;
      });
    builder.addCase(logout.fulfilled, (state) => {
      state.token = null;

      window.location.assign('/auth');
    });
  },
});

type TSelectorState = { auth: IAuthState };

export const tokenSelector = (state: TSelectorState) => state?.auth.token;
export const fetchingGetConfiguration = (state: TSelectorState) =>
  state?.auth.fetchingGetConfiguration;

export const { setUserToken } = authSlice.actions;

export default authSlice.reducer;
