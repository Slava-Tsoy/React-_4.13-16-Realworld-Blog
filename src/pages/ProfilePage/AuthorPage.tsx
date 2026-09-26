import './ProfilePage.scss';

import { useState, useEffect } from 'react';
import { useSearchParams, Link, useParams } from 'react-router-dom';
import clsx from 'clsx';

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
	const [count, setCount] = useState(props.articlesCount);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const { username } = useParams();
	const fetch_author = props.api.url + props.api.profiles + `/${username}`;
	const [author, setAuthor] = useState({ username: username });
	const token = localStorage.getItem('token');

	const [following, setFollowing] = useState(false);
	const fetch_follow = `${fetch_author}/follow`;

	useEffect(() => {
		const control = new AbortController();

		async function getData(url: string) {
			try {
				setLoading(true);

				await fetch(url)
					.then((res) => res.json())
					.then((data) => {
						setItems(data.articles);
						setCount(data.articlesCount);
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

		getData(fetch_articles + `&author=${author.username}`);

		async function getAuthor(url: string) {
			try {
				const res = await fetch(url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				const { profile } = await res.json();
				setAuthor(profile);
				setFollowing(profile.following);
			} catch (error: any) {
				console.error(error.message);
			}
		}

		getAuthor(fetch_author);

		return () => control.abort();
	}, [author.username, fetch_articles, fetch_author]);

	if (loading) {
		return <Preloader />;
	}

	if (error) {
		return <ErrorPage />;
	}

	async function handleFollow(e: any) {
		e.preventDefault();

		if (loading) {
			return;
		}

		setLoading(true);

		const method = following ? 'DELETE' : 'POST';

		try {
			const res = await fetch(fetch_follow, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
			});

			if (res.ok) {
				setFollowing(!following);
			} else {
				console.error('Server error when changing subscription status');
			}

			const { profile } = await res.json();
			setAuthor(profile);
		} catch (error: any) {
			console.error('Network error:', error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<header className="header">
				<Panel api={props.api} />
				<div className="profile">
					<div className="profile-in main">
						<div className="profile__avatar"></div>
						<h2 className="profile__name">{author.username}</h2>
						{token && (
							<Link
								to="#"
								className={clsx(
									'button',
									(author as any).following
										? 'button--warning'
										: 'button--secondary',
								)}
								onClick={handleFollow}
							>
								<span className="material-icons button__icon">
									favorite
								</span>
								<span className="button__text">
									{(author as any).following
										? 'Following'
										: 'Follow'}
								</span>
							</Link>
						)}
					</div>
				</div>
			</header>
			<main className="main">
				<Tabs />
				<Block items={tags} tagsUrl={tagsUrl} />
				<ArticleList
					api={props.api}
					items={items}
					articlesUrl={articlesUrl}
					tagsUrl={tagsUrl}
				/>
				<Pagination
					offset={props.api.offset}
					amountPerPage={articles.length}
					articlesCount={count}
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
