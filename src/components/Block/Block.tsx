import './Block.scss';
import Tags from '../Tags';

interface Props {
	api: any;
	items: any;
	tagsUrl: string;
}

function Block(props: Props) {
	return (
		<div className="block">
			<div className="block__title">Popular tags</div>
			<Tags api={props.api} items={props.items} tagsUrl={props.tagsUrl} />
		</div>
	);
}

export default Block;
