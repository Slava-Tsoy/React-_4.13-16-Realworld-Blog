import './Forms.scss';

import { Link } from 'react-router-dom';

import Panel from '../../components/Panel';
import Copyright from '../../components/Copyright';

interface Props {
	api: any;
}

function SettingsPage(props: Props) {
	return (
		<>
			<header className="header">
				<Panel api={props.api} />
			</header>
			<main className="main">
				<form action={props.api.url} className="form">
					<h1 className="form__title">Your Settings</h1>
					<fieldset className="form-fieldset">
						<div className="form__field">
							<input type="text" placeholder="Username" />
						</div>
						<div className="form__field">
							<input type="email" placeholder="Email address" />
						</div>
						<div className="form__field">
							<textarea
								rows={5}
								placeholder="Input your bio"
							></textarea>
						</div>
						<div className="form__field">
							<input
								type="url"
								placeholder="Avatar image (URL)"
							/>
						</div>
						<div className="form__field">
							<input type="password" placeholder="Password" />
						</div>
						<div className="form__button">
							<button type="submit">Update Settings</button>
						</div>
						<div className="form-container">
							<Link
								to="#logout"
								className="button button--small button--warning"
								onClick={(e) => {
									e.preventDefault();
								}}
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
