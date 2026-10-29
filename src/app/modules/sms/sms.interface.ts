export interface IPostSmsPayload {
  phone: string;
  body: string;
  sender?: string;
  otp?: string;
}

export interface IGetSmsQuery {
  phone: string;
}

