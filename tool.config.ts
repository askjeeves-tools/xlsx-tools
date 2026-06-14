import { createToolConfig } from "@askjeeves/conversion-core";

export const toolConfig = createToolConfig({
	id: "xlsx-tools",
	title: "Excel Converter",
	tagline: "Convert XLSX files in your browser. Nothing leaves your device.",
	sourceFormat: "xlsx",
	allowsMultiple: false,
	minFiles: 1,
	conversions: [
		{
			id: "xlsx-csv",
			source: "xlsx",
			target: "csv",
			label: "XLSX → CSV",
			enabled: true,
			options: "xlsx",
		},
		{
			id: "xlsx-json",
			source: "xlsx",
			target: "json",
			label: "XLSX → JSON",
			enabled: true,
			options: "xlsx",
		},
	],
});
