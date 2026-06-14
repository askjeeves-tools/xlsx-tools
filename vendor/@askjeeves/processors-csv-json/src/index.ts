import type {
	ConversionOptions,
	ConversionResult,
	ProcessorContext,
} from "@askjeeves/conversion-core";
import {
	basename,
	userFacingError,
	withConversionError,
} from "@askjeeves/conversion-core";
import Papa from "papaparse";

function parseCsvWithHeaders(text: string): Record<string, string>[] {
	const parsed = Papa.parse<Record<string, string>>(text, {
		header: true,
		skipEmptyLines: true,
	});

	if (parsed.errors.length > 0) {
		throw userFacingError(parsed.errors[0]?.message ?? "CSV parse failed.");
	}

	return parsed.data;
}

/** Papa-based CSV parser shared with csvToXlsx for consistent row shapes. */
export { parseCsvWithHeaders };

export async function csvToJson(
	file: File,
	_options?: ConversionOptions,
	context?: ProcessorContext,
): Promise<ConversionResult> {
	return withConversionError("csv", async () => {
		context?.onProgress?.(20, "Reading file…");
		const text = await file.text();
		context?.onProgress?.(60, "Parsing CSV…");
		const data = parseCsvWithHeaders(text);
		const json = JSON.stringify(data, null, 2);
		context?.onProgress?.(100, "Done");
		return {
			blob: new Blob([json], { type: "application/json" }),
			filename: `${basename(file.name)}.json`,
			mimeType: "application/json",
		};
	});
}

export async function jsonToCsv(
	file: File,
	_options?: ConversionOptions,
	_context?: ProcessorContext,
): Promise<ConversionResult> {
	return withConversionError("json", async () => {
		const text = await file.text();
		const data = JSON.parse(text) as unknown;

		if (!Array.isArray(data)) {
			throw userFacingError("JSON must be an array of objects for CSV export.");
		}

		const csv = Papa.unparse(data);
		return {
			blob: new Blob([csv], { type: "text/csv" }),
			filename: `${basename(file.name)}.csv`,
			mimeType: "text/csv",
		};
	});
}

export async function normalizeText(
	file: File,
	_options?: ConversionOptions,
	_context?: ProcessorContext,
): Promise<ConversionResult> {
	return withConversionError("generic", async () => {
		const text = await file.text();
		const normalized = text.replace(/\r\n/g, "\n").trimEnd();
		return {
			blob: new Blob([normalized], { type: "text/plain" }),
			filename: file.name.endsWith(".txt")
				? file.name
				: `${basename(file.name)}.txt`,
			mimeType: "text/plain",
		};
	});
}
