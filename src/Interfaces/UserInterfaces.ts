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
  phone_number: number;
  system_role_id: number;
}
