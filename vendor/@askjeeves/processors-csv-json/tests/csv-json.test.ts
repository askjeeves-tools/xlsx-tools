import { UserFacingError } from "@askjeeves/conversion-core";
import { loadFixtureFile } from "@askjeeves/test-e2e/fixtures";
import { describe, expect, it } from "vitest";
import { csvToJson, jsonToCsv, normalizeText } from "../src/index";

describe("csv-json processors", () => {
	it("csvToJson produces valid JSON array", async () => {
		const csvFile = await loadFixtureFile("sample.csv");
		const result = await csvToJson(csvFile);

		expect(result.filename).toBe("sample.json");
		expect(result.mimeType).toBe("application/json");

		const rows = JSON.parse(await result.blob.text()) as Record<
			string,
			string
		>[];
		expect(rows).toHaveLength(3);
		expect(rows[0]).toMatchObject({ name: "alpha", count: "1" });
	});

	it("jsonToCsv exports array of objects", async () => {
		const jsonFile = await loadFixtureFile("sample.json");
		const result = await jsonToCsv(jsonFile);

		expect(result.filename).toBe("sample.csv");
		const text = await result.blob.text();
		expect(text).toContain("alpha");
		expect(text).toContain("gamma");
	});

	it("jsonToCsv rejects non-array JSON", async () => {
		const jsonFile = new File(['{"name":"solo"}'], "object.json", {
			type: "application/json",
		});
		await expect(jsonToCsv(jsonFile)).rejects.toThrow(UserFacingError);
		await expect(jsonToCsv(jsonFile)).rejects.toThrow(/array of objects/i);
	});

	it("csvToJson surfaces Papa parse errors", async () => {
		const badCsv = new File(['name\n"unclosed'], "bad.csv", {
			type: "text/csv",
		});
		await expect(csvToJson(badCsv)).rejects.toThrow(UserFacingError);
	});

	it("normalizeText converts CRLF to LF and trims trailing whitespace", async () => {
		const txtFile = await loadFixtureFile("crlf.txt");
		const result = await normalizeText(txtFile);
		const text = await result.blob.text();
		expect(text).not.toContain("\r");
		expect(text).toContain("line1");
		expect(text).toContain("line2");
		expect(text).toBe("line1\nline2");
	});
});
