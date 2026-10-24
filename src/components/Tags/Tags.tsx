import './Tags.scss';

import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';

interface Props {
	api: any;
	items: any;
	tagsUrl: string;
	selectedItems?: any;
}

function Tags(props: Props) {
	const { api, items, selectedItems } = props;
	const [searchParams] = useSearchParams();
	const currentOffset = searchParams.get('offset') || '0';
	const uri = `${api.articles}?offset=${currentOffset}`;

	const hasActiveTag = (arr: any[], item: string) => {
		return arr.includes(item);
	};

	return (
		<ul className="tags">
			{items.map((e: any, key: number) => (
				<li className="tags__item" key={key}>
					<Link
						to={`${uri}&tag=${e}`}
						className={clsx('tags__link', {
							'tags__link--active':
								selectedItems && hasActiveTag(selectedItems, e),
						})}
					>
						{e}
					</Link>
				</li>
			))}
		</ul>
	);
}

export default Tags;
