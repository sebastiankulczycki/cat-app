export interface IUsers {
	users: IUserData[];
}

export interface IUserData {
	username: string;
	email: string;
	password: string;
}

export interface IUser {
	username: string;
	email: string;
}

export type IUserLogin = Omit<IUserData, 'username'>;
