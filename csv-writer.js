const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "./veiculos/teste.csv",
  header: [{ id: "marca", title: "MARCA" }, { id: "modelo", title: "MODELO" }]
});

let veiculos = [{ marca: "Audi", modelo: "R8" }];
veiculos.push({ marca: "Audi", modelo: "A8" });
veiculos.push({ marca: "Audi", modelo: "RS7" });

csvWriter.writeRecords(veiculos).then(() => {
  console.log("Modelo gravado!");
});
