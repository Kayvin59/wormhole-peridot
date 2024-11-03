import SmoothCollapse from "react-smooth-collapse";

export default function CollapseDiv({isShowing, duration=1, children}) {
	return (
		<SmoothCollapse expanded={isShowing} eagerRender={true} heightTransition={duration + "s ease"}>
			<div>
				{children}
			</div>
		</SmoothCollapse>
	);
}