import Link from "./Link.js";

export default function ExternalLink({link, children, isUnstyled, isButton, otherClasses, additionalClasses}) {
	return (
		<Link link={link} isUnstyled={isUnstyled} isButton={isButton} otherClasses={otherClasses} additionalClasses={additionalClasses}>
			{children}
		</Link>
	);
}