import { Request, Response } from 'express';
const request = require('request');
const fs = require('fs');
const cheerio = require('cheerio');
const moment = require('moment');

class QuestionController {
    public getQuestions = async (req: Request, res: Response) => {
        try {
            await createFile();
            fs.readFile('./src/config/questions.json', (err: any, data:any) => {
                if (err) throw err;
                return res.status(200).json({
                    message: JSON.parse(data)
                });  
            });
        } catch (error) {
            console.log(error);
        }
    }
}

const createFile = async () => {
    request('https://www.naranja.com/comercios-amigos', (err: any, res: any, body: any) => {
        if(!err && res.statusCode === 200) {
            let $ = cheerio.load(body);
            let singleAnswer: any = {
                index: '',
                value: ''
            };
            let resultArray: Array<any> = [];
            let preguntas: Array<any> = [];
            let respuestas: Array<any> = [];
            let cadena: string  = '';
            $('div.faq-title_question').each((i: number, elem: any) => {
                preguntas.push(elem.children[0].data);
            });
            $('.faq-text').each((i: number, elem: any) => {
                for(let j=0; j < elem.children[0].childNodes.length; j++) {
                    if(elem.children[0].children[j].type !== 'text') {
                        cadena+='<'+elem.children[0].children[j].name+'>';
                        if(elem.children[0].children[j].children[0].name === 'strong') {
                            cadena+='<'+elem.children[0].children[j].children[0].name+'>'+elem.children[0].children[j].children[0].children[0].data+'</'+elem.children[0].children[j].children[0].name+'>';
                        } else if(elem.children[0].children[j].childNodes.length > 1) {
                            for(let k=0; k< elem.children[0].children[j].childNodes.length; k++) {
                                if(elem.children[0].children[j].children[k].type === 'text') {
                                    cadena+=elem.children[0].children[j].children[k].data;
                                }
                                if(elem.children[0].children[j].children[k].type !== 'text') {
                                    if(elem.children[0].children[j].children[k].name === 'a') {
                                        cadena+='<'+elem.children[0].children[j].children[k].name+ ' href="' + elem.children[0].children[j].children[k].attribs['href'] + '">'+elem.children[0].children[j].children[k].children[0].data +'</>';
                                    }
                                    if(elem.children[0].children[j].children[k].name === 'li') {
                                        cadena+= '<'+elem.children[0].children[j].children[k].name+'>'+elem.children[0].children[j].children[k].children[0].data+'<'+elem.children[0].children[j].children[k].name+'/>';
                                    }
                                    if(elem.children[0].children[j].children[k].name === 'ol') {
                                        cadena+= '<'+elem.children[0].children[j].children[k].name+'>'+elem.children[0].children[j].children[k].children[0].data+'<'+elem.children[0].children[j].children[k].name+'/>';
                                    }
                                }
                            }
                        } else {
                            if(elem.children[0].children[j].name === 'p') {
                                cadena+=elem.children[0].children[j].children[0].data;
                            }
                        }
                    } else {
                        if (elem.children[0].children[j].type === 'text' && elem.children[0].children[j].data === '\n') {
                            cadena+='</' +elem.children[0].children[j].prev.name+'>';
                        }
                    }
                }
                respuestas.push(cadena);
                cadena = '';
            });
            preguntas.forEach((pregunta, i) => {
                respuestas.forEach((respuesta, j) => {
                    if(i === j) {
                        singleAnswer.index = pregunta;
                        singleAnswer.value = respuesta;
                        resultArray.push(Object.assign({}, singleAnswer));
                    }
                });
            });
            //aca escribo el archivo
            let final: any = {
                result: resultArray,
                updated: moment(new Date()).format('DD/MM/YYYY hh:mm:ss')
            }
            let convertData = JSON.stringify(final);
            let convertParse = JSON.parse(convertData);
            let convertJson = JSON.stringify(convertParse);
            fs.writeFile('./src/config/questions.json', convertJson, 'utf8', function (err: any) {
                if (err) return false;
                return true;
            });
        }
    });
}

export const questionController = new QuestionController();