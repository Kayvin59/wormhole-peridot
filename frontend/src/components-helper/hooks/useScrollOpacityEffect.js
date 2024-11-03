import { useState, useEffect } from "react";

export default function useScrollOpacityEffect() {
	const maxOpacity = 1;

	const [scrollOpacity, setScrollOpacity] = useState(maxOpacity);

	// ---- HOOKS ----

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// ---- FUNCTIONS ----

	function handleScroll() {
		const opacityRange = 1.5;
		const scrollPosition = window.scrollY;

		const calculatedOpacity = maxOpacity - (scrollPosition / window.innerHeight) * opacityRange;

		setScrollOpacity(calculatedOpacity);
	}

	return scrollOpacity;
}