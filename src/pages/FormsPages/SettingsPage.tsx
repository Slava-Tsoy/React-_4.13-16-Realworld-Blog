import './Forms.scss';

import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';

import Panel from '../../components/Panel';
import Copyright from '../../components/Copyright';

interface Props {
	api: any;
}

function SettingsPage(props: Props) {
	const token = localStorage.getItem('token');

	const { user, login, logout } = useAuth();
	const navigate = useNavigate();
	const { register, handleSubmit, formState: { errors } } = useForm({
		mode: 'onChange',
		defaultValues: {
			username: user.username,
			email: user.email,
			bio: '',
			image: '',
			password: '',
		},
	});
	const fetch_url = `${props.api.url + props.api.user}`;
	
	const handleLogout = (e: any) => {
		e.preventDefault();

		const confirmed = window.confirm(
			`Are you sure you want to logout?`,
		);

		if (!confirmed) {
			return;
		}
		
		logout();
		navigate('/');
	};

	const updateUser = async (formData: any) => {
		try {
			const res = await fetch(fetch_url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
				body: JSON.stringify({ user: formData }),
			});

			if (res.ok) {
				alert('Your account updated successful!');
			}

			const data = await res.json();
			const updatedUser = data.user;
			
			login(updatedUser);
			navigate('/');
		} catch (error) {
			console.error('Sending error:', error);
		}
	};

	return (
		<>
			<header className="header">
				<Panel />
			</header>
			<main className="main">
				<form action={fetch_url} className="form" onSubmit={handleSubmit(updateUser)}>
					<h1 className="form__title">Your Settings</h1>
					<fieldset className="form-fieldset">
						<div
							className={clsx('form__field', {
								'form__field--error':
									errors.username?.type === 'required',
							})}
						>
							<input
								type="text"
								placeholder="Username"
								autoComplete="off"
								{...register('username', {
									minLength: {
										value: 5,
										message: 'Minimum 5 characters',
									},
								})}
							/>
							{typeof errors.username?.message === 'string' && (
								<span className="form__error-message">
									{errors.username.message}
								</span>
							)}
						</div>
						<div
							className={clsx('form__field', {
								'form__field--error':
									errors.email?.type === 'required',
							})}
						>
							<input
								type="email"
								placeholder="Email address"
								autoComplete="off"
								{...register('email', {
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: 'Invalid email format',
									},
								})}
							/>
							{typeof errors.email?.message === 'string' && (
								<span className="form__error-message">
									{errors.email.message}
								</span>
							)}
						</div>
						<div
							className={clsx('form__field', {
								'form__field--error':
									errors.bio?.type === 'required',
							})}
						>
							<textarea
								rows={5}
								placeholder="Input your bio"
								{...register('bio')}
							></textarea>
							{typeof errors.bio?.message === 'string' && (
								<span className="form__error-message">
									{errors.bio.message}
								</span>
							)}
						</div>
						<div
							className={clsx('form__field', {
								'form__field--error':
									errors.image?.type === 'required',
							})}
						>
							<input
								type="url"
								placeholder="Avatar image (URL)"
								autoComplete="off"
								{...register('image')}
							/>
							{typeof errors.image?.message === 'string' && (
								<span className="form__error-message">
									{errors.image.message}
								</span>
							)}
						</div>
						<div
							className={clsx('form__field', {
								'form__field--error':
									errors.password?.type === 'required',
							})}
						>
							<input
								type="password"
								placeholder="Password"
								autoComplete="off"
								{...register('password', {
									minLength: {
										value: 6,
										message:
											'The password must be at least 6 characters long',
									},
								})}
							/>
							{typeof errors.password?.message === 'string' && (
								<span className="form__error-message">
									{errors.password.message}
								</span>
							)}
						</div>
						<div className="form__button">
							<button type="submit">Update Settings</button>
						</div>
						<div className="form-container">
							<Link
								to="#logout"
								className="button button--small button--warning"
								onClick={handleLogout}
							>
								<span className="button__text">
									Or click here to logout
								</span>
							</Link>
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

export default SettingsPage;
