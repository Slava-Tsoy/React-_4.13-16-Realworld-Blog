import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

import Tags from '../Tags';
import Badge from '../Badge';
import Button from '../Button';

interface Props {
	item: any;
	itemUrl: string;
	tagsUrl: string;
}

function ArticleCard(props: Props) {
	const token = localStorage.getItem('token');
	const [item, author, created] = [
		props.item,
		props.item.author,
		props.item.createdAt,
	];

	return (
		<article className="article-card">
			<div className="article-card-head">
				<Badge
					author={author.username}
					date={format(parseISO(created), 'dd MMMM yyyy')}
				/>
				{token && (
					<Button
						href="#"
						text={item.favoritesCount}
						small={true}
						type="secondary"
						icon="favorite"
					/>
				)}
			</div>
			<div className="article-card__content">
				<h2 className="article-card__title">
					<Link
						to={props.itemUrl + '/' + item.slug}
						state={{ data: item }}
					>
						{item.title}
					</Link>
				</h2>
				<div className="article-card__text">{item.description}</div>
			</div>
			{item.tagList.length !== 0 && (
				<Tags items={item.tagList} tagsUrl={props.tagsUrl} />
			)}
		</article>
	);
}

export default ArticleCard;
