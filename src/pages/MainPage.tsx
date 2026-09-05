import { useState, useEffect } from 'react';

import Preloader from '../components/Preloader';
import Panel from '../components/Panel';

function MainPage() {
	const [loading, setLoading] = useState(true);
	const api = {
		url: 'https://realworld.habsida.net/api',
		offset: '?iffset='
	};

	useEffect(() => {
		fetch(api.url + '/articles')
		.then((res: Response) => res.json())
		.then((data: any) => {
			console.log(data.articles, data.articlesCount);
			setLoading(false);
		})
		.catch((error) => {
			console.error(error);
			setLoading(false);
		});
	}, [api.url]);

	if (loading) {
		return (
			<Preloader />
		);
	}

	return (
		<>
			<header>
				<Panel />
			</header>
			<div>content text</div>
		</>
	);
}

export default MainPage;