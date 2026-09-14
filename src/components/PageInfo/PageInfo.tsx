import './PageInfo.scss';
import { Link } from 'react-router-dom';

function PageInfo() {
	return (
		<div className="page-intro">
			<div className="page-intro-in main">
				<h1>
					<Link to="/">Realworld Blog</Link>
				</h1>
				<p>A place to share your knowledge.</p>
			</div>
		</div>
	);
}

export default PageInfo;
