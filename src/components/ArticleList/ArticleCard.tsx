import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

import Tags from '../Tags';
import Badge from '../Badge';
import Button from '../Button';

interface Props {
	api: any;
	item: any;
	itemUrl: string;
	tagsUrl: string;
}

function ArticleCard(props: Props) {
	const token = localStorage.getItem('token');
	const [author, created] = [props.item.author, props.item.createdAt];
	const [item, setItem] = useState(props.item);
	const [favoritesCount, setFavoritesCount] = useState(item.favoritesCount);
	const [favorite, setFavorite] = useState(false);
	const fetch_favorite =
		props.api.url +
		props.api.articles +
		`/${item.slug}` +
		props.api.favorite;

	async function toggleFavorite() {
		const method =
			!favorite && favoritesCount === 1
				? 'DELETE'
				: favorite
					? 'DELETE'
					: 'POST';

		try {
			const res = await fetch(fetch_favorite, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
			});

			if (res.ok) {
				setFavorite(!favorite);
			} else {
				console.error('Server error when changing subscription status');
			}

			const { article } = await res.json();
			setFavoritesCount(article.favoritesCount);
			setItem(article);
		} catch (error) {
			console.error('Network error:', error);
		}
	}

	return (
		<article className="article-card">
			<div className="article-card-head">
				<Badge
					author={author.username}
					date={format(parseISO(created), 'dd MMMM yyyy')}
				/>
				{token && (
					<Button
						href="#"
						text={favoritesCount}
						small={true}
						type="secondary"
						icon="favorite"
						onClick={toggleFavorite}
					/>
				)}
			</div>
			<div className="article-card__content">
				<h2 className="article-card__title">
					<Link
						to={props.itemUrl + '/' + item.slug}
						state={{ data: item }}
					>
						{item.title}
					</Link>
				</h2>
				<div className="article-card__text">{item.description}</div>
			</div>
			{item.tagList.length !== 0 && (
				<Tags items={item.tagList} tagsUrl={props.tagsUrl} />
			)}
		</article>
	);
}

export default ArticleCard;
