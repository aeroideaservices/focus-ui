export type TToken = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
};

export type TTokenRefresh = {
  grant_type?: string;
  client_id?: string;
  client_secret?: string;
  refresh_token?: string;
};

export interface IToken {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
  expiresAt: number;
  refreshExpiresAt: number;
}
export interface IAuthParams extends TTokenRefresh {
  username: string;
  password: string;
}
