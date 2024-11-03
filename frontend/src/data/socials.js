import { projectName } from "./project.js";

const baseImagePath = "/images/socials/";

const socials = [
	{
		link: undefined,
		imagePath: baseImagePath + "zealy.svg",
		altText: projectName + "Zealy",
		color: "#000000"
	},
	{
		link: undefined,
		imagePath: baseImagePath + "discord.svg",
		altText: projectName + "Discord",
		color: "#5865f2"
	},
	{
		link: "https://t.me/peridotfin",
		imagePath: baseImagePath + "telegram.svg",
		altText: projectName + "Telegram",
		color: "#25a3e2"
	},
	{
		link: "https://x.com/peridotprotocol",
		imagePath: baseImagePath + "x.svg",
		altText: projectName + "X (Twitter)",
		color: "#1D9BF0"
	},
	{
		link: undefined,
		imagePath: baseImagePath + "medium.svg",
		altText: projectName + "Medium",
		color: "#000000"
	},
	{
		link: undefined,
		imagePath: baseImagePath + "coingecko.svg",
		altText: projectName + "Coingecko",
		color: "#8bc53f"
	},
	{
		link: "https://peridot-finance.gitbook.io/peridot-protocol",
		imagePath: baseImagePath + "gitbook.svg",
		altText: projectName + "GitBook",
		color: "#000000"
	}
];

export function getSocials() {
	return socials.filter(social => social.link !== undefined);
}