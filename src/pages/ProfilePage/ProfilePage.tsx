import './ProfilePage.scss';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';

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
	const token = localStorage.getItem('token');

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

	const [tabItems, setTabItems] = useState([
		{
			name: 'Favorites',
			uri: `${fetch_articles}&favorited=${user.username}`,
			active: true,
		},
		{
			name: 'My posts',
			uri: `${fetch_articles}&author=${user.username}`,
			active: false,
		},
	]);
	const [fetchFavoriteArticles, setFetchFavoriteArticles] = useState(
		`${fetch_articles}&favorited=${user.username}`,
	);

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

		getData(fetchFavoriteArticles, 'articles');

		return () => control.abort();
	}, [fetchFavoriteArticles, token]);

	function getItIsActive(name: string) {
		const currentTab = tabItems.filter((item: any) => {
			return item.name === name;
		});
		const [activeTab] = currentTab;
		const { active } = activeTab;

		return active;
	}

	function setActiveTab(name: string) {
		const updatedTabs: any = tabItems.map((item: any) => {
			return item.name === name
				? { ...item, active: true }
				: { ...item, active: false };
		});

		setTabItems(updatedTabs);
	}

	function filterByTab(e: any) {
		const { href, innerText } = e.target;
		const isActive = getItIsActive(innerText);

		if (isActive) {
			return;
		}

		setFetchFavoriteArticles(href);
		setActiveTab(innerText);
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
				<Tabs items={tabItems} filter={filterByTab} />
				<Block
					api={props.api}
					items={props.tags}
					tagsUrl={props.api.tags}
				/>
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
