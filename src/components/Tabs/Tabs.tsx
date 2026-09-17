import './Tabs.scss';

import { Link } from 'react-router-dom';

function Tabs() {
	return (
		<ul className="tabs">
			<li className="tabs__item tabs__item--active">
				<Link to="#">Your Feed</Link>
			</li>
			<li className="tabs__item">
				<Link to="#">Your Feed</Link>
			</li>
		</ul>
	);
}

export default Tabs;
