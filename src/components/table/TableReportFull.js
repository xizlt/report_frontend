import React, {useEffect, useRef, useState} from 'react';
import {Column} from "primereact/column";
import {TreeTable} from "primereact/treetable";
import {InputText} from "primereact/inputtext";
import {MultiSelect} from "primereact/multiselect";
import {Button} from "primereact/button";
import {Menu} from "primereact/menu";
import {Toast} from "primereact/toast";
import {exCSV, exExcel, exPDF} from "../../helper/export";
import 'jspdf-autotable'
import {Slider} from "primereact/slider";
import {Tooltip} from "primereact/tooltip";
import html2pdf from "html2pdf.js/src";
import {DataForPrint} from "./DataForPrint";


export const TableReportFull = (props) => {

    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedNodeKey, setSelectedNodeKey] = useState(null);
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        setNodes(props.dataAll);
    }, [props.dataAll]);

    const dt = useRef(null);

    let columns = [
        {field: 'region', header: 'Регион', width: 10},
        {field: 'branch', header: 'Филиал', width: 13},
        {field: 'name', header: 'Имя', width: 15},
        {field: 'organisation', header: 'Основное юр.лицо', width: 19},
        {field: 'articles', header: 'Артикулы', width: 20},
        {field: 'count', header: 'Кол-во', width: 5},
        {field: 'bonus', header: 'Баллы', width: 5},
    ];
    let colOptions = [];
    for (let col of columns) {
        colOptions.push({label: col.header, value: col});
    }
    const [cols, setCols] = useState(columns);
    const onColumnToggle = (event) => {
        setCols(event.value);
    }
    const _columns = cols.map((col, i) => {
        return <Column key={col.field} field={col.field} header={col.header} style={{width: `${col.width}%`}} sortable/>;
    });

    // Prepare export file >>>
    function prepareExcelExport(values) {
        return values.map(item => {
            delete item.data.article
            return item.data
        });
    }

    function preparePDFExport(values) {
        console.log(values)
        return values;
    }

    function prepareCSVExport(values) {
        return values.map(item => {
            delete item.data.article
            return item.data
        });
    }

    // <<< Prepare export file


    const [printAct, setPrintAct] = useState(false);
    const menu = useRef(null);
    const toast = useRef(null);
    const exportMenu = [
        {
            label: 'PDF',
            icon: 'pi pi-file-pdf',
            command: () => {
                setPrintAct(true)
                exPDF(document.getElementById('print'))
                setTimeout(() => {setPrintAct(false)}, 100)
            }
        }, {
            label: 'Excel',
            icon: 'pi pi-file-excel',
            command: () => {
                exExcel(prepareExcelExport(nodes));
                // prepareExcelExport(props.dataAll);
            }
        }        
        // , {
        //     label: 'CSV',
        //     icon: 'pi pi-file',
        //     command: () => {
        //         exCSV(prepareCSVExport(nodes));
        //     }
        // }, {
        //     label: 'Печать',
        //     icon: 'pi pi-print',
        //     command: () => {
        //         document.getElementById('print')
        //     }
        // },
    ];


    const header = (
        <div className="flex flex-column md:flex-row">
            <div className="flex align-items-center justify-content-left m-1 w-15rem">
                <div className="p-inputgroup">
                 <span className="p-float-label">
                     <InputText id="search_main" type="search" onInput={(e) => setGlobalFilter(e.target.value)} />
                     <label htmlFor="search_main">Поиск</label>
                </span>

                </div>
            </div>
            <div className="flex align-items-center justify-content-left m-1">
                <span className="p-float-label">
                    <MultiSelect value={cols} options={colOptions} onChange={onColumnToggle} style={{maxWidth: "15rem"}}/>
                    <label htmlFor="popup_menu">Отображение</label>
                </span>
            </div>
            <div className="flex justify-content-left w-10rem m-1">
                <Menu model={exportMenu} popup ref={menu} id="popup_menu"/>
                <Button label="Экспорт" className="p-button" icon="pi pi-caret-down" onClick={(event) => menu.current.toggle(event)} aria-controls="popup_menu"/>
            </div>

        </div>
    )

    const [multiSortMeta, setMultiSortMeta] = useState();

    // -----> Pagination
    const [paginationFirst, setPaginationFirst] = useState(0);
    const [paginationRows, setPaginationRows] = useState(10);
    const [totalPages, setTotalPages] = useState(200);
    const templatePagination = {
        layout: 'RowsPerPageDropdown PrevPageLink PageLinks NextPageLink CurrentPageReport',
        'RowsPerPageDropdown': (options) => {
            return (
                <div className="flex align-items-center">
                    <Tooltip target=".slider>.p-slider-handle" content={`${options.value}`} position="top" event="focus" />

                    <span className="mr-3" style={{ color: 'var(--text-color)', userSelect: 'none' }}>Кол-во на странице: </span>
                    <Slider className="slider" value={options.value} onChange={options.onChange} min={10} max={100} step={20} style={{ width: '10rem' }} />
                </div>
            );
        },
        'CurrentPageReport': (options) => {
            return (
                <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                    {options.first} - {options.last} из {options.totalRecords}
                </span>
            )
        }
    }
    const onCustomPageChange = (event) => {
        setPaginationFirst(event.first);
        setPaginationRows(event.rows);
    }
    // <------ Pagination

    return (<div>
            <div id="print">
                {printAct && <DataForPrint data={nodes} columns={_columns}/>}
            </div>

            <Toast ref={toast}/>
            <TreeTable value={nodes}
                       id="key"
                       globalFilter={globalFilter}
                       header={header}
                       emptyMessage="Пусто!"
                       paginator paginatorTemplate={templatePagination} first={paginationFirst} rows={paginationRows} onPageChange={onCustomPageChange}
                       className="justify-content-start"
                       onColReorder={e => console.log(e)}
                       sortMode="multiple" multiSortMeta={multiSortMeta}
                       onSort={(e) => setMultiSortMeta(e.multiSortMeta)}
                       ref={dt}
                       selectionMode="single"
                       reorderableColumns
                       selectionKeys={selectedNodeKey} onSelectionChange={e => setSelectedNodeKey(e.value)}
                       scrollable
                       scrollHeight={"440px"}
                       resizableColumns
                       showGridlines
            >

                <Column key="phone" field="phone" header="Телефон" expander sortable style={{width: "12%"}} />
                {_columns}
            </TreeTable>
        </div>
    );
}
