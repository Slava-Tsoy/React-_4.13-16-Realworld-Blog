import { createContext } from 'react';

export interface User {
	email: string;
	password: string;
	username?: string;
}

interface AuthContextType {
	user: User | any;
	login: any;
	logout: any;
	loading: boolean;
	error: any;
}

export const AuthContext = createContext<AuthContextType | null>(null);
