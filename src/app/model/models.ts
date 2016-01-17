export interface User {
  id: string;
  name: string;
  email: string;
  password?:string;
}

export interface Users {
  loading: boolean;
  adding: boolean;
  users: User[];
}

export interface Auth {
  token: string;
  error: string;
  current: User;
}
