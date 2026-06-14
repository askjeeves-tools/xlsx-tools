import askJeeves from "@askjeeves/astro-integration";
import { defineConfig } from "astro/config";
import pkg from "./package.json" with { type: "json" };

export default defineConfig({
	output: "static",
	site: "https://xlsx.askjeeves.cc",
	integrations: [
		askJeeves({
			name: "Ask Jeeves",
			tagline:
				"Convert Excel files in your browser. Nothing leaves your device.",
			version: pkg.version,
			openGraph: {
				home: {
					title: "Excel Converter — Ask Jeeves",
					description:
						"Free XLSX to CSV and XLSX to JSON conversion in your browser.",
				},
			},
		}),
	],
	vite: {
		resolve: {
			preserveSymlinks: true,
		},
		ssr: {
			noExternal: [
				"@askjeeves/conversion-core",
				"@askjeeves/processors-xlsx",
				"@askjeeves/ui",
			],
		},
	},
});
