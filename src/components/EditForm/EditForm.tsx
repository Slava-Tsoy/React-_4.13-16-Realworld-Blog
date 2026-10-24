import './EditForm.scss';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

import Tags from '../Tags';

interface Props {
	api: any;
	data: any;
	tags: any;
	close: any;
}

function EditForm(props: Props) {
	const token = localStorage.getItem('token');

	const { api, data, tags, close } = props;
	const { slug, title, description, body, tagList } = data;
	const [selectedTags, setSelectedTags] = useState(tagList);
	const { register, handleSubmit, formState, setValue } = useForm({
		mode: 'onChange',
		defaultValues: {
			title: title,
			description: description,
			body: body,
			tagList: selectedTags,
		},
	});
	const { errors } = formState;
	const navigate = useNavigate();

	const fetch_article = `${api.url + api.articles}/${slug}`;

	useEffect(() => {
		setValue('tagList', selectedTags);
	}, [selectedTags, setValue]);

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

	async function updatePost(formData: any) {
		const updatedPost = { article: formData };

		try {
			const res = await fetch(fetch_article, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
				body: JSON.stringify(updatedPost),
			});

			if (res.ok) {
				alert('The article has been successfully updated.');
			}

			const { article } = await res.json();

			navigate(`${api.articles}/${article.slug}`, {
				state: {
					data: { ...article },
				},
			});
			close();
		} catch (error) {
			console.error('Update error:', error);
		}
	}

	const handleClose = () => {
		close();
	};

	return (
		<div className="form-modal-wrapper">
			<div className="form-modal-window">
				<div className="form-modal__header">
					<div className="form-modal__title">
						Editing post "{data.slug}"
					</div>
					<div
						className="material-icons form-modal__close"
						onClick={handleClose}
					>
						close
					</div>
				</div>
				<div className="form-modal-container">
					<form
						action={props.api.url}
						className="edit-form"
						onSubmit={handleSubmit(updatePost)}
					>
						<fieldset className="edit-form-fieldset">
							<div
								className={clsx('edit-form__field', {
									'edit-form__field--error':
										errors.title?.type === 'required',
								})}
							>
								<input
									type="text"
									placeholder="Title"
									{...register('title')}
								/>
								{typeof errors.title?.message === 'string' && (
									<span className="edit-form__error-message">
										{errors.title.message}
									</span>
								)}
							</div>
							<div
								className={clsx('edit-form__field', {
									'edit-form__field--error':
										errors.description?.type === 'required',
								})}
							>
								<input
									type="text"
									placeholder="Short description"
									{...register('description')}
								/>
								{typeof errors.description?.message ===
									'string' && (
									<span className="edit-form__error-message">
										{errors.description.message}
									</span>
								)}
							</div>
							<div
								className={clsx('edit-form__field', {
									'edit-form__field--error':
										errors.body?.type === 'required',
								})}
							>
								<textarea
									rows={5}
									placeholder="Input your text"
									{...register('body')}
								></textarea>
								{typeof errors.body?.message === 'string' && (
									<span className="edit-form__error-message">
										{errors.body.message}
									</span>
								)}
							</div>
							<div
								className="edit-form__field edit-form__field--tags"
								onClickCapture={clickTag}
							>
								<input type="hidden" {...register('tagList')} />
								<Tags
									api={api}
									items={tags}
									tagsUrl={api.tags}
									selectedItems={selectedTags}
								/>
							</div>
							<div className="edit-form__button">
								<button type="submit">Update Post</button>
							</div>
						</fieldset>
					</form>
				</div>
			</div>
		</div>
	);
}

export default EditForm;
