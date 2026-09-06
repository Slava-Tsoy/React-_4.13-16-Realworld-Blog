import './ArticleList.scss';
import ArticleCard from './ArticleCard';

interface Props {
	items: any,
	count: number,
	articleUrl: string,
	tagsUrl: string
}

function ArticleList(props: Props) {
	const [items, count, itemsUrl, tagsUrl] = [props.items, props.count, props.articleUrl, props.tagsUrl];
	console.log(count, 'ArticleList');

	return (
		<section className="article-list">
			{items.map((e: any, key: number) => (
				<ArticleCard key={key} item={e} itemUrl={itemsUrl} tagsUrl={tagsUrl} />
			))}
		</section>
	);
}

export default ArticleList;