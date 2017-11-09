// MIT © 2017 azu
import { PDFDocumentProxy, PDFJSStatic } from "pdfjs-dist";

const pdfJs: PDFJSStatic = require("pdfjs-dist");
import * as fs from "fs";
import * as path from "path";
pdfJs.cMapUrl = path.join(require.resolve("pdfjs-dist"), "../../cmaps");
pdfJs.cMapPacked = true;
const CMapCompressionType = {
    NONE: 0,
    BINARY: 1,
    STREAM: 2
};

class NodeCMapReaderFactory {
    isCompressed: boolean;
    private baseUrl: any;

    constructor() {
        this.baseUrl = path.join(require.resolve("pdfjs-dist"), "../../cmaps/");
        this.isCompressed = true;
    }

    fetch({ name }: { name: string }) {
        if (!name) {
            return Promise.reject(new Error("CMap name must be specified."));
        }
        return new Promise((resolve, reject) => {
            let url = this.baseUrl + name + (this.isCompressed ? ".bcmap" : "");
            let fs = require("fs");
            fs.readFile(url, (error: any, data: any) => {
                if (error || !data) {
                    reject(new Error("Unable to load " + (this.isCompressed ? "binary " : "") + "CMap at: " + url));
                    return;
                }
                resolve({
                    cMapData: new Uint8Array(data),
                    compressionType: this.isCompressed ? CMapCompressionType.BINARY : CMapCompressionType.NONE
                });
            });
        });
    }
}

//  Based on https://github.com/nemanjan00/search/blob/9919cf648194524f4811f32e57d036ef880dfedf/pdf.js
const openPDF = (filePath: string): Promise<PDFDocumentProxy> => {
    return new Promise(function(resolve, reject) {
        fs.readFile(filePath, function(error, data: any) {
            if (error) {
                return reject(error);
            }
            const unitArray = new Uint8Array(data);
            (pdfJs as any)
                .getDocument({
                    data: unitArray,
                    CMapReaderFactory: NodeCMapReaderFactory
                })
                .then((pdf: PDFDocumentProxy) => resolve(pdf));
        });
    });
};

const readPage = (pdf: PDFDocumentProxy, pageNumber: number): Promise<{ pageNumber: number; texts: string[] }> => {
    return new Promise((resolve, reject) => {
        pdf.getPage(pageNumber).then(page => {
            return page.getTextContent().then(page => {
                const items = page.items;
                const texts = items.map(item => {
                    return item.str;
                });
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

export interface PdfToJSONResult {
    meta: {
        PDFFormatVersion: string;
        Title?: string;
        Author?: string;
        Creator?: string;
        Producer?: string;
        CreationDate: string;
    };
    filePath: string;
    pages: { pageNumber: number; texts: string[] }[];
}

export const pdfToJSON = (filePath: string): Promise<PdfToJSONResult> => {
    return new Promise((resolve, reject) => {
        openPDF(filePath)
            .then(pdf => {
                return readAllPages(pdf).then(pages => {
                    pdf.getMetadata().then(meta => {
                        resolve({
                            meta: {
                                PDFFormatVersion: meta.info.PDFFormatVersion,
                                Title: meta.info.Title,
                                Author: meta.info.Author,
                                Creator: meta.info.Creator,
                                Producer: meta.info.Producer,
                                CreationDate: meta.info.CreationDate
                            },
                            filePath,
                            pages: pages
                        });
                    }, reject);
                });
            })
            .catch(reject);
    });
};
