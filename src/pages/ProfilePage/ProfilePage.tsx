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

const token = localStorage.getItem('token');

function ProfilePage(props: Props) {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const [items, setItems] = useState(props.articles);
	const [itemsCount, setItemsCount] = useState(props.articlesCount);
	const [searchParams] = useSearchParams();
	const currentOffset =
		props.api.offset + (searchParams.get('offset') || '0');
	const fetch_articles = props.api.url + props.api.articles + currentOffset;

	const { user } = useAuth();
	const [currentUser, setCurrentUser] = useState(user);
	const fetch_current_user = props.api.url + props.api.user;

	useEffect(() => {
		const control = new AbortController();

		async function getData(url: string, type?: string) {
			try {
				setLoading(true);

				const res = await fetch(url, {
					method: 'GET',
					headers:
						token && type === 'currentUser'
							? {
									'Content-Type': 'application/json',
									Authorization: `Token ${token}`,
								}
							: {
									'Content-Type': 'application/json',
								},
					signal: control.signal,
				});
				const data = await res.json();

				switch (type) {
					case 'articles': {
						const { articles, articlesCount } = data;
						setItems(articles);
						setItemsCount(articlesCount);
						return data;
					}
					case 'currentUser': {
						const { user } = data;
						setCurrentUser(user);
						return data;
					}
					default:
						return data;
				}
			} catch (err: any) {
				if (err.name !== 'AbortError') {
					setError(err.message);
				}
			} finally {
				setLoading(false);
			}
		}

		getData(fetch_articles, 'articles');
		getData(fetch_current_user, 'currentUser');

		return () => control.abort();
	}, [fetch_articles, fetch_current_user]);

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
				<div className="profile">
					<div className="profile-in main">
						<div className="profile__avatar"></div>
						<h2 className="profile__name">
							{currentUser?.username}
						</h2>
					</div>
				</div>
			</header>
			<main className="main">
				<Tabs />
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

export default ProfilePage;
