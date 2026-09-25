import './ProfilePage.scss';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

import Panel from '../../components/Panel';
import Tabs from '../../components/Tabs';
import Block from '../../components/Block';
import ArticleList from '../../components/ArticleList';
import Pagination from '../../components/Pagination';
import Copyright from '../../components/Copyright';
import Preloader from '../../components/Preloader';

import ErrorPage from '../ErrorPage';

interface Props {
	api: any;
	articles: any;
	articlesCount: number;
	tags: any;
}

function ProfilePage(props: Props) {
	const [articles, articlesUrl] = [props.articles, props.api.articles];
	const [tags, tagsUrl] = [props.tags, props.api.tags];

	const [searchParams] = useSearchParams();
	const currentOffset = searchParams.get('offset') || '0';
	const fetch_articles =
		props.api.url + articlesUrl + props.api.offset + currentOffset;

	const [items, setItems] = useState(articles);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetch_user = props.api.url + props.api.user;
	const token = localStorage.getItem('token');
	const [user, setUser] = useState(useAuth().user);

	useEffect(() => {
		const control = new AbortController();

		async function getData(url: string) {
			try {
				setLoading(true);

				await fetch(url)
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

		getData(fetch_articles);

		async function getCurrentUser(url: string) {
			try {
				const res = await fetch(url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Token ${token}`,
					},
				});
				const data = await res.json();
				setUser(data.user);
			} catch (error: any) {
				console.error(error.message);
			}
		}

		getCurrentUser(fetch_user);

		return () => control.abort();
	}, [fetch_articles, fetch_user, token]);

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
				<div className="profile">
					<div className="profile-in main">
						<div className="profile__avatar"></div>
						<h2 className="profile__name">{user?.username}</h2>
					</div>
				</div>
			</header>
			<main className="main">
				<Tabs />
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

export default ProfilePage;
