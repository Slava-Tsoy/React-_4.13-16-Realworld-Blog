import './ArticleList.scss';
import ArticleCard from './ArticleCard';

interface Props {
	api: any;
	items: any;
	articlesUrl: string;
	tagsUrl: string;
}

function ArticleList(props: Props) {
	const [items, itemsUrl, tagsUrl] = [
		props.items,
		props.articlesUrl,
		props.tagsUrl,
	];

	return (
		<section className="article-list">
			{items.map((e: any, key: number) => (
				<ArticleCard
					api={props.api}
					key={key}
					item={e}
					itemUrl={itemsUrl}
					tagsUrl={tagsUrl}
				/>
			))}
		</section>
	);
}

export default ArticleList;
