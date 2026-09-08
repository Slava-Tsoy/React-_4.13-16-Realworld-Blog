import Panel from '../components/Panel';
import Block from '../components/Block';
import ArticleList from '../components/ArticleList';
import Copyright from '../components/Copyright';

interface Props {
	api: any,
	articles: any,
	articlesCount: number,
	tags: any,
}

function AllArticlesPage(props: Props) {
	const [articles, articleUrl] = [props.articles, props.api.articles];
	const [tags, tagsUrl] = [props.tags, props.api.tags];

	return (
		<>
			<header className="header">
				<Panel />
			</header>
			<main className="main">
				<Block items={tags} tagsUrl={tagsUrl} />
				<ArticleList items={articles} articleUrl={articleUrl} tagsUrl={tagsUrl} />
			</main>
			<footer className="footer">
				<div className="footer-in main">
					<Copyright />
				</div>
			</footer>
		</>
	);
}

export default AllArticlesPage;