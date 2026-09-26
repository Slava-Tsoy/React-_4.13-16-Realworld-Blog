import './Button.scss';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface Props {
	text: string;
	small: boolean;
	type: string;
	icon?: string;
	href?: string;
	onClick: any;
}

function Button(props: Props) {
	function handleClick(e: any) {
		e.preventDefault();
		props.onClick(e);
	}

	return (
		<Link
			to={props.href ? props.href : '#'}
			className={clsx(
				'button',
				{ 'button--small': props.small },
				'button--' + props.type,
			)}
			onClick={handleClick}
		>
			{props.icon && (
				<span className="material-icons button__icon">
					{props.icon}
				</span>
			)}
			<span className="button__text">{props.text}</span>
		</Link>
	);
}

export default Button;
