import { createContext, useState, useEffect } from "react";

export const WindowWidthContext = createContext();

export function WindowWidthProvider({children}) {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	// ---- HOOKS ----

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<WindowWidthContext.Provider value={windowWidth}>
			{children}
		</WindowWidthContext.Provider>
	);
}
