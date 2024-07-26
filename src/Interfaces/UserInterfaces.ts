export interface UserPayload {
  system_role_id: number;
  email: string;
  id: number;
}

export interface UserData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phoneNumber: number;
  systemRoleID: number;
}
