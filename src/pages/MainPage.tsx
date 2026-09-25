import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Panel from '../components/Panel';
import PageInfo from '../components/PageInfo';
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

function MainPage(props: Props) {
	const [articles, articlesUrl] = [props.articles, props.api.articles];
	const [tags, tagsUrl] = [props.tags, props.api.tags];

	const [searchParams] = useSearchParams();
	const currentOffset = searchParams.get('offset') || '0';
	const fetchUrl =
		props.api.url + articlesUrl + props.api.offset + currentOffset;

	const [items, setItems] = useState(articles);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const control = new AbortController();

		async function getData() {
			try {
				setLoading(true);

				await fetch(fetchUrl)
					.then((res) => res.json())
					.then((data) => {
						setItems(data.articles);
					})
					.catch((error) => {
						console.error(error);
						setLoading(false);
					});
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
	}, [fetchUrl]);

	if (loading) {
		return <Preloader />;
	}

	if (error) {
		return <ErrorPage />;
	}

	return (
		<>
			<header className="header">
				<Panel api={props.api} />
				<PageInfo />
			</header>
			<main className="main">
				<Block items={tags} tagsUrl={tagsUrl} />
				<ArticleList
					items={items}
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
