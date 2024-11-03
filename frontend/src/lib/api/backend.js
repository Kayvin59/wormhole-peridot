const baseUrl = process.env.REACT_APP_BACKEND_URL;

// ---- DATA ----

export async function getData() {
	let urlPart = "/data";

	return request(urlPart);
}

// ---- GRAPHS ----

export async function getGraphData(category, token) {
	let urlPart = "/graphs/" + token.chain.nameId.toLowerCase() + "/" + category + "/" + token.contract;

	return request(urlPart).catch(() => {
		return undefined;
	});
}

// ---- REQUESTS ----

async function request(urlPart, jsonBody) {
	let url = baseUrl + urlPart;
	let options = {
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
		mode: "cors"
	};

	if (jsonBody) {
		options.body = JSON.stringify(jsonBody);
		options.method = "POST";
	} else {
		options.method = "GET";
	}

	return fetch(url, options).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			throw new Error("Request is not OK");
		}
	});
}
