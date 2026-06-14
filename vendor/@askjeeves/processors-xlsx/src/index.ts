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
import { parseCsvWithHeaders } from "@askjeeves/processors-csv-json";
import type { Workbook, Worksheet } from "exceljs";

function resolveWorksheet(
	workbook: Workbook,
	options?: ConversionOptions,
): Worksheet {
	const requested =
		typeof options?.sheetName === "string" ? options.sheetName.trim() : "";
	if (requested) {
		const sheet = workbook.getWorksheet(requested);
		if (!sheet) {
			throw userFacingError(`Sheet "${requested}" not found in workbook.`);
		}
		return sheet;
	}
	const first = workbook.worksheets[0];
	if (!first) throw userFacingError("Workbook has no sheets.");
	return first;
}

async function loadWorkbook(file: File): Promise<Workbook> {
	const ExcelJS = await import("exceljs");
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(await file.arrayBuffer());
	return workbook;
}

function cellsFromRow(row: {
	values?: unknown[] | { [key: number]: unknown };
}): unknown[] {
	const values = row.values;
	if (Array.isArray(values)) return values.slice(1);
	if (values && typeof values === "object") {
		const keys = Object.keys(values)
			.map(Number)
			.filter((key) => key > 0)
			.sort((a, b) => a - b);
		return keys.map((key) => values[key]);
	}
	return [];
}

function escapeCsvCell(value: unknown): string {
	if (value == null) return "";
	const str = String(value);
	if (/[",\n\r]/.test(str)) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

function worksheetToCsv(worksheet: Worksheet): string {
	const lines: string[] = [];
	worksheet.eachRow((row) => {
		const cells = cellsFromRow(row).map(escapeCsvCell);
		lines.push(cells.join(","));
	});
	return lines.join("\n");
}

function worksheetToJson(worksheet: Worksheet): Record<string, unknown>[] {
	const rows: Record<string, unknown>[] = [];
	let headers: string[] = [];

	worksheet.eachRow((row, rowNumber) => {
		const cells = cellsFromRow(row);
		if (rowNumber === 1) {
			headers = cells.map((cell, index) => {
				if (cell == null || cell === "") return `__EMPTY_${index}`;
				return String(cell);
			});
			return;
		}

		const record: Record<string, unknown> = {};
		for (let index = 0; index < headers.length; index++) {
			record[headers[index] ?? `__EMPTY_${index}`] = cells[index] ?? null;
		}
		rows.push(record);
	});

	return rows;
}

export async function xlsxToCsv(
	file: File,
	options?: ConversionOptions,
	_context?: ProcessorContext,
): Promise<ConversionResult> {
	return withConversionError("xlsx", async () => {
		const workbook = await loadWorkbook(file);
		const worksheet = resolveWorksheet(workbook, options);
		const csv = worksheetToCsv(worksheet);
		return {
			blob: new Blob([csv], { type: "text/csv" }),
			filename: `${basename(file.name)}.csv`,
			mimeType: "text/csv",
		};
	});
}

export async function xlsxToJson(
	file: File,
	options?: ConversionOptions,
	_context?: ProcessorContext,
): Promise<ConversionResult> {
	return withConversionError("xlsx", async () => {
		const workbook = await loadWorkbook(file);
		const worksheet = resolveWorksheet(workbook, options);
		const rows = worksheetToJson(worksheet);
		const json = JSON.stringify(rows, null, 2);
		return {
			blob: new Blob([json], { type: "application/json" }),
			filename: `${basename(file.name)}.json`,
			mimeType: "application/json",
		};
	});
}

export async function csvToXlsx(
	file: File,
	_options?: ConversionOptions,
	context?: ProcessorContext,
): Promise<ConversionResult> {
	return withConversionError("xlsx", async () => {
		context?.onProgress?.(10, "Loading converter…");
		const ExcelJS = await import("exceljs");
		const text = await file.text();
		const data = parseCsvWithHeaders(text);
		context?.onProgress?.(40, "Building workbook…");
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Sheet1");

		if (data.length > 0) {
			const headers = Object.keys(data[0] ?? {});
			worksheet.addRow(headers);
			for (const row of data) {
				worksheet.addRow(headers.map((header) => row[header] ?? ""));
			}
		}

		context?.onProgress?.(80, "Writing file…");
		const out = await workbook.xlsx.writeBuffer();
		context?.onProgress?.(100, "Done");
		return {
			blob: new Blob([out], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			}),
			filename: `${basename(file.name)}.xlsx`,
			mimeType:
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		};
	});
}
