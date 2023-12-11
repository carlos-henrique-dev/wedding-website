import { TSide } from "./guests";

export interface IUser {
  id: string;
  name: string;
  username: string;
  password: string;
  side: TSide;
}
