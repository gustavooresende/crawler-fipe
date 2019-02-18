const request = require("request");
const rp = require("request-promise");
const fs = require("fs");

var cont = 0;

var page = "https://veiculos.fipe.org.br/";

var consultaMarcas =
  "https://veiculos.fipe.org.br/api/veiculos/ConsultarMarcas";
var consultaModelos =
  "https://veiculos.fipe.org.br/api/veiculos/ConsultarModelos";
var consultaAnoModelo =
  "https://veiculos.fipe.org.br/api/veiculos/ConsultarAnoModelo";
var consultaValor =
  "https://veiculos.fipe.org.br/api/veiculos/ConsultarValorComTodosParametros";

const headers = {
  Host: "veiculos.fipe.org.br",
  Connection: "keep-alive",
  Referer: "https://veiculos.fipe.org.br/"
};

const option = {
  method: "POST",
  json: true,
  uri: consultaMarcas,
  headers: headers
};

var tabelaReferencia = 237;

async function getMarcas() {
  var marcas = await rp({
    method: "POST",
    json: true,
    uri: consultaMarcas,
    headers: headers,
    form: {
      codigoTabelaReferencia: tabelaReferencia,
      codigoTipoVeiculo: 1
    }
  });

  for (let i = 0; i < marcas.length; i++) {
    await fs.appendFile(
      "./veiculos/" + marcas[i].Label + ".csv",
      "MODELO,ANO,COMBUSTIVEL,VALOR MEDIO\n",
      err => {
        if (err) console.log("Erro na gravacao!1");
      }
    );
    var modelos = await rp({
      method: "POST",
      json: true,
      uri: consultaModelos,
      headers: headers,
      form: {
        codigoTabelaReferencia: tabelaReferencia,
        codigoTipoVeiculo: 1,
        codigoMarca: marcas[i].Value
      }
    });
    for (let j = 0; j < modelos.Modelos.length; j++) {
      var anos = await rp({
        method: "POST",
        json: true,
        uri: consultaAnoModelo,
        headers: headers,
        form: {
          codigoTabelaReferencia: tabelaReferencia,
          codigoTipoVeiculo: 1,
          codigoMarca: marcas[i].Value,
          codigoModelo: modelos.Modelos[j].Value
        }
      });
      for (let k = 0; k < anos.length; k++) {
        var valor = await rp({
          method: "POST",
          json: true,
          uri: consultaValor,
          headers: headers,
          form: {
            codigoTabelaReferencia: tabelaReferencia,
            codigoTipoVeiculo: 1,
            codigoMarca: marcas[i].Value,
            codigoModelo: modelos.Modelos[j].Value,
            anoModelo: anos[k].Value.slice(0, 4),
            codigoTipoCombustivel: anos[k].Value.slice(5, 6),
            tipoVeiculo: "carro",
            tipoConsulta: "tradicional"
          }
        });
        cont++;
        await console.log(`Gravando...${cont}...${i}..${j}..${k}`);
        await fs.appendFile(
          "./veiculos/" + valor.Marca + ".csv",
          valor.Modelo +
            "," +
            valor.AnoModelo +
            "," +
            valor.Combustivel +
            "," +
            valor.Valor +
            "\n",
          err => {
            if (err) console.log("Erro na gravacao!");
          }
        );
      }
    }
  }
  return await modelos;
}

var marcas = getMarcas();
