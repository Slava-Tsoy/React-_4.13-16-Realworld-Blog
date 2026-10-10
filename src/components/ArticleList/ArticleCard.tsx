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
	addToFavorites: any;
	favorited: any;
	favoritesCount: any;
}

function ArticleCard(props: Props) {
	const token = localStorage.getItem('token');

	const [loading, setLoading] = useState(false);

	const { api, item, itemUrl, tagsUrl, addToFavorites } = props;
	const { author, createdAt, slug } = item;

	const [isFavorited, setIsFavorited] = useState(props.favorited);
	const [favoritesCount, setFavoritesCount] = useState(props.favoritesCount);
	const fetch_favorite = `${api.url + api.articles}/${slug}/favorite`;

	async function handleFavorite() {
		const method = isFavorited ? 'DELETE' : 'POST';

		try {
			setLoading(true);

			const res = await fetch(fetch_favorite, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
			});

			if (res.ok) {
				setIsFavorited(!isFavorited);
			} else {
				console.error('Server error when changing favorite status');
			}

			const { article } = await res.json();
			const { slug, favorited, favoritesCount } = article;
			const favorite_article = { slug, favorited, favoritesCount };

			setIsFavorited(favorited);
			setFavoritesCount(favoritesCount);
			addToFavorites(favorite_article);
		} catch (error: any) {
			console.error('Network error:', error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<article className="article-card">
			<div className="article-card-head">
				<Badge
					author={author.username}
					date={format(parseISO(createdAt), 'dd MMMM yyyy')}
				/>
				{token && (
					<Button
						href="#"
						text={loading ? '...' : favoritesCount}
						small={true}
						type={isFavorited ? 'warning' : 'secondary'}
						icon="favorite"
						onClick={handleFavorite}
					/>
				)}
			</div>
			<div className="article-card__content">
				<h2 className="article-card__title">
					<Link to={`${itemUrl}/${slug}`} state={{ data: item }}>
						{item.title}
					</Link>
				</h2>
				<div className="article-card__text">{item.description}</div>
			</div>
			{item.tagList.length !== 0 && (
				<Tags api={api} items={item.tagList} tagsUrl={tagsUrl} />
			)}
		</article>
	);
}

export default ArticleCard;
