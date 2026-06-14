import { xlsxToCsv, xlsxToJson } from "@askjeeves/processors-xlsx";
import type { ProcessorMap } from "@askjeeves/ui/scripts/tool-controller";

export const processors: ProcessorMap = {
	"xlsx-csv": xlsxToCsv,
	"xlsx-json": xlsxToJson,
};
