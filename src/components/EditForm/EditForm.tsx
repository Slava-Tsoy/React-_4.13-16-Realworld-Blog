import './EditForm.scss';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';

import Tags from '../Tags';

interface Props {
	api: any;
	data: any;
	tags: any;
	close: any;
}

function EditForm(props: Props) {
	const { api, data, tags, close } = props;
	const { title, description, body, tagList } = data;
	const [selectedTags, setSelectedTags] = useState(tagList);
	const { register, handleSubmit, formState, setValue, reset } = useForm({
		mode: 'onChange',
	});
	const { errors } = formState;

	useEffect(() => {
		reset({
			title: title,
			description: description,
			body: body,
		});
		setValue('tagList', selectedTags);
	}, [setValue, selectedTags, reset, title, description, body]);

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
									{...register('title', {
										required: 'Title is required',
									})}
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
									{...register('description', {
										required: 'Description is required',
									})}
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
									{...register('body', {
										required: 'Text is required',
									})}
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
