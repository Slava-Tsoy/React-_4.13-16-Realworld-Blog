import { Link } from 'react-router-dom';

function ErrorPage() {
	return (
		<div className="page_not_found">
			<div className="page_not_found__title">500 - Internal Server Error</div>
			<div className="page_not_found__text">Return to <Link to="/">home page</Link></div>
		</div>
	);
}

export default ErrorPage;