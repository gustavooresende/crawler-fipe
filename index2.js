const request = require("request");
const cheerio = require("cheerio");
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

var veiculos;

function getMarcas() {
  request.post(
    consultaMarcas,
    {
      // proxy: "https://veiculos.fipe.org.br:8080",
      headers: {
        Host: "veiculos.fipe.org.br",
        Connection: "keep-alive",

        //"Content-Length": content-length,
        // Origin: "https://veiculos.fipe.org.br",
        // "X-Requested-With": "XMLHttpRequest",
        // "User-Agent":
        //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
        // "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        // "Accept-Encoding": "gzip, deflate, br"
        // "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
        // Cookie:
        //   " _ga=GA1.3.2120872920.1545400915; _gid=GA1.3.427255979.1546528799; nav41729=952674f657654cdcfedfdbdc909|2_4"
        Referer: "https://veiculos.fipe.org.br/"
      },
      form: {
        codigoTabelaReferencia: 237,
        codigoTipoVeiculo: 1
      }
    },
    (err, res, body) => {
      if (err) {
        console.log("Erro:" + err);
      }
      var marcas = JSON.parse(body);
      console.log("a");
      // ALTERAR PARA COBRIR TODAS AS MARCAS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // return marcas;
    }
  );
}

function getModelos(marcas) {
  request.post(
    consultaModelos,
    {
      // proxy: "https://veiculos.fipe.org.br:8080",
      headers: {
        Referer: "https://veiculos.fipe.org.br/",
        Connection: "keep-alive",
        Host: "veiculos.fipe.org.br"
      },
      form: {
        codigoTabelaReferencia: 237,
        codigoTipoVeiculo: 1,
        codigoMarca: marcas[i].Value
      }
    },
    (err, res, body) => {
      if (err) {
        console.log("Erro:" + err);
      }

      var modelos = JSON.parse(body);
      // ALTERAR PARA COBRIR TODOS OS MODELOS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      for (let j = 0; j < modelos.Modelos.length; j++) {
        //Request dos Anos-Combustivel==================================================================================
        request.post(
          consultaAnoModelo,
          {
            // proxy: "https://veiculos.fipe.org.br:8080",
            headers: {
              Referer: "https://veiculos.fipe.org.br/",
              Connection: "keep-alive",
              Host: "veiculos.fipe.org.br"
            },
            form: {
              codigoTabelaReferencia: 237,
              codigoTipoVeiculo: 1,
              codigoMarca: marcas[i].Value,
              codigoModelo: modelos.Modelos[j].Value
            }
          },
          (err, res, body) => {
            if (err) {
              console.log("Erro:" + err);
            }

            var anos = JSON.parse(body);
            // ALTERAR PARA COBRIR TODOS OS ANOS/COBUSTIVEIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            for (let k = 0; k < anos.length; k++) {
              console.log(anos);
            }
          }
        );
      }
    }
  );
}

getMarcas().then(console.log(veiculos));
