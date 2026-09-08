import './Button.scss';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface Props {
	text: string,
	small: boolean,
	type: string,
	icon?: string,
	href?: string,
}

function Button(props: Props) {
	return (
		<Link to={props.href ? props.href : '#'} className={clsx('button', {'button--small' : props.small}, 'button--' + props.type)}>
			{props.icon && (
				<span className="material-icons button__icon">{props.icon}</span>
			)}
			<span className="button__text">{props.text}</span>
		</Link>
	);
}

export  default Button;