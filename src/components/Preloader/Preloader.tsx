import './Preloader.scss';

function Preloader() {
	return (
		<div className="preloader">
			<div className="material-icons preloader__icon">refresh</div>
			<div className="preloader__text">loading</div>
		</div>
	);
}

export default Preloader;
