import { createToolConfig } from "@askjeeves/conversion-core";
import { SEO_BRAND_TITLE, SEO_DESCRIPTION } from "./src/seo";

export const toolConfig = createToolConfig({
	id: "xlsx-tools",
	title: SEO_BRAND_TITLE,
	tagline: SEO_DESCRIPTION,
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
