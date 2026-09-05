import './Panel.scss';

function Panel() {
	const menu = [
		{name: 'Home', url: '/'},
		{name: 'New Post', url: '/new_post',  icon: 'edit'},
		{name: 'Settings', url: '/settings', icon: 'settings'},
		{name: 'Profile', url: '/profile', icon: 'person'},
		{name: 'Sign In', url: '/sign_in'},
		{name: 'Sign Up', url: '/sign_up'}
	];
	
	return (
		<div className="panel">
			<div className="panel-in main">
				<div className="panel__title">
					<a href="/">Realworld Blog</a>
				</div>
				<nav className="nav-menu">
					<ul className="menu">{
						menu.map((e: any) => (
							<li className="menu__item" key={e.name}>
								<a href={e.url} className="menu__link">
									{e.icon && (
										<span className="material-icons menu__icon">{e.icon}</span>
									)}
									<span className="menu__text">{e.name}</span>
								</a>
							</li>
						))
					}</ul>
				</nav>
			</div>
		</div>
	);
}

export default Panel;