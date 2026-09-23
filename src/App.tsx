import './App.scss';

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ErrorPage from './pages/ErrorPage';
import NotFound from './pages/NotFound';
import MainPage from './pages/MainPage';
import ArticlePage from './pages/ArticlePage';
import AllArticlesPage from './pages/AllArticlesPage';
import ProfilePage from './pages/ProfilePage';
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
};

function App() {
	const [articles, setArticles] = useState([]);
	const [articlesCount, setArticlesCount] = useState(0);
	const [tags, setTags] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const control = new AbortController();

		async function getData() {
			try {
				setLoading(true);

				const [articlesRes, tagsRes] = await Promise.all([
					fetch(api.url + api.articles, { signal: control.signal }),
					fetch(api.url + api.tags, { signal: control.signal }),
				]);

				if (!articlesRes.ok || !tagsRes.ok) {
					throw new Error('Failed to load data from the server');
				}

				const [articlesData, tagsData] = await Promise.all([
					articlesRes.json(),
					tagsRes.json(),
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
