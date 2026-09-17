import './Forms.scss';

import Panel from '../../components/Panel';
import Copyright from '../../components/Copyright';

interface Props {
	api: any;
}

function SignInPage(props: Props) {
	return (
		<>
			<header className="header">
				<Panel />
			</header>
			<main className="main">
				<form action={props.api.url} className="form">
					<h1 className="form__title">Sign In</h1>
					<fieldset className="form-fieldset">
						<div className="form__field">
							<input type="text" placeholder="Username" />
						</div>
						<div className="form__field">
							<input type="password" placeholder="Password" />
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
		</>
	);
}

export default SignInPage;
