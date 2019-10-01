"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('request');
const fs = require('fs');
const cheerio = require('cheerio');
const moment = require('moment');
class QuestionController {
    constructor() {
        this.getQuestions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield createFile();
                fs.readFile('./src/config/questions.json', (err, data) => {
                    if (err)
                        throw err;
                    return res.status(200).json({
                        message: JSON.parse(data)
                    });
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
const createFile = () => __awaiter(this, void 0, void 0, function* () {
    request('https://www.naranja.com/comercios-amigos', (err, res, body) => {
        if (!err && res.statusCode === 200) {
            let $ = cheerio.load(body);
            let singleAnswer = {
                index: '',
                value: ''
            };
            let resultArray = [];
            let preguntas = [];
            let respuestas = [];
            let cadena = '';
            $('div.faq-title_question').each((i, elem) => {
                preguntas.push(elem.children[0].data);
            });
            $('.faq-text').each((i, elem) => {
                for (let j = 0; j < elem.children[0].childNodes.length; j++) {
                    if (elem.children[0].children[j].type !== 'text') {
                        cadena += '<' + elem.children[0].children[j].name + '>';
                        if (elem.children[0].children[j].children[0].name === 'strong') {
                            cadena += '<' + elem.children[0].children[j].children[0].name + '>' + elem.children[0].children[j].children[0].children[0].data + '</' + elem.children[0].children[j].children[0].name + '>';
                        }
                        else if (elem.children[0].children[j].childNodes.length > 1) {
                            for (let k = 0; k < elem.children[0].children[j].childNodes.length; k++) {
                                if (elem.children[0].children[j].children[k].type === 'text') {
                                    cadena += elem.children[0].children[j].children[k].data;
                                }
                                if (elem.children[0].children[j].children[k].type !== 'text') {
                                    if (elem.children[0].children[j].children[k].name === 'a') {
                                        cadena += '<' + elem.children[0].children[j].children[k].name + ' href="' + elem.children[0].children[j].children[k].attribs['href'] + '">' + elem.children[0].children[j].children[k].children[0].data + '</>';
                                    }
                                    if (elem.children[0].children[j].children[k].name === 'li') {
                                        cadena += '<' + elem.children[0].children[j].children[k].name + '>' + elem.children[0].children[j].children[k].children[0].data + '<' + elem.children[0].children[j].children[k].name + '/>';
                                    }
                                    if (elem.children[0].children[j].children[k].name === 'ol') {
                                        cadena += '<' + elem.children[0].children[j].children[k].name + '>' + elem.children[0].children[j].children[k].children[0].data + '<' + elem.children[0].children[j].children[k].name + '/>';
                                    }
                                }
                            }
                        }
                        else {
                            if (elem.children[0].children[j].name === 'p') {
                                cadena += elem.children[0].children[j].children[0].data;
                            }
                        }
                    }
                    else {
                        if (elem.children[0].children[j].type === 'text' && elem.children[0].children[j].data === '\n') {
                            cadena += '</' + elem.children[0].children[j].prev.name + '>';
                        }
                    }
                }
                respuestas.push(cadena);
                cadena = '';
            });
            preguntas.forEach((pregunta, i) => {
                respuestas.forEach((respuesta, j) => {
                    if (i === j) {
                        singleAnswer.index = pregunta;
                        singleAnswer.value = respuesta;
                        resultArray.push(Object.assign({}, singleAnswer));
                    }
                });
            });
            //aca escribo el archivo
            let final = {
                result: resultArray,
                updated: moment(new Date()).format('DD/MM/YYYY hh:mm:ss')
            };
            let convertData = JSON.stringify(final);
            let convertParse = JSON.parse(convertData);
            let convertJson = JSON.stringify(convertParse);
            fs.writeFile('./src/config/questions.json', convertJson, 'utf8', function (err) {
                if (err)
                    return false;
                return true;
            });
        }
    });
});
exports.questionController = new QuestionController();
