import { loadFixtureFile } from "@askjeeves/test-e2e/fixtures";
import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { csvToXlsx, xlsxToCsv, xlsxToJson } from "../src/index";

async function createMultiSheetFile(): Promise<File> {
	const workbook = new ExcelJS.Workbook();
	workbook.addWorksheet("Sheet1").addRow(["ignored"]);
	workbook.addWorksheet("Sheet2").addRow(["extra", "data"]);
	const buffer = await workbook.xlsx.writeBuffer();
	return new File([buffer], "multi.xlsx", {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	});
}

describe("xlsx processors", () => {
	it("csvToXlsx produces a readable workbook", async () => {
		const csvFile = await loadFixtureFile("sample.csv");
		const result = await csvToXlsx(csvFile);

		expect(result.filename).toBe("sample.xlsx");
		expect(result.mimeType).toBe(
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		);

		const roundTrip = await xlsxToCsv(
			new File([await result.blob.arrayBuffer()], "sample.xlsx", {
				type: result.mimeType,
			}),
		);
		const text = await roundTrip.blob.text();
		expect(text).toContain("alpha");
		expect(text).toContain("gamma");
	});

	it("xlsxToJson uses the first row as headers", async () => {
		const csvFile = await loadFixtureFile("sample.csv");
		const xlsx = await csvToXlsx(csvFile);
		const xlsxFile = new File([await xlsx.blob.arrayBuffer()], "sample.xlsx", {
			type: xlsx.mimeType,
		});

		const result = await xlsxToJson(xlsxFile);
		const rows = JSON.parse(await result.blob.text()) as Record<
			string,
			unknown
		>[];

		expect(rows).toHaveLength(3);
		expect(rows[0]).toMatchObject({ name: "alpha", count: "1" });
		expect(rows[2]).toMatchObject({ name: "gamma", count: "3" });
	});

	it("xlsxToCsv respects sheetName option", async () => {
		const file = await createMultiSheetFile();
		const result = await xlsxToCsv(file, { sheetName: "Sheet2" });
		expect(await result.blob.text()).toContain("extra");
	});
});
