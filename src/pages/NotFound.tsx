import { Link } from 'react-router-dom';

function NotFound() {
	return (
		<div className="page_not_found">
			<div className="page_not_found__title">404 - Page Not Found</div>
			<div className="page_not_found__text">
				The page you are looking for does not exist.
			</div>
			<div className="page_not_found__text">
				Return to <Link to="/">home page</Link>
			</div>
		</div>
	);
}

export default NotFound;
