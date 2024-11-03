import { BalancesProvider } from "../../../components-helper/contexts/BalancesProvider.js";
import Main from "../../structure/Main.js";
import IFO from "./IFO.js";

export default function IFOContainer() {
	return (
		<Main>
			<BalancesProvider>
				<IFO/>
			</BalancesProvider>
		</Main>
	);
}