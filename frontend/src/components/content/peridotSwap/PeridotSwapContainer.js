import { BalancesProvider } from "../../../components-helper/contexts/BalancesProvider.js";
import Main from "../../structure/Main.js";
import PeridotSwap from "./PeridotSwap.js";

export default function PeridotSwapContainer() {
	return (
		<Main>
			<BalancesProvider>
				<PeridotSwap/>
			</BalancesProvider>
		</Main>
	);
}