import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './hooks/AuthContext';

const API = {
	root_url: 'https://realworld.habsida.net/api',
	user_page: '/user',
};
const fetch_user = API.root_url + API.user_page;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [error, setError] = useState(null);
	const [token, setToken] = useState(() => localStorage.getItem('token'));
	const [user, setUser] = useState(() => {
		const saveToken = localStorage.getItem('token');

		if (!saveToken) {
			return null;
		}

		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);

			if (key && key !== 'token' && key !== 'undefined') {
				try {
					const data = JSON.parse(localStorage.getItem(key) || '');

					if (data && (data.username || data.email)) {
						return data;
					}
				} catch (err: any) {
					console.error(err);
				}
			}
		}

		return null;
	});
	const [loading, setLoading] = useState(() => {
		const savedToken = localStorage.getItem('token');
		return !!savedToken;
	});

	function prepareData(data: any, stringify?: boolean) {
		const { bio, image, token, ...user } = data;

		if (!('following' in user)) {
			user.following = [];
		}

		if (!('favorites' in user)) {
			user.favorites = [];
		}

		return stringify ? JSON.stringify(user) : user;
	}

	useEffect(() => {
		if (!token) {
			return;
		}

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
					setToken(null);
					localStorage.removeItem('token');
					window.location.href = '/';
					return;
				}

				if (!res.ok) {
					throw new Error('Failed to load data from the server');
				}

				const { user: serverUser } = await res.json();

				setUser((currentUser: any) => {
					if (!currentUser) {
						return prepareData(serverUser, false);
					}
					return {
						...currentUser,
						...prepareData(serverUser, false),
					};
				});
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
	}, [token]);

	function setLocalStorage(userData: any) {
		const value: any = localStorage.getItem(userData.username);
		const localUser = JSON.parse(value);

		if (!localUser) {
			localStorage.setItem(
				userData.username,
				prepareData(userData, true),
			);
		}

		const { following, favorites, ...newUserData } = userData;
		const updatedUser = { ...localUser, ...newUserData };

		localStorage.setItem(userData.username, JSON.stringify(updatedUser));
	}

	function login(userData: any) {
		const cleanUser = prepareData(userData, false);

		setUser((currentUser: any) => {
			if (!currentUser) {
				return cleanUser;
			}
			return { ...currentUser, ...cleanUser };
		});
		setToken(userData.token);

		localStorage.setItem('token', userData.token);
		setLocalStorage(prepareData(userData, false));
	}

	function logout() {
		setUser(null);
		setToken(null);

		localStorage.removeItem('token');
	}

	return (
		<AuthContext.Provider value={{ user, login, logout, loading, error }}>
			{children}
		</AuthContext.Provider>
	);
};
