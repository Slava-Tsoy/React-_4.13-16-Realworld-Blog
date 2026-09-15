import './Pagination.scss';
import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';

interface Props {
	offset: string;
	amountPerPage: number;
	articlesCount: number;
	limit: number;
}

function Pagination(props: Props) {
	const [searchParams, setSearchParams] = useSearchParams();
	const currentOffset = parseInt(searchParams.get('offset') || '0', 10);

	if (props.articlesCount <= props.limit) {
		return null;
	}

	const changePage = (dir?: string) => {
		let newOffset = currentOffset;

		switch (dir) {
			case 'next':
				if (currentOffset + props.amountPerPage < props.articlesCount) {
					newOffset = currentOffset + props.amountPerPage;
				}
				break;
			case 'prev':
				newOffset = Math.max(0, currentOffset - props.amountPerPage);
				break;
		}

		searchParams.set('offset', newOffset.toString());
		setSearchParams(searchParams);
	};

	const currentPage = Math.floor(currentOffset / props.amountPerPage) + 1;
	const totalPages = Math.ceil(props.articlesCount / props.amountPerPage);

	const getPagesRange = () => {
		const range: any = [];

		if (totalPages <= props.limit) {
			for (let i = 1; i <= totalPages; i++) {
				range.push(i);
			}

			return range;
		}

		if (currentPage <= props.limit) {
			for (let i = 1; i <= props.limit; i++) {
				range.push(i);
			}

			range.push('...');
			range.push(totalPages);
		} else {
			range.push(1, 2, 3, 4, 5, '...');

			if (currentPage < totalPages) {
				range.push(currentPage);
			}

			range.push(totalPages);
		}

		return range;
	};

	const pages = getPagesRange();

	return (
		<nav className="pagination">
			<ul className="pagination__list">
				<li className="pagination__item">
					<Link
						to="#"
						className={clsx(
							'material-icons',
							'pagination__link',
							'pagination__link--arrow',
						)}
						onClick={(e: any) => {
							e.preventDefault();
							changePage('prev');
						}}
					>
						arrow_left
					</Link>
				</li>
				{pages.map((i: number) => (
					<li className="pagination__item" key={i}>
						{typeof i === 'string' ? (
							<span className={clsx('pagination__link')}>
								...
							</span>
						) : i === currentPage ? (
							<span
								className={clsx(
									'pagination__link',
									'pagination__link--active',
								)}
							>
								{i}
							</span>
						) : (
							<Link
								to={
									props.offset + (i - 1) * props.amountPerPage
								}
								className={clsx('pagination__link')}
								onClick={() => {
									changePage();
								}}
							>
								{i}
							</Link>
						)}
					</li>
				))}
				<li className="pagination__item">
					<Link
						to="#"
						className={clsx(
							'material-icons',
							'pagination__link',
							'pagination__link--arrow',
						)}
						onClick={(e: any) => {
							e.preventDefault();
							changePage('next');
						}}
					>
						arrow_right
					</Link>
				</li>
			</ul>
		</nav>
	);
}

export default Pagination;
