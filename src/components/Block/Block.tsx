import './Block.scss';
import Tags from '../Tags';

interface Props {
	items: any,
	tagsUrl: string
}

function Block(props: Props) {
	return (
		<div className="block">
			<div className="block__title">Popular tags</div>
			<Tags items={props.items} tagsUrl={props.tagsUrl} />
		</div>
	);
}

export default Block;
