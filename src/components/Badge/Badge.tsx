import './Badge.scss';
import { Link } from 'react-router-dom';

interface Props {
	author: string;
	date: string;
}

function Badge(props: Props) {
	return (
		<div className="badge">
			<div className="material-icons badge__icon">person</div>
			<div className="badge__person">
				<div className="badge__name">
					<Link to={`/profile/${props.author}`}>{props.author}</Link>
				</div>
				<div className="badge__date">{props.date}</div>
			</div>
		</div>
	);
}

export default Badge;
