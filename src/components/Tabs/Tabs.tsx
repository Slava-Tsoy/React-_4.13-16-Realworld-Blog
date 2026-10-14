import './Tabs.scss';

import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface Props {
	items: any;
}

function Tabs(props: Props) {
	const { items } = props;

	const handleClick = (e: any) => {
		e.preventDefault();

		if (e.target.tagName !== 'A') {
			return;
		}

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
		<ul className="tabs" onClick={handleClick}>
			{items.map((e: any, key: number) => (
				<li
					className={clsx(
						'tabs__item',
						e.active && 'tabs__item--active',
					)}
					key={key}
				>
					<Link to={e.uri}>{e.name}</Link>
				</li>
			))}
		</ul>
	);
}

export default Tabs;
