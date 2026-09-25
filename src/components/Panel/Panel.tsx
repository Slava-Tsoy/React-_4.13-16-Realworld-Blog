import './Panel.scss';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';

interface Props {
	api: any;
}

function Panel(props: Props) {
	const [user, setUser] = useState(useAuth().user);
	const fetch_url = props.api.url + props.api.user;
	const token = localStorage.getItem('token');

	useEffect(() => {
		const control = new AbortController();

		async function getCurrentUser(url: string) {
			try {
				const res = await fetch(url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Token ${token}`,
					},
				});
				const data = await res.json();
				setUser(data.user);
			} catch (error: any) {
				console.error(error.message);
			}
		}

		getCurrentUser(fetch_url);

		return () => control.abort();
	}, [fetch_url, token]);

	const menu = token
		? [
				{ name: 'Home', url: '/' },
				{ name: 'New Post', url: '/new_post', icon: 'edit' },
				{ name: 'Settings', url: '/settings', icon: 'settings' },
				{
					name: token ? user?.username : 'Profile',
					url: '/profile',
					icon: 'person',
				},
			]
		: [
				{ name: 'Home', url: '/' },
				{ name: 'Sign In', url: '/sign_in' },
				{ name: 'Sign Up', url: '/sign_up' },
			];

	return (
		<div className="panel">
			<div className="panel-in main">
				<div className="panel__title">
					<Link to="/">Realworld Blog</Link>
				</div>
				<nav className="nav-menu">
					<ul className="menu">
						{menu.map((e: any, i: number) => (
							<li className="menu__item" key={i}>
								<Link to={e.url} className="menu__link">
									{e.icon && (
										<span className="material-icons menu__icon">
											{e.icon}
										</span>
									)}
									<span className="menu__text">{e.name}</span>
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</div>
	);
}

export default Panel;
