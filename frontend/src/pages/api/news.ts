import { xml2json } from "xml-js";

export async function fetchNews(topic: string, date: string, country: string) {
	const dateQuery = date ? `+when:${date}` : "";
	const query = `${topic}${dateQuery}&hl=${country}&gl=${country}&ceid=${country}:en`;

	const response = await fetch(`https://news.google.com/rss/search?q=${query}`);

	const text = await response.text();
	const json = JSON.parse(xml2json(text, { compact: true }));
	return json.rss.channel.item || [];
}

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { topic = "technology", date = "", country = "US" } = req.query;

	const news = await fetchNews(
		topic as string,
		date as string,
		country as string,
	);

	res.status(200).json(news);
}
