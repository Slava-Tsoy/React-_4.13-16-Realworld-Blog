import './ModalWindow.scss';

interface Props {
	data: any;
	close: any;
}

function ModalWindow(props: Props) {
	const { header, body } = props.data;

	const handleClose = () => {
		props.close();
	};

	return (
		<div className="modal-wrapper">
			<div className="modal-window">
				<div className="modal-window__header">
					<div className="modal-window__title">{header}</div>
					<div
						className="material-icons modal-window__close"
						onClick={handleClose}
					>
						close
					</div>
				</div>
				<div className="modal-window__body">{body}</div>
			</div>
		</div>
	);
}

export default ModalWindow;
