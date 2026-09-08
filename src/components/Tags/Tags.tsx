import './Tags.scss';
import { Link } from 'react-router-dom';

interface Props {
	items: any,
	limit?: number,
	tagsUrl: string
}

function Tags({ items, limit = 20, tagsUrl }: Props) {
	return (
		<ul className="tags">
			{items.slice(0, limit).map((e: any, key: number) => ( // .slice(0, limit) для ограничения
				<li className="tags__item" key={key}>
					<Link to={tagsUrl + '/' + e} className="tags__link">{e}</Link>
				</li>
			))}
		</ul>
	);
}

export default Tags;