export interface FaqEntry {
	question: string;
	answer: string;
}

export const FAQ_ENTRIES: FaqEntry[] = [
	{
		question: "Is this Excel converter free?",
		answer:
			"Yes. Every conversion is free with no account, watermark, or usage limit.",
	},
	{
		question: "Is this Excel converter secure?",
		answer:
			"Yes. Files are processed locally in your browser. Nothing is uploaded to a server, so your spreadsheets stay on your device.",
	},
	{
		question: "What formats can I convert XLSX to?",
		answer:
			"You can convert XLSX (Excel) files to CSV or JSON. Both options support an optional sheet name; if omitted, the first worksheet is used.",
	},
	{
		question: "Can I choose which worksheet to convert?",
		answer:
			"Yes. Enter a sheet name in the options before converting. If you leave it blank, the converter uses the first sheet in the workbook.",
	},
	{
		question: "Does the converter work on mobile?",
		answer:
			"Yes. It runs in modern mobile browsers that support HTML5 and JavaScript. Very large files may be slower on mobile devices.",
	},
	{
		question: "What is the maximum file size?",
		answer:
			"Each file can be up to about 50 MB. If a file is too large, you will see a clear error message asking you to use a smaller file.",
	},
	{
		question: "Why did my conversion fail?",
		answer:
			"Common causes are a non-XLSX file, corrupted workbook data, or exceeding the size limit. Check the message below the converter for specific guidance, then try again or refresh the page.",
	},
];
