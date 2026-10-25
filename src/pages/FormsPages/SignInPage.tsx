import './Forms.scss';

import { useState } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';

import Panel from '../../components/Panel';
import Copyright from '../../components/Copyright';
import ModalWindow from '../../components/ModalWindow';

interface Props {
	api: any;
}

function SignInPage(props: Props) {
	const { login } = useAuth();
	const { register, handleSubmit, formState } = useForm({
		mode: 'onChange',
	});
	const errors = formState.errors;
	const fetch_url = props.api.url + props.api.users + props.api.login;
	const navigate = useNavigate();

	const [errorAuth, setErrorAuth] = useState(false);
	const [errorData, setErrorData] = useState(null);

	const closeModalWindow = () => {
		setErrorAuth(false);
	};

	const onSubmit = async (data: any) => {
		try {
			const res = await fetch(fetch_url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ user: data }),
			});

			if (res.status === 401) {
				const errData: any = {
					header: 'Authentication error!',
					body: (
						<>
							Check that the entered data is correct or{' '}
							<a href="/sign_up">register</a>.
						</>
					),
				};

				setErrorData(errData);
				setErrorAuth(true);

				return;
			}

			if (res.ok) {
				alert('Login successful!');
			}

			const { user } = await res.json();
			login(user);
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
				<form
					action={fetch_url}
					className="form"
					onSubmit={handleSubmit(onSubmit)}
				>
					<h1 className="form__title">Sign In</h1>
					<fieldset className="form-fieldset">
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
									required: 'Email is required',
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
									errors.password?.type === 'required',
							})}
						>
							<input
								type="password"
								placeholder="Password"
								autoComplete="off"
								{...register('password', {
									required: 'Password is required',
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
							<button type="submit">Sign In</button>
						</div>
					</fieldset>
				</form>
			</main>
			<footer className="footer">
				<div className="footer-in main">
					<Copyright />
				</div>
			</footer>
			{errorAuth && (
				<ModalWindow data={errorData} close={closeModalWindow} />
			)}
		</>
	);
}

export default SignInPage;
