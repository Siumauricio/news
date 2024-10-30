export interface New {
	title: Title;
	link: Link;
	guid: Guid;
	pubDate: PubDate;
	description: Description;
	source: Source;
}

export interface Title {
	_text: string;
}

export interface Link {
	_text: string;
}

export interface Guid {
	_attributes: Attributes;
	_text: string;
}

export interface Attributes {
	isPermaLink: string;
}

export interface PubDate {
	_text: string;
}

export interface Description {
	_text: string;
}

export interface Source {
	_attributes: Attributes2;
	_text: string;
}

export interface Attributes2 {
	url: string;
}
