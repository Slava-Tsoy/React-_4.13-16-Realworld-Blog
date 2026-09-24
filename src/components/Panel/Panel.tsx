import './Panel.scss';
import { Link } from 'react-router-dom';

function Panel() {
	const token = localStorage.getItem('token');
	const menu = token
		? [
				{ name: 'Home', url: '/' },
				{ name: 'New Post', url: '/new_post', icon: 'edit' },
				{ name: 'Settings', url: '/settings', icon: 'settings' },
				{ name: 'Profile', url: '/profile', icon: 'person' },
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
						{menu.map((e: any) => (
							<li className="menu__item" key={e.name}>
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
