// MIT © 2017 azu
import { PDFDocumentProxy, PDFJSStatic } from "pdfjs-dist";

const pdfJs: PDFJSStatic = require("pdfjs-dist");
import * as fs from "fs";

//  Based on https://github.com/nemanjan00/search/blob/9919cf648194524f4811f32e57d036ef880dfedf/pdf.js
const openPDF = (filePath: string): Promise<PDFDocumentProxy> => {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, function (error, data: any) {
            if (error) {
                return reject(error);
            }
            const unitArray = new Uint8Array(data);
            pdfJs.getDocument(unitArray).then((pdf: PDFDocumentProxy) => resolve(pdf));
        });
    });
};

const readPage = (pdf: PDFDocumentProxy, pageNumber: number): Promise<{ pageNumber: number, texts: string[] }> => {
    return new Promise((resolve, reject) => {
        pdf.getPage(pageNumber).then(page => {
            return page.getTextContent().then(page => {
                const items = page.items;
                const texts = items.map(item => item.str);
                resolve({
                    pageNumber,
                    texts: texts
                });
            }, reject);
        }, reject);
    });
};

const readAllPages = (pdf: PDFDocumentProxy) => {
    const pages = [];
    for (let i = 0; i < pdf.numPages; i++) {
        pages.push(readPage(pdf, i + 1));
    }
    return Promise.all(pages);
};

export const pdfToJSON = (filePath: string) => {
    return openPDF(filePath).then(pdf => {
        return readAllPages(pdf);
    });
};
