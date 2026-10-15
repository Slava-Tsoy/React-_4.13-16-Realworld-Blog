import './Tabs.scss';

import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface Props {
	items: any;
	filter: any;
}

function Tabs(props: Props) {
	const { items, filter } = props;

	const handleClick = (e: any) => {
		e.preventDefault();

		if (e.target.tagName !== 'A') {
			return;
		}

		filter(e);
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
