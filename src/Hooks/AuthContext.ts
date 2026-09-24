import { createContext, type Dispatch, type SetStateAction } from 'react';

export interface User {
	email: string;
	password: string;
	username?: string;
}

interface AuthContextType {
	user: User | null;
	setUser: Dispatch<SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
