import './Tags.scss';
import { Link, useSearchParams } from 'react-router-dom';

interface Props {
	api: any,
	items: any;
	tagsUrl: string;
}

function Tags(props: Props) {
	const { api, items } = props;
	const [searchParams] = useSearchParams();
	const currentOffset = searchParams.get('offset') || '0';
	const uri = `${api.articles}?offset=${currentOffset}`;
	
	return (
		<ul className="tags">
			{items.map((e: any, key: number) => (
				<li className="tags__item" key={key}>
					<Link
						to={`${uri}&tag=${e}`}
						className="tags__link"
					>
						{e}
					</Link>
				</li>
			))}
		</ul>
	);
}

export default Tags;
