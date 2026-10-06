import './ProfilePage.scss';

import { useState, useEffect } from 'react';
import { useSearchParams, Link, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import clsx from 'clsx';

import Panel from '../../components/Panel';
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
	const currentOffset = searchParams.get('offset') || '0';
	const fetch_articles =
		props.api.url + props.api.articles + `?offset=${currentOffset}`;

	const [currentAuthor, setCurrentAuthor] = useState(useParams());
	const fetch_author =
		props.api.url + props.api.profiles + `/${currentAuthor.username}`;
	const fetch_author_articles =
		fetch_articles + `&author=${currentAuthor.username}`;

	const { user } = useAuth();
	const [currentUser, setCurrentUser] = useState(user);
	const [isFollowing, setIsFollowing] = useState(getIsFollowing());
	const [following, setFollowing] = useState(getFollowing());
	const fetch_follow = `${fetch_author}/follow`;

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
					case 'author': {
						const { profile } = data;
						const { bio, image, ...author } = profile;
						setCurrentAuthor(author);
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

		getData(fetch_author_articles, 'articles');
		getData(fetch_author, 'author');

		return () => control.abort();
	}, [fetch_author, fetch_author_articles, token]);

	function getIsFollowing() {
		const value: any = localStorage.getItem(currentUser?.username);
		const localUser = JSON.parse(value);

		if (localUser && localUser.following) {
			const [localAuthor] = localUser.following.filter((e: any) => {
				return e.username === currentAuthor.username;
			});

			return localAuthor ? localAuthor?.following : false;
		}

		return false;
	}

	function getFollowing() {
		const value: any = localStorage.getItem(currentUser?.username);
		const localUser = JSON.parse(value);

		if (localUser && localUser.following) {
			return localUser.following;
		}

		return [];
	}

	function getSaveFollowing(followings: any, newFollow: any) {
		const followExist = followings.some(
			(follow: any) => follow.username === newFollow.username,
		);

		if (followExist) {
			return followings.map((follow: any) => {
				return follow.username === newFollow.username
					? { ...follow, ...newFollow }
					: follow;
			});
		} else {
			return [...followings, newFollow];
		}
	}

	function toLocalStorage(user: any, author: any) {
		const subscribes = getSaveFollowing(following, author);
		const updatedUser = { ...user, following: subscribes };

		setFollowing(subscribes);

		localStorage.setItem(
			currentUser?.username,
			JSON.stringify(updatedUser),
		);
	}

	async function handleFollow() {
		if (loading) {
			return;
		}

		const method = isFollowing ? 'DELETE' : 'POST';

		try {
			setLoading(true);

			const res = await fetch(fetch_follow, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
			});

			if (res.ok) {
				setIsFollowing(!isFollowing);
			} else {
				console.error('Server error when changing subscription status');
			}

			const { profile } = await res.json();
			const { bio, image, ...author } = profile;

			setCurrentAuthor(author);
			toLocalStorage(currentUser, author);
		} catch (error: any) {
			console.error('Network error:', error);
		} finally {
			setLoading(false);
		}
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
							{currentAuthor.username}
						</h2>
						{token && (
							<Link
								to="#"
								className={clsx(
									'button',
									isFollowing
										? 'button--warning'
										: 'button--secondary',
								)}
								onClick={(e: any) => {
									e.preventDefault();
									handleFollow();
								}}
							>
								<span className="material-icons button__icon">
									favorite
								</span>
								<span className="button__text">
									{isFollowing ? 'Following' : 'Follow'}
								</span>
							</Link>
						)}
					</div>
				</div>
			</header>
			<main className="main">
				<Block items={props.tags} tagsUrl={props.api.tags} />
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
