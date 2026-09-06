import './Button.scss';
import { Link } from 'react-router-dom';

interface Props {
	text: string,
	icon?: string
}

function Button(props: Props) {
	return (
		<Link to="#" className="button button--small button--secondary">
			{props.icon && (
				<span className="material-icons button__icon">{props.icon}</span>
			)}
			<span className="button__text">{props.text}</span>
		</Link>
	);
}

export  default Button;