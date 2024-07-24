export interface UserPayload {
  name: string;
  email: string;
  role: number;
}

export interface UserData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phoneNumber: number;
  systemRoleID: number;
}
