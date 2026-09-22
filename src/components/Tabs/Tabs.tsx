import './Tabs.scss';

import { Link } from 'react-router-dom';

function Tabs() {
	const handleClick = (e: any) => {
		e.preventDefault();

		const allTabs = e.target
			.closest('ul.tabs')
			.querySelectorAll('li.tabs__item');
		const active = e.target.closest('li.tabs__item');

		allTabs.forEach((i: any) => {
			i.classList.remove('tabs__item--active');
		});

		active.classList.add('tabs__item--active');
	};

	return (
		<ul className="tabs">
			<li className="tabs__item tabs__item--active">
				<Link to="#" onClick={handleClick}>
					Your Feed
				</Link>
			</li>
			<li className="tabs__item">
				<Link to="#" onClick={handleClick}>
					Your Feed
				</Link>
			</li>
		</ul>
	);
}

export default Tabs;
