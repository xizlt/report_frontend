import React from 'react';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import {DataForPrint} from "../components/table/DataForPrint";
import html2pdf from "html2pdf.js/src";

export function exExcel(data) {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    import('xlsx').then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
        const excelBuffer = xlsx.write(workbook, {bookType: 'xlsx', type: 'array', Props: {Author: "FIT-Отчет"}});
        saveAsExcelFile(excelBuffer, 'analise_data', fileType, fileExtension);
    })
}

export function exPDF(prnt) {
    let element = prnt;

    let opt = {
        margin:       0.3,
        filename:     'analise_data.pdf',
        image:        { type: 'jpeg', quality: 0.95 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();

}

export function exportPdf(exportColumns, products) {
    import('jspdf').then(jsPDF => {
        import('jspdf-autotable').then(() => {
            const doc = new jsPDF.default(0, 0);
            doc.autoTable(exportColumns, products);
            doc.save('analise_data.pdf');
        });
    });
}

export function exCSV(data) {
    const fileType = 'text/csv;encoding:utf-8';
    const fileExtension = '.csv';

    import('xlsx').then(xlsx => {
        const workbook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
        const worksheet = xlsx.utils.sheet_to_csv(data, {strip: true});

        const excelBuffer = xlsx.write(workbook, {bookType: 'csv', type: 'array', Props: {Author: "FIT-Отчет"}});
        saveAsExcelFile(excelBuffer, 'analise_data', fileType, fileExtension);
    });
}

const saveAsExcelFile = (buffer, fileName, fileType, fileExtension) => {
    import('file-saver').then(FileSaver => {
        let EXCEL_TYPE = fileType
        let EXCEL_EXTENSION = fileExtension
        const data = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
}
