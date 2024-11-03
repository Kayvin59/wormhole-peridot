import { useNavigate } from "react-router-dom";
import { conc, scrollToAnchor } from "../../../lib/wrapper/html.js";
import Link from "./Link.js";

export default function InternalLink({link, children, isUnstyled, isButton, otherClasses, additionalClasses, activeClasses, onClick}) {
	const currentPath = window.location.pathname;

	const activeStyles = currentPath === link ? activeClasses : undefined;
	let otherStyles = undefined;

	if (otherClasses !== undefined) {
		otherStyles = conc(otherClasses, activeStyles);
	}

	const navigate = useNavigate();

	// ---- FUNCTIONS (CLICK HANDLERS) ----

	function handleRouteChange(event) {
		event.preventDefault();

		let newPath = link.split("#")[0];

		if (onClick !== undefined) {
			onClick();
		}

		navigate(link);

		if (currentPath === newPath) {
			scrollToAnchor();
		}
	}

	return (
		<Link link={link} isUnstyled={isUnstyled} isButton={isButton} otherClasses={otherStyles} additionalClasses={additionalClasses} onClick={event => handleRouteChange(event)}>
			{children}
		</Link>
	);
}