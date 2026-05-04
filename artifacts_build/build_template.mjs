import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = path.resolve("../outputs");
const outputPath = path.join(outputDir, "plantilla_clientes_consultoria_gastronomica.xlsx");

const sheets = [
  {
    name: "datos_negocio",
    columns: [
      ["cliente_id", "texto", "si", "RESTO_001", "Identificador estable del cliente. No cambiar entre envios."],
      ["nombre_negocio", "texto", "si", "La Mesa del Puerto", "Nombre comercial."],
      ["razon_social", "texto", "no", "La Mesa del Puerto SRL", "Razon social si aplica."],
      ["cuit", "texto", "no", "30-12345678-9", "Mantener como texto para conservar guiones y ceros."],
      ["tipo_negocio", "lista", "si", "Restaurante", "Valores sugeridos: Restaurante, Bar, Cafeteria, Dark kitchen, Panaderia, Otro."],
      ["direccion", "texto", "no", "Av. Corrientes 1234", "Direccion principal."],
      ["ciudad", "texto", "no", "Buenos Aires", "Ciudad."],
      ["provincia", "texto", "no", "CABA", "Provincia o region."],
      ["pais", "texto", "si", "Argentina", "Pais."],
      ["moneda", "lista", "si", "ARS", "Codigo de moneda: ARS, USD, EUR u otro codigo ISO."],
      ["responsable", "texto", "no", "Martina Lopez", "Contacto del negocio."],
      ["email", "email", "no", "martina@lamesa.com", "Email valido."],
      ["telefono", "texto", "no", "+54 11 5555-0101", "Telefono como texto."],
      ["fecha_inicio_reporte", "fecha", "si", "2026-05-01", "Formato yyyy-mm-dd."],
    ],
    examples: [
      ["RESTO_001", "La Mesa del Puerto", "La Mesa del Puerto SRL", "30-12345678-9", "Restaurante", "Av. Corrientes 1234", "Buenos Aires", "CABA", "Argentina", "ARS", "Martina Lopez", "martina@lamesa.com", "+54 11 5555-0101", "2026-05-01"],
    ],
  },
  {
    name: "ventas",
    columns: [
      ["venta_id", "texto", "si", "VTA_0001", "ID unico de la venta dentro del archivo."],
      ["fecha", "fecha", "si", "2026-05-01", "Formato yyyy-mm-dd."],
      ["turno", "lista", "no", "Noche", "Manana, Mediodia, Tarde, Noche, Dia completo."],
      ["canal", "lista", "si", "Salon", "Salon, Take away, Delivery propio, App delivery, Eventos, Otro."],
      ["app_delivery_id", "texto", "no", "RAPPI", "Obligatorio si canal es App delivery."],
      ["comprobante", "texto", "no", "FC A 0001-00001234", "Factura, ticket o referencia."],
      ["cantidad_operaciones", "entero", "no", "86", "Cantidad de tickets/pedidos."],
      ["venta_bruta", "numero", "si", "1450000", "Importe antes de descuentos y comisiones."],
      ["descuentos", "numero", "no", "25000", "Descuentos otorgados."],
      ["comisiones", "numero", "no", "82000", "Comisiones del canal o app."],
      ["impuestos", "numero", "no", "0", "Impuestos si se reportan separados."],
      ["venta_neta", "numero", "si", "1343000", "Importe neto final."],
      ["medio_pago", "lista", "no", "Tarjeta", "Efectivo, Tarjeta, Transferencia, Mercado Pago, Mixto, Otro."],
      ["observaciones", "texto", "no", "Promocion fin de semana", "Notas libres."],
    ],
    examples: [
      ["VTA_0001", "2026-05-01", "Noche", "Salon", "", "Ticket cierre Z", 86, 1450000, 25000, 0, 0, 1425000, "Tarjeta", "Viernes fuerte"],
      ["VTA_0002", "2026-05-01", "Noche", "App delivery", "RAPPI", "Liquidacion Rappi", 34, 380000, 15000, 82000, 0, 283000, "Transferencia", ""],
    ],
  },
  {
    name: "gastos",
    columns: [
      ["gasto_id", "texto", "si", "GTO_0001", "ID unico del gasto."],
      ["fecha", "fecha", "si", "2026-05-02", "Formato yyyy-mm-dd."],
      ["categoria", "lista", "si", "Servicios", "Materia prima, Sueldos, Alquiler, Servicios, Marketing, Impuestos, Mantenimiento, Honorarios, Otros."],
      ["subcategoria", "texto", "no", "Electricidad", "Detalle interno."],
      ["proveedor_id", "texto", "no", "PROV_001", "Debe existir en proveedores si se informa."],
      ["descripcion", "texto", "si", "Factura electricidad", "Descripcion clara."],
      ["monto", "numero", "si", "95000", "Mayor o igual a cero."],
      ["medio_pago", "lista", "no", "Transferencia", "Efectivo, Tarjeta, Transferencia, Debito automatico, Otro."],
      ["comprobante", "texto", "no", "FAC 0004-12345", "Referencia del comprobante."],
      ["es_fijo", "booleano", "no", "SI", "SI/NO para costos fijos."],
      ["observaciones", "texto", "no", "Vence el 10", "Notas libres."],
    ],
    examples: [
      ["GTO_0001", "2026-05-02", "Servicios", "Electricidad", "PROV_001", "Factura electricidad", 95000, "Transferencia", "FAC 0004-12345", "SI", ""],
      ["GTO_0002", "2026-05-03", "Marketing", "Redes", "", "Campana Instagram", 45000, "Tarjeta", "", "NO", ""],
    ],
  },
  {
    name: "compras",
    columns: [
      ["compra_id", "texto", "si", "CMP_0001", "ID unico de compra."],
      ["fecha", "fecha", "si", "2026-05-02", "Formato yyyy-mm-dd."],
      ["proveedor_id", "texto", "si", "PROV_002", "Debe existir en proveedores."],
      ["insumo_id", "texto", "si", "INS_001", "Debe existir en insumos."],
      ["cantidad", "numero", "si", "12", "Cantidad comprada."],
      ["unidad", "lista", "si", "kg", "kg, gr, lt, ml, unidad, caja, bolsa."],
      ["precio_unitario", "numero", "si", "2800", "Precio por unidad."],
      ["importe_total", "numero", "si", "33600", "Cantidad x precio unitario."],
      ["comprobante", "texto", "no", "Remito 123", "Factura/remito."],
      ["observaciones", "texto", "no", "Entrega parcial", "Notas libres."],
    ],
    examples: [
      ["CMP_0001", "2026-05-02", "PROV_002", "INS_001", 12, "kg", 2800, 33600, "Remito 123", ""],
    ],
  },
  {
    name: "proveedores",
    columns: [
      ["proveedor_id", "texto", "si", "PROV_001", "ID unico del proveedor."],
      ["nombre", "texto", "si", "Distribuidora Central", "Nombre comercial."],
      ["categoria", "lista", "no", "Materia prima", "Materia prima, Servicios, Mantenimiento, Marketing, Otro."],
      ["cuit", "texto", "no", "30-87654321-0", "Mantener como texto."],
      ["contacto", "texto", "no", "Laura Gomez", "Persona de contacto."],
      ["email", "email", "no", "ventas@central.com", "Email valido."],
      ["telefono", "texto", "no", "+54 11 5555-2020", "Telefono como texto."],
      ["condicion_pago", "texto", "no", "7 dias", "Contado, 7 dias, 30 dias, etc."],
      ["activo", "booleano", "si", "SI", "SI/NO."],
      ["observaciones", "texto", "no", "Entrega lunes y jueves", "Notas libres."],
    ],
    examples: [
      ["PROV_001", "Energia", "Servicios", "", "Soporte", "soporte@energia.com", "", "Debito automatico", "SI", ""],
      ["PROV_002", "Distribuidora Central", "Materia prima", "30-87654321-0", "Laura Gomez", "ventas@central.com", "+54 11 5555-2020", "7 dias", "SI", ""],
    ],
  },
  {
    name: "productos",
    columns: [
      ["producto_id", "texto", "si", "PROD_001", "ID unico del producto vendido."],
      ["nombre", "texto", "si", "Hamburguesa clasica", "Nombre de venta."],
      ["categoria", "texto", "si", "Principales", "Categoria de carta."],
      ["precio_venta", "numero", "si", "8500", "Precio vigente."],
      ["iva_incluido", "booleano", "no", "SI", "SI/NO."],
      ["activo", "booleano", "si", "SI", "SI/NO."],
      ["fecha_alta", "fecha", "no", "2026-05-01", "Formato yyyy-mm-dd."],
      ["observaciones", "texto", "no", "Producto estrella", "Notas libres."],
    ],
    examples: [
      ["PROD_001", "Hamburguesa clasica", "Principales", 8500, "SI", "SI", "2026-05-01", ""],
    ],
  },
  {
    name: "insumos",
    columns: [
      ["insumo_id", "texto", "si", "INS_001", "ID unico del insumo."],
      ["nombre", "texto", "si", "Carne picada", "Nombre del insumo."],
      ["categoria", "texto", "si", "Carnes", "Categoria interna."],
      ["unidad_base", "lista", "si", "kg", "kg, gr, lt, ml, unidad."],
      ["costo_unitario_referencia", "numero", "no", "2800", "Ultimo costo o costo promedio."],
      ["proveedor_principal_id", "texto", "no", "PROV_002", "Debe existir en proveedores si se informa."],
      ["stock_minimo", "numero", "no", "5", "Nivel minimo sugerido."],
      ["activo", "booleano", "si", "SI", "SI/NO."],
      ["observaciones", "texto", "no", "Blend especial", "Notas libres."],
    ],
    examples: [
      ["INS_001", "Carne picada", "Carnes", "kg", 2800, "PROV_002", 5, "SI", ""],
    ],
  },
  {
    name: "fichas_tecnicas",
    columns: [
      ["ficha_id", "texto", "si", "FT_0001", "ID unico de la linea de ficha."],
      ["producto_id", "texto", "si", "PROD_001", "Debe existir en productos."],
      ["insumo_id", "texto", "si", "INS_001", "Debe existir en insumos."],
      ["cantidad", "numero", "si", "0.18", "Cantidad usada por unidad vendida."],
      ["unidad", "lista", "si", "kg", "kg, gr, lt, ml, unidad."],
      ["merma_pct", "porcentaje", "no", "5%", "Porcentaje de merma."],
      ["costo_unitario", "numero", "no", "2800", "Costo por unidad base."],
      ["observaciones", "texto", "no", "Incluye coccion", "Notas libres."],
    ],
    examples: [
      ["FT_0001", "PROD_001", "INS_001", 0.18, "kg", "5%", 2800, ""],
    ],
  },
  {
    name: "stock",
    columns: [
      ["stock_id", "texto", "si", "STK_0001", "ID unico del movimiento o conteo."],
      ["fecha", "fecha", "si", "2026-05-05", "Formato yyyy-mm-dd."],
      ["insumo_id", "texto", "si", "INS_001", "Debe existir en insumos."],
      ["tipo_movimiento", "lista", "si", "Conteo", "Conteo, Entrada, Salida, Ajuste, Merma."],
      ["cantidad", "numero", "si", "8.5", "Cantidad del movimiento."],
      ["unidad", "lista", "si", "kg", "kg, gr, lt, ml, unidad."],
      ["ubicacion", "texto", "no", "Freezer 1", "Deposito, cocina, barra, etc."],
      ["motivo", "texto", "no", "Conteo semanal", "Motivo del movimiento."],
      ["observaciones", "texto", "no", "", "Notas libres."],
    ],
    examples: [
      ["STK_0001", "2026-05-05", "INS_001", "Conteo", 8.5, "kg", "Freezer 1", "Conteo semanal", ""],
    ],
  },
  {
    name: "personal",
    columns: [
      ["personal_id", "texto", "si", "PER_001", "ID unico del empleado o colaborador."],
      ["nombre", "texto", "si", "Juan Perez", "Nombre completo."],
      ["rol", "texto", "si", "Cocinero", "Puesto."],
      ["fecha", "fecha", "si", "2026-05-01", "Fecha del registro."],
      ["horas_trabajadas", "numero", "no", "8", "Horas del dia o periodo."],
      ["costo_hora", "numero", "no", "3200", "Costo estimado por hora."],
      ["sueldo_mensual", "numero", "no", "850000", "Si corresponde."],
      ["tipo_contratacion", "lista", "no", "Relacion dependencia", "Relacion dependencia, Eventual, Monotributo, Otro."],
      ["activo", "booleano", "si", "SI", "SI/NO."],
      ["observaciones", "texto", "no", "", "Notas libres."],
    ],
    examples: [
      ["PER_001", "Juan Perez", "Cocinero", "2026-05-01", 8, 3200, 850000, "Relacion dependencia", "SI", ""],
    ],
  },
  {
    name: "apps_delivery",
    columns: [
      ["app_delivery_id", "texto", "si", "RAPPI", "ID unico de la app."],
      ["nombre", "texto", "si", "Rappi", "Nombre comercial."],
      ["comision_pct", "porcentaje", "no", "18%", "Comision promedio."],
      ["costo_fijo_mensual", "numero", "no", "0", "Si aplica."],
      ["plazo_pago_dias", "entero", "no", "7", "Dias hasta liquidacion."],
      ["activo", "booleano", "si", "SI", "SI/NO."],
      ["observaciones", "texto", "no", "Liquidacion semanal", "Notas libres."],
    ],
    examples: [
      ["RAPPI", "Rappi", "18%", 0, 7, "SI", "Liquidacion semanal"],
      ["PEDIDOSYA", "PedidosYa", "20%", 0, 7, "SI", ""],
    ],
  },
  {
    name: "observaciones",
    columns: [
      ["observacion_id", "texto", "si", "OBS_0001", "ID unico de observacion."],
      ["fecha", "fecha", "si", "2026-05-06", "Formato yyyy-mm-dd."],
      ["area", "lista", "si", "Operaciones", "Ventas, Gastos, Compras, Stock, Personal, Operaciones, Otro."],
      ["prioridad", "lista", "no", "Media", "Alta, Media, Baja."],
      ["descripcion", "texto", "si", "Hubo corte de luz durante el servicio", "Texto claro."],
      ["impacto_estimado", "texto", "no", "Menor venta nocturna", "Impacto operativo/economico."],
      ["responsable", "texto", "no", "Encargado turno noche", "Quien reporta."],
    ],
    examples: [
      ["OBS_0001", "2026-05-06", "Operaciones", "Media", "Hubo corte de luz durante el servicio", "Menor venta nocturna", "Encargado turno noche"],
    ],
  },
];

const rules = [
  ["Regla", "Detalle"],
  ["Nombres de hojas", "No cambiar nombres, no agregar espacios, no usar acentos en nombres de hojas."],
  ["Encabezados", "No renombrar, borrar ni reordenar columnas. La importacion buscara estos encabezados exactos."],
  ["IDs", "Todo campo terminado en _id debe ser estable, unico dentro de su hoja y reutilizado para relacionar hojas."],
  ["Fechas", "Usar formato yyyy-mm-dd. Ejemplo: 2026-05-01."],
  ["Numeros", "Usar numeros sin simbolo de moneda. Ejemplo: 1450000, no $1.450.000."],
  ["Porcentajes", "Usar porcentaje o decimal consistente. Ejemplo recomendado: 18%."],
  ["Booleanos", "Usar solo SI o NO."],
  ["Filas de ejemplo", "Pueden borrarse antes de cargar datos reales, pero no borrar la fila de encabezados."],
  ["Hojas vacias", "Si no hay datos, dejar solo encabezados."],
  ["Productos distintos", "Cada cliente puede cargar sus propios productos, pero debe respetar los mismos campos y tipos."],
];

const workbook = Workbook.create();
const instructions = workbook.worksheets.add("instrucciones");
instructions.showGridLines = false;
instructions.getRange("A1:F1").values = [["Plantilla oficial para clientes gastronomicos", "", "", "", "", ""]];
instructions.getRange("A1:F1").merge();
instructions.getRange("A1").format = {
  fill: "#0F766E",
  font: { bold: true, color: "#FFFFFF", size: 16 },
};
instructions.getRange("A3:B13").values = rules;
instructions.getRange("A3:B3").format = {
  fill: "#E7F5EF",
  font: { bold: true },
};
instructions.getRange("A15:F15").values = [["Hoja", "Columna", "Tipo", "Obligatorio", "Ejemplo", "Validacion recomendada"]];
instructions.getRange("A15:F15").format = {
  fill: "#E7F5EF",
  font: { bold: true },
};

let instructionRow = 16;
for (const sheetSpec of sheets) {
  for (const column of sheetSpec.columns) {
    instructions.getRange(`A${instructionRow}:F${instructionRow}`).values = [[
      sheetSpec.name,
      column[0],
      column[1],
      column[2],
      column[3],
      column[4],
    ]];
    instructionRow += 1;
  }
}
instructions.getRange("A:F").format.wrapText = true;
instructions.getRange("A:A").format.columnWidth = 24;
instructions.getRange("B:B").format.columnWidth = 26;
instructions.getRange("C:D").format.columnWidth = 16;
instructions.getRange("E:E").format.columnWidth = 24;
instructions.getRange("F:F").format.columnWidth = 58;
instructions.freezePanes.freezeRows(15);

for (const sheetSpec of sheets) {
  const sheet = workbook.worksheets.add(sheetSpec.name);
  sheet.showGridLines = false;
  const headers = sheetSpec.columns.map((column) => column[0]);
  const notes = sheetSpec.columns.map((column) => `${column[1]} | ${column[2] === "si" ? "obligatorio" : "opcional"}`);
  sheet.getRangeByIndexes(0, 0, 1, headers.length).values = [headers];
  sheet.getRangeByIndexes(0, 0, 1, headers.length).format = {
    fill: "#0F766E",
    font: { bold: true, color: "#FFFFFF" },
    wrapText: true,
  };
  sheet.getRangeByIndexes(1, 0, 1, headers.length).values = [notes];
  sheet.getRangeByIndexes(1, 0, 1, headers.length).format = {
    fill: "#F5F5F0",
    font: { italic: true, color: "#57534E" },
    wrapText: true,
  };
  if (sheetSpec.examples.length > 0) {
    sheet.getRangeByIndexes(2, 0, sheetSpec.examples.length, headers.length).values = sheetSpec.examples;
  }
  sheet.freezePanes.freezeRows(1);
  for (let i = 0; i < headers.length; i += 1) {
    const maxLen = Math.max(headers[i].length, notes[i].length, ...sheetSpec.examples.map((row) => String(row[i] ?? "").length));
    sheet.getRangeByIndexes(0, i, 1, 1).format.columnWidth = Math.min(Math.max(maxLen + 4, 14), 32);
  }
}

await fs.mkdir(outputDir, { recursive: true });

for (const sheetName of ["instrucciones", "ventas", "gastos", "productos"]) {
  await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);
