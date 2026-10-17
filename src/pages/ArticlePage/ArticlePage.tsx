import './ArticlePage.scss';

import Markdown from 'react-markdown';
import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';

import Preloader from '../../components/Preloader';
import ErrorPage from '../ErrorPage';

import Panel from '../../components/Panel';
import Badge from '../../components/Badge';
import Tags from '../../components/Tags';
import Button from '../../components/Button';
import Copyright from '../../components/Copyright';

interface Props {
	api: any;
	articles: any;
}

function ArticlePage(props: Props) {
	const token = localStorage.getItem('token');

	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const { api, articles } = props;

	const { user } = useAuth();
	const { slug } = useParams();
	const [currentPost] = articles.filter((art: any) => art.slug === slug);
	const {
		state: { data },
	} = useLocation();
	const [item, setItem] = useState({ article: data || currentPost });
	const fetch_article = `${api.url + api.articles}/${slug}`;

	useEffect(() => {
		const control = new AbortController();

		async function getData(url: string) {
			try {
				setLoading(true);
				
				const res = await fetch(url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					signal: control.signal,
				});
				const data = await res.json();

				setItem(data);
			} catch (error: any) {
				if (error.name !== 'AbortError') {
					setError(error.message);
				}
			} finally {
				setLoading(false);
			}
		}

		getData(fetch_article);

		return () => control.abort();
	}, [fetch_article]);

	const { article } = item;
	const { author } = article;
	const own = author.username === user.username;

	const [isFavorite, setIsFavorite] = useState(data.favorited);

	function handleFavorite(e: any) {
		const method = isFavorite ? 'DELETE' : 'POST';

		try {
			setLoading(true);
			setIsFavorite(!isFavorite);
			console.log(method);
		} catch (error: any) {
			console.error('Network error:', error);
		} finally {
			setLoading(false);
		}
		console.log(e.target.innerText);
	}

	function handleEdit(e: any) {
		console.log(e.target.innerText);
	}

	function handleDelete(e: any) {
		console.log(e.target.innerText);
	}

	if (loading) {
		return <Preloader />;
	}

	if (error) {
		return <ErrorPage />;
	}

	return (
		<>
			<header className="header">
				<Panel />
				<div className="article-head">
					<div className="article-head-in main">
						<h1 className="article-head__title">{article.title}</h1>
						<Badge
							author={author.username}
							date={format(
								parseISO(article.createdAt),
								'dd MMMM yyyy',
							)}
							own={own}
						/>
					</div>
				</div>
			</header>
			<main className="main">
				<div className="article">
					<div className="article__description">
						<Markdown>
							{article.description + '\n\n' + article.body}
						</Markdown>
					</div>
					{article.tagList.length !== 0 && (
						<Tags
							api={props.api}
							items={article.tagList}
							tagsUrl={props.api.tags}
						/>
					)}
					<div className="article-widgets">
						<Badge
							author={author.username}
							date={format(
								parseISO(article.createdAt),
								'dd MMMM yyyy',
							)}
							own={own}
						/>
						{token && (
							<>
								{own ? (
									<>
										<Button
											href="#"
											text="Edit"
											small={true}
											type="secondary"
											onClick={handleEdit}
											disabled={false}
										/>
										<Button
											href="#"
											text="Delete"
											small={true}
											type="warning"
											onClick={handleDelete}
											disabled={false}
										/>
									</>
								) : (
									<Button
										href="#"
										text={'Favorite article'}
										small={true}
										type={isFavorite ? 'warning' : 'primary'}
										onClick={handleFavorite}
										disabled={false}
									/>
								)}
							</>
						)}
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
