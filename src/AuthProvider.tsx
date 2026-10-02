import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './hooks/AuthContext';

const API = {
	root_url: 'https://realworld.habsida.net/api',
	user_page: '/user',
};
const token = localStorage.getItem('token');
const fetch_user = API.root_url + API.user_page;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const control = new AbortController();

		async function getUser(url: string) {
			try {
				const res = await fetch(url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Token ${token}`,
					},
					signal: control.signal,
				});

				if (res.status === 401) {
					setUser(null);
					localStorage.removeItem('token');
					window.location.href = '/';
					return;
				}

				if (!res.ok) {
					throw new Error('Failed to load data from the server');
				}

				const { user } = await res.json();
				setUser(user);
			} catch (err: any) {
				if (err.name !== 'AbortError') {
					setError(err.message);
				}
			} finally {
				setLoading(false);
			}
		}

		if (token) {
			getUser(fetch_user);
		}

		return () => control.abort();
	}, []);

	function login(userData: any) {
		setUser(userData);
		localStorage.setItem('token', userData.token);
	}

	function logout() {
		setUser(null);
		localStorage.removeItem('token');
	}

	return (
		<AuthContext.Provider value={{ user, login, logout, loading, error }}>
			{children}
		</AuthContext.Provider>
	);
};
