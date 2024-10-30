import localFont from "next/font/local";
import type { New } from "@/types";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { addToCache, getFromCache, isCached } from "@/lib/cache";
import { Frown, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useDebounceValue } from "usehooks-ts";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

interface Props {
	initialNews: New[];
}

export default function Home({ initialNews }: Props) {
	const [news, setNews] = useState(initialNews);
	const [isLoading, setIsLoading] = useState(false);
	const [topic, setTopic] = useDebounceValue("", 500);
	const [date, setDate] = useDebounceValue("", 500);
	const [country, setCountry] = useDebounceValue("", 500);

	const fetchFilteredNews = async () => {
		try {
			const query = new URLSearchParams({
				topic: topic || "technology",
				date: date,
				country: country || "US",
			}).toString();

			if (isCached(query)) {
				setNews(getFromCache(query) as New[]);
				return;
			}
			setIsLoading(true);
			const res = await fetch(`/api/news?${query}`);
			const data = await res.json();

			addToCache(query, data);
			setNews(data);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchFilteredNews();
	}, [topic, date, country]);
	return (
		<div
			className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)] justify-center mx-auto max-w-screen-lg items-center my-20 gap-6 flex flex-col`}
		>
			<h1 className="text-3xl font-semibold">Google News!</h1>
			<div className="flex gap-4 max-lg:flex-wrap items-center w-full max-w-4xl mx-auto justify-center">
				<Input
					type="text"
					placeholder="Topic"
					onChange={(e) => {
						setTopic(e.target.value);
					}}
				/>
				<Input
					type="text"
					placeholder="Date"
					onChange={(e) => {
						setDate(e.target.value);
					}}
				/>
				<Input
					type="text"
					placeholder="Country"
					onChange={(e) => {
						setCountry(e.target.value);
					}}
				/>
			</div>
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-4xl px-4">
				{isLoading ? (
					<div className="justify-center mx-auto w-full flex items-center gap-4 min-h-[55vh]">
						<span className="text-xl font-medium">Loading...</span>
						<RefreshCcw className="animate-spin size-5" />
					</div>
				) : (
					<div className="flex flex-col gap-4 w-full">
						{news?.length === 0 ? (
							<div className="flex flex-row gap-2 w-full  my-10 mx-auto justify-center items-center">
								<p className="text-center text-lg font-medium text-stone-200">
									No results found
								</p>
								<Frown className="size-5" />
							</div>
						) : (
							<>
								{news?.map((_item) => {
									return (
										<Link
											href={_item.link._text}
											target="_blank"
											key={_item.guid._text}
											className="border p-4 rounded-lg border-dashed w-full border-stone-600 flex flex-col gap-4 hover:bg-stone-800 cursor-pointer"
										>
											<span className="text-base font-medium">
												{_item.title._text}
											</span>
											<p className="text-sm font-light">
												Published: {_item.pubDate._text}
											</p>
										</Link>
									);
								})}
							</>
						)}
					</div>
				)}
			</main>
		</div>
	);
}

export const getServerSideProps = async () => {
	const res = await fetch("http://localhost:3000/api/news?topic=technology");
	const initialNews = await res.json();
	return {
		props: {
			initialNews,
		},
	};
};
