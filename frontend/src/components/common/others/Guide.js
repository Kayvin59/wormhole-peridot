import { FaAngleDoubleRight } from "react-icons/fa";
import styles from "./Guide.module.scss";

export default function Guide({children}) {
	const newChildren = children.flatMap((item, index) => {
		return [
			<div key={index}>{item}</div>,
			<div key={index + children.length}><FaAngleDoubleRight/></div>
		];
	});

	newChildren.pop();

	return (
		<div className={styles.container}>
			{newChildren}
		</div>
	);
}
