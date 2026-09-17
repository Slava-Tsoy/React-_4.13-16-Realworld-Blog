import './ProfilePage.scss';

import { Link } from 'react-router-dom';

import Panel from '../../components/Panel';
import Tabs from '../../components/Tabs';
import Block from '../../components/Block';
import ArticleList from '../../components/ArticleList';
import Pagination from '../../components/Pagination';
import Copyright from '../../components/Copyright';
// import Preloader from '../../components/Preloader';

// import ErrorPage from '../ErrorPage';

interface Props {
	api: any;
	articles: any;
	articlesCount: number;
	tags: any;
}

function ProfilePage(props: Props) {
	const [articles, articlesUrl] = [props.articles, props.api.articles];
	const [tags, tagsUrl] = [props.tags, props.api.tags];

	return (
		<>
			<header className="header">
				<Panel />
				<div className="profile">
					<div className="profile-in main">
						<div className="profile__avatar"></div>
						<h2 className="profile__name">John Lobster</h2>
						<Link
							to="#"
							className="button button--secondary"
							onClick={(e) => {
								e.preventDefault();
							}}
						>
							<span className="material-icons button__icon">
								favorite
							</span>
							<span className="button__text">Follow</span>
						</Link>
					</div>
				</div>
			</header>
			<main className="main">
				<Tabs />
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

export default ProfilePage;
