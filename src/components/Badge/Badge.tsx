import './Badge.scss';
import { Link } from 'react-router-dom';

interface Props {
	author: string;
	date: string;
	own: boolean;
}

function Badge(props: Props) {
	const { author, date, own } = props;
	const page_url = own ? `/profile` : `/profile/${props.author}`;

	return (
		<div className="badge">
			<div className="material-icons badge__icon">person</div>
			<div className="badge__person">
				<div className="badge__name">
					<Link to={page_url}>{author}</Link>
				</div>
				<div className="badge__date">{date}</div>
			</div>
		</div>
	);
}

export default Badge;
