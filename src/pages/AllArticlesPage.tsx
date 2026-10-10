import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Panel from '../components/Panel';
import Block from '../components/Block';
import ArticleList from '../components/ArticleList';
import Pagination from '../components/Pagination';
import Copyright from '../components/Copyright';
import Preloader from '../components/Preloader';

import ErrorPage from './ErrorPage';

interface Props {
	api: any;
	articles: any;
	articlesCount: number;
	tags: any;
}

function AllArticlesPage(props: Props) {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	
	const [searchParams] = useSearchParams();
	const currentOffset = parseInt(searchParams.get('offset') || '0');
	const currentTag = searchParams.get('tag');
	const offsetParam = `?offset=${currentOffset}`;
	const tagParam = !currentTag ? '' : `&tag=${currentTag}`;

	const [items, setItems] = useState(props.articles);
	const [itemsCount, setItemsCount] = useState(props.articlesCount);
	const fetch_articles = props.api.url + props.api.articles + offsetParam + tagParam;

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
				const { articles, articlesCount } = data;
				
				setItems(articles);
				setItemsCount(articlesCount);
			} catch (error: any) {
				if (error.name !== 'AbortError') {
					setError(error.message);
				}
			} finally {
				setLoading(false);
			}
		}

		getData(fetch_articles);

		return () => control.abort();
	}, [fetch_articles]);

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
			</header>
			<main className="main">
				<Block api={props.api} items={props.tags} tagsUrl={props.api.tags} />
				<ArticleList
					api={props.api}
					items={items}
					articlesUrl={props.api.articles}
					tagsUrl={props.api.tags}
				/>
				<Pagination
					offset={props.api.offset}
					amountPerPage={props.articles.length}
					articlesCount={itemsCount}
					range={5}
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

export default AllArticlesPage;
