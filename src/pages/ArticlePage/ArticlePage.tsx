import './ArticlePage.scss';

import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

import Preloader from '../../components/Preloader';
import Panel from '../../components/Panel';
import Badge from '../../components/Badge';
import Tags from '../../components/Tags';
import Button from '../../components/Button';
import Copyright from '../../components/Copyright';

interface Props {
	api: any,
	articles: any,
}

function ArticlePage(props: Props) {
	const { slug } = useParams();
	const location = useLocation();
	const [item, setItem] = useState({article: {}});
	const [loading, setLoading] = useState(true);
	const fetch_url = props.api.url + props.api.articles + '/' + slug;

	useEffect(() => {
		fetch(fetch_url)
		.then((res: Response) => res.json())
		.then((data: any) => {
			setItem(data);
			setLoading(false);
		})
		.catch((error) => {
			console.error(error);
			setLoading(false);
		});
	}, [fetch_url]);

	if (loading) {
		return <Preloader />;
	}

	const article = item.article || location.state?.data || props.articles.filter((art: any) => art.slug === slug)[0];
	const author = article.author;

	return (
		<>
			<header className="header">
				<Panel />
				<div className="article-head">
					<div className="article-head-in main">
						<h1 className="article-head__title">{article.title}</h1>
						<Badge author={author.username} date={format(parseISO(article.createdAt), 'dd MMMM yyyy')} />
					</div>
				</div>
			</header>
			<main className="main">
				<div className="article">
					<div className="article__description">
						<p>{article.description}</p>
						<p>{article.body}</p>
					</div>
					{article.tagList.length !== 0 && (
						<Tags items={article.tagList} tagsUrl={props.api.tags} />
					)}
					<div className="article-widgets">
						<Badge author={author.username} date={format(parseISO(article.createdAt), 'dd MMMM yyyy')} />
						<Button href="#" text="Edit" small={true} type="secondary" />
						<Button href="#" text="Delete" small={true} type="warning" />
						<Button href="#" text="Favorite article" small={true} type="primary" />
					</div>
				</div>
			</main>
			<footer className="footer">
				<div className="footer-in main">
					<Copyright />
				</div>
			</footer>
		</>
	);
}

export default ArticlePage;