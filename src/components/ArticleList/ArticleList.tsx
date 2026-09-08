import './ArticleList.scss';
import ArticleCard from './ArticleCard';

interface Props {
	items: any,
	articleUrl: string,
	tagsUrl: string
}

function ArticleList(props: Props) {
	const [items, itemsUrl, tagsUrl] = [props.items, props.articleUrl, props.tagsUrl];

	return (
		<section className="article-list">
			{items.map((e: any, key: number) => (
				<ArticleCard key={key} item={e} itemUrl={itemsUrl} tagsUrl={tagsUrl} />
			))}
		</section>
	);
}

export default ArticleList;