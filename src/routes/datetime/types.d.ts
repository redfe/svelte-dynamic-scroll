export type DateOptions = {
	label: string;
	format: (date: Date) => string;
	increment: (date: Date, inc: number) => Date;
	startOf: (date: Date) => Date;
};

export type DateValue = {
	id: string;
	datetime: Date;
};
