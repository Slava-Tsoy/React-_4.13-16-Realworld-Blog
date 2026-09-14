import Panel from '../components/Panel';
import PageInfo from '../components/PageInfo';
import Block from '../components/Block';
import ArticleList from '../components/ArticleList';
import Pagination from '../components/Pagination';
import Copyright from '../components/Copyright';

interface Props {
	api: any;
	articles: any;
	articlesCount: number;
	tags: any;
}

function MainPage(props: Props) {
	const [articles, articlesUrl] = [props.articles, props.api.articles];
	const [tags, tagsUrl] = [props.tags, props.api.tags];

	return (
		<>
			<header className="header">
				<Panel />
				<PageInfo />
			</header>
			<main className="main">
				<Block items={tags} tagsUrl={tagsUrl} />
				<ArticleList
					items={articles}
					articlesUrl={articlesUrl}
					tagsUrl={tagsUrl}
				/>
				<Pagination
					offset={props.api.offset}
					amountPerPage={articles.length}
					articlesCount={props.articlesCount}
					limit={5}
				/>
			</main>
			<footer className="footer">
				<div className="footer-in main">
					<Copyright />
				</div>
			</footer>
		</>
	);
}

export default MainPage;
