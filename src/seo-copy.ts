export const HOW_IT_WORKS_STEPS = [
	"Upload an XLSX file using the drop zone or file picker.",
	"Choose CSV or JSON as the output format. Optionally specify a sheet name.",
	"Click Convert, then download your result. Nothing is uploaded to a server.",
] as const;

export const SECURITY_SECTION_COPY =
	"Your spreadsheets are processed locally in your browser. Nothing is stored on a server and nothing is uploaded over the network. That makes this tool a good fit for financial data, HR exports, and other sensitive workbooks you do not want to send to a third-party service.";

export const CONVERSION_DESCRIPTIONS: Record<string, string> = {
	"xlsx-csv":
		"Convert Excel (XLSX) to CSV with optional sheet selection. Defaults to the first worksheet.",
	"xlsx-json":
		"Convert Excel (XLSX) to JSON with optional sheet selection. Rows become objects keyed by column headers.",
};
