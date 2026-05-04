import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("../outputs/plantilla_clientes_consultoria_gastronomica.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);

const sheets = await workbook.inspect({
  kind: "sheet",
  include: "name",
  maxChars: 4000,
});
console.log(sheets.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
});
console.log(errors.ndjson);

for (const sheetName of ["instrucciones", "ventas", "gastos", "fichas_tecnicas"]) {
  await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
}
