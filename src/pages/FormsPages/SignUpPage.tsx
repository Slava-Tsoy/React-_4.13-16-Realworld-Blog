import './Forms.scss';

import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';

import Panel from '../../components/Panel';
import Copyright from '../../components/Copyright';

interface Props {
	api: any;
}

function SignUpPage(props: Props) {
	const { setUser } = useAuth();
	const { register, handleSubmit, getValues, formState } = useForm({
		mode: 'onChange',
	});
	const errors = formState.errors;
	const fetch_url = props.api.url + props.api.users;
	const navigate = useNavigate();

	const onSubmit = async (data: any) => {
		const { repeatPassword, ...obj_data } = data;

		try {
			const res = await fetch(fetch_url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ user: obj_data }),
			});

			if (res.ok) {
				alert('Registration successful!');
			}

			const { user } = await res.json();
			localStorage.setItem('token', user.token);
			setUser(user);
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
					<h1 className="form__title">Sign Up</h1>
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
									required: 'Username is required',
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
						<div
							className={clsx('form__field', {
								'form__field--error':
									errors.repeatPassword?.type === 'required',
							})}
						>
							<input
								type="password"
								placeholder="Repeat Password"
								autoComplete="off"
								{...register('repeatPassword', {
									required: 'Repeat password',
									validate: (value) =>
										value === getValues('password') ||
										'Passwords do not match',
								})}
							/>
							{typeof errors.repeatPassword?.message ===
								'string' && (
								<span className="form__error-message">
									{errors.repeatPassword.message}
								</span>
							)}
						</div>
						<div className="form__button">
							<button type="submit">Sign Up</button>
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

export default SignUpPage;
