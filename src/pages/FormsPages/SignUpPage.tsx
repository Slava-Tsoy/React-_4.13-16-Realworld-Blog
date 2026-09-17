import './Forms.scss';

import Panel from '../../components/Panel';
import Copyright from '../../components/Copyright';

interface Props {
	api: any;
}

function SignUpPage(props: Props) {
	return (
		<>
			<header className="header">
				<Panel />
			</header>
			<main className="main">
				<form action={props.api.url} className="form">
					<h1 className="form__title">Sign Up</h1>
					<fieldset className="form-fieldset">
						<div className="form__field">
							<input type="text" placeholder="Username" />
						</div>
						<div className="form__field">
							<input type="email" placeholder="Email address" />
						</div>
						<div className="form__field">
							<input type="password" placeholder="Password" />
						</div>
						<div className="form__field">
							<input
								type="password"
								placeholder="Repeat Password"
							/>
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
