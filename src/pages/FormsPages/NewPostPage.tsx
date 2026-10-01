import './Forms.scss';

import Panel from '../../components/Panel';
import Tags from '../../components/Tags';
import Copyright from '../../components/Copyright';

interface Props {
	api: any;
	tags: any;
}

function NewPostPage(props: Props) {
	return (
		<>
			<header className="header">
				<Panel />
			</header>
			<main className="main">
				<form action={props.api.url} className="form">
					<h1 className="form__title">New Post</h1>
					<fieldset className="form-fieldset">
						<div className="form__field">
							<input type="text" placeholder="Title" />
						</div>
						<div className="form__field">
							<input
								type="text"
								placeholder="Short description"
							/>
						</div>
						<div className="form__field">
							<textarea
								rows={5}
								placeholder="Input your text"
							></textarea>
						</div>
						<Tags items={props.tags} tagsUrl={props.api.tags} />
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
