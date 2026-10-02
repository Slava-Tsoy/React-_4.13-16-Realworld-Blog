import './App.scss';

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ErrorPage from './pages/ErrorPage';
import NotFound from './pages/NotFound';
import MainPage from './pages/MainPage';
import ArticlePage from './pages/ArticlePage';
import AllArticlesPage from './pages/AllArticlesPage';
import ProfilePage from './pages/ProfilePage';
import AuthorPage from './pages/ProfilePage/AuthorPage';
import {
	NewPostPage,
	SettingsPage,
	SignInPage,
	SignUpPage,
} from './pages/FormsPages';

import Preloader from './components/Preloader';

const api = {
	url: 'https://realworld.habsida.net/api',
	articles: '/articles',
	offset: '?offset=',
	tags: '/tags',
	users: '/users',
	user: '/user',
	login: '/login',
	profiles: '/profiles',
	favorite: '/favorite',
};

function App() {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const [articles, setArticles] = useState([]);
	const [articlesCount, setArticlesCount] = useState(0);
	const [tags, setTags] = useState([]);

	useEffect(() => {
		const control = new AbortController();

		async function getData(url: string, type?: string) {
			try {
				setLoading(true);

				const res = await fetch(url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					signal: control.signal,
				});

				if (!res.ok) {
					throw new Error('Failed to load data from the server');
				}

				const data = await res.json();

				switch (type) {
					case 'articles': {
						const { articles, articlesCount } = data;
						setArticles(articles);
						setArticlesCount(articlesCount);
						break;
					}
					case 'tags': {
						const { tags } = data;
						setTags(tags);
						break;
					}
					default:
						return data;
				}
			} catch (error: any) {
				if (error.name !== 'AbortError') {
					setError(error.message);
				}
			} finally {
				setLoading(false);
			}
		}

		getData(`${api.url + api.articles}`, 'articles');
		getData(`${api.url + api.tags}`, 'tags');

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
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={
							<MainPage
								api={api}
								articles={articles}
								articlesCount={articlesCount}
								tags={tags}
							/>
						}
					/>
					<Route
						path="/articles"
						element={
							<AllArticlesPage
								api={api}
								articles={articles}
								articlesCount={articlesCount}
								tags={tags}
							/>
						}
					/>
					<Route
						path="/articles/:slug"
						element={<ArticlePage api={api} articles={articles} />}
					/>
					<Route
						path="/profile"
						element={
							<ProfilePage
								api={api}
								articles={articles}
								articlesCount={articlesCount}
								tags={tags}
							/>
						}
					/>
					<Route
						path="/profile/:username"
						element={
							<AuthorPage
								api={api}
								articles={articles}
								articlesCount={articlesCount}
								tags={tags}
							/>
						}
					/>
					<Route
						path="/new_post"
						element={<NewPostPage api={api} tags={tags} />}
					/>
					<Route
						path="/settings"
						element={<SettingsPage api={api} />}
					/>
					<Route path="/sign_in" element={<SignInPage api={api} />} />
					<Route path="/sign_up" element={<SignUpPage api={api} />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
