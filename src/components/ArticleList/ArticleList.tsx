import './ArticleList.scss';
import ArticleCard from './ArticleCard';

interface Props {
	api: any;
	items: any;
	articlesUrl: string;
	tagsUrl: string;
}

function ArticleList(props: Props) {
	const { api, items, articlesUrl, tagsUrl } = props;

	function addToFavorites(article: any) {}

	return (
		<section className="article-list">
			{items.map((e: any, key: number) => (
				<ArticleCard
					api={api}
					key={key}
					item={e}
					itemUrl={articlesUrl}
					tagsUrl={tagsUrl}
					addToFavorites={addToFavorites}
				/>
			))}
		</section>
	);
}

export default ArticleList;
