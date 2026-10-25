import './ArticleList.scss';

import { useState } from 'react';
import { useAuth } from '../../Hooks/useAuth';

import ArticleCard from './ArticleCard';

interface Props {
	api: any;
	items: any;
	articlesUrl: string;
	tagsUrl: string;
}

function ArticleList(props: Props) {
	const { api, items, articlesUrl, tagsUrl } = props;

	const { user } = useAuth();
	const [favorites, setFavorites] = useState(getFavorites());

	function getLocalUser(key: string) {
		const value: any = localStorage.getItem(key);

		return !value ? user : JSON.parse(value);
	}

	function getFavorites() {
		const value: any = localStorage.getItem(user?.username);
		const localUser = JSON.parse(value);

		if (localUser && localUser.favorites) {
			return localUser.favorites;
		}

		return [];
	}

	function getSaveFavorites(items: any, newItem: any) {
		const itemExist = items.some((item: any) => {
			return item.slug === newItem.slug;
		});

		if (itemExist) {
			return items.map((item: any) => {
				return item.slug === newItem.slug
					? { ...item, ...newItem }
					: item;
			});
		} else {
			return [...items, newItem];
		}
	}

	function addToFavorites(article: any) {
		const favorite_list = getSaveFavorites(favorites, article);
		const localUser = getLocalUser(user?.username);
		const updatedUser = { ...localUser, favorites: favorite_list };

		setFavorites(favorite_list);

		localStorage.setItem(user?.username, JSON.stringify(updatedUser));
	}

	function getItemExist(items: any, slug: string) {
		return items.find((item: any) => {
			return item.slug === slug;
		});
	}

	return (
		<section className="article-list">
			{items.map((e: any, key: number) => {
				const itemExist = getItemExist(favorites, e.slug);

				return (
					<ArticleCard
						api={api}
						key={key}
						item={e}
						itemUrl={articlesUrl}
						tagsUrl={tagsUrl}
						addToFavorites={addToFavorites}
						favorited={
							!itemExist ? e.favorited : itemExist.favorited
						}
						favoritesCount={e.favoritesCount}
					/>
				);
			})}
		</section>
	);
}

export default ArticleList;
