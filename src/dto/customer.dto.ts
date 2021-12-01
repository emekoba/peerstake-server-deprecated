export class RegDto {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  address: string;
  password: string;
  cPassword: string;
  gender: string;
  haveAgreed?: boolean;
}
export class LoginDto {
  email: string;
  password: string;
}
