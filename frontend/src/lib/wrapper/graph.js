import { toDateString } from "../helper.js";
import { getGraphData } from "../api/backend.js";

export async function getPerfectGraphData(category, token, timeframe) {
	let data = await getGraphData(category, token);
	let resultData = [];

	if (data !== undefined) {
		let filteredData = getFilteredGraphData(data, timeframe);
		let formattedData = getFormattedGraphData(filteredData, timeframe);
	
		resultData = formattedData;
	}

	return resultData;
}

function getFilteredGraphData(data, timeframe) {
	let filteredData = undefined;

	if (timeframe !== undefined) {
		let days = Date.now() - (timeframe * 24 * 60 * 60 * 1000);

		filteredData = data.filter(item => {
			return (new Date(item.time)) > days;
		});
	} else {
		filteredData = data;
	}

	return filteredData;
}

function getFormattedGraphData(data, timeframe) {
	let formattedData = data.map(item => {
		item.time = toDateString(item.time).replace(",", "").slice(0, -3);

		return item;
	}).filter(item => {
		let condition = undefined;

		let time = item.time.split(" ")[1];
		let timeArray = time.split(":");
		let hours = timeArray[0];
		let minutes = timeArray[1];

		if (timeframe === 1) {
			condition = minutes === "00" || minutes === "30";
		} else if (timeframe === 7) {
			condition = (parseInt(hours) % 2 === 0) && (minutes === "00");
		} else if (timeframe === 30) {
			condition = (parseInt(hours) % 4 === 0) && (minutes === "00");
		} else {
			condition = time === "00:00";
		}

		return condition;
	});

	return formattedData;
}