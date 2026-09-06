import { useState, useEffect } from 'react';

import ErrorPage from './ErrorPage';

import Preloader from '../components/Preloader';
import Panel from '../components/Panel';
import PageInfo from '../components/PageInfo';
import Block from '../components/Block';
import ArticleList from '../components/ArticleList';
import Copyright from '../components/Copyright';

const api = {
	url: 'https://realworld.habsida.net/api',
	articles: '/articles',
	tags: '/tags',
	offset: '?iffset=',
};

function MainPage() {
	const [articles, setArticles] = useState([]);
	const [articlesCount, setArticlesCount] = useState(0);
	const [tags, setTags] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() =>  {
		const control = new AbortController();

		async function getData() {
			try {
				setLoading(true);

				const [articlesRes, tagsRes] = await Promise.all([
					fetch(api.url  + api.articles, { signal: control.signal }),
					fetch(api.url  + api.tags, { signal: control.signal })
				]);

				if (!articlesRes.ok || !tagsRes.ok) {
					throw new Error('Failed to load data from the server');
				}

				const [articlesData, tagsData] = await Promise.all([
					articlesRes.json(),
					tagsRes.json()
				]);

				setArticles(articlesData.articles);
				setArticlesCount(articlesData.articlesCount);
				setTags(tagsData.tags);
			} catch (error: any) {
				if (error.name !== 'AbortError') {
					setError(error.message);
				}
			} finally {
				setLoading(false);
			}
		}

		getData();

		return () => control.abort();
	}, []);

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
				<PageInfo />
			</header>
			<main className="main">
				<Block items={tags} tagsUrl={api.tags} />
				<ArticleList items={articles} count={articlesCount} articleUrl={api.articles} tagsUrl={api.tags} />
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
