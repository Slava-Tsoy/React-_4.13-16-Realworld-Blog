import './Forms.scss';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

import Panel from '../../components/Panel';
import Tags from '../../components/Tags';
import Copyright from '../../components/Copyright';

interface Props {
	api: any;
	tags: any;
}

function NewPostPage(props: Props) {
	const token = localStorage.getItem('token');

	const { api, tags } = props;
	const [selectedTags, setSelectedTags] = useState([]);
	const { register, handleSubmit, formState, setValue } = useForm({
		mode: 'onChange',
	});
	const { errors } = formState;

	const fetch_articles = api.url + api.articles;
	const navigate = useNavigate();

	useEffect(() => {
		setValue('tagList', selectedTags);
	}, [setValue, selectedTags]);

	function toggleItems(newItem: string) {
		setSelectedTags((items: any) => {
			return items.includes(newItem)
				? items.filter((item: string) => item !== newItem)
				: [...items, newItem];
		});
	}

	function clickTag(e: any) {
		e.preventDefault();

		if (e.target.tagName !== 'A') {
			return;
		}

		const tagElem = e.target;
		const tagText = tagElem.innerText;

		tagElem.classList.toggle('tags__link--active');
		toggleItems(tagText);
	}

	async function createArticle(data: any) {
		const newPost = { article: data };

		try {
			const res = await fetch(fetch_articles, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
				body: JSON.stringify(newPost),
			});

			if (res.ok) {
				alert('The article has been successfully created.');
			}

			const { article } = await res.json();
			navigate(`${api.articles}/${article.slug}`);
		} catch (error) {
			console.error('Create error:', error);
		}
	}

	return (
		<>
			<header className="header">
				<Panel />
			</header>
			<main className="main">
				<form
					action={props.api.url}
					className="form"
					onSubmit={handleSubmit(createArticle)}
				>
					<h1 className="form__title">New Post</h1>
					<fieldset className="form-fieldset">
						<div
							className={clsx('form__field', {
								'form__field--error':
									errors.title?.type === 'required',
							})}
						>
							<input
								type="text"
								placeholder="Title"
								{...register('title', {
									required: 'Title is required',
								})}
							/>
							{typeof errors.title?.message === 'string' && (
								<span className="form__error-message">
									{errors.title.message}
								</span>
							)}
						</div>
						<div
							className={clsx('form__field', {
								'form__field--error':
									errors.description?.type === 'required',
							})}
						>
							<input
								type="text"
								placeholder="Short description"
								{...register('description', {
									required: 'Description is required',
								})}
							/>
							{typeof errors.description?.message ===
								'string' && (
								<span className="form__error-message">
									{errors.description.message}
								</span>
							)}
						</div>
						<div
							className={clsx('form__field', {
								'form__field--error':
									errors.body?.type === 'required',
							})}
						>
							<textarea
								rows={5}
								placeholder="Input your text"
								{...register('body', {
									required: 'Text is required',
								})}
							></textarea>
							{typeof errors.body?.message === 'string' && (
								<span className="form__error-message">
									{errors.body.message}
								</span>
							)}
						</div>
						<div
							className="form__field form__field--tags"
							onClickCapture={clickTag}
						>
							<input type="hidden" {...register('tagList')} />
							<Tags api={api} items={tags} tagsUrl={api.tags} />
						</div>
						<div className="form__button">
							<button type="submit">Publish Article</button>
						</div>
					</fieldset>
				</form>
			</main>
			<footer className="footer">
				<div className="footer-in main">
					<Copyright />
				</div>
			</footer>
		</>
	);
}

export default NewPostPage;
