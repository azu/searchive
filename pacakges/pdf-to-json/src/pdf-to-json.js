"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pdfJs = require("pdfjs-dist");
var fs = require("fs");
//  Based on https://github.com/nemanjan00/search/blob/9919cf648194524f4811f32e57d036ef880dfedf/pdf.js
var openPDF = function (filePath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, function (error, data) {
            if (error) {
                return reject(error);
            }
            var unitArray = new Uint8Array(data);
            pdfJs.getDocument(unitArray).then(function (pdf) { return resolve(pdf); });
        });
    });
};
var readPage = function (pdf, pageNumber) {
    return new Promise(function (resolve, reject) {
        pdf.getPage(pageNumber).then(function (page) {
            return page.getTextContent().then(function (page) {
                var items = page.items;
                var texts = items.map(function (item) { return item.str; });
                resolve({
                    pageNumber: pageNumber,
                    texts: texts
                });
            }, reject);
        }, reject);
    });
};
var readAllPages = function (pdf) {
    var pages = [];
    for (var i = 0; i < pdf.numPages; i++) {
        pages.push(readPage(pdf, i + 1));
    }
    return Promise.all(pages);
};
exports.pdfToJSON = function (filePath) {
    return openPDF(filePath).then(function (pdf) {
        return readAllPages(pdf);
    });
};
