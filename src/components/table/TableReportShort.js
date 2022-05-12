import React, {useRef, useState} from 'react';
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Menu} from "primereact/menu";
import {Toast} from "primereact/toast";
import {DataTable} from "primereact/datatable";
import {exExcel, exportPdf} from "../../helper/export";

export const TableReportShort = (props) => {
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedNodeKey, setSelectedNodeKey] = useState(null);

    const cols = [
        {field: 'code_1c', header: 'Код продукта'},
        {field: 'count', header: 'Отсканировано (шт.)'},
        {field: 'bonuses', header: 'Сумма бонусов'},
        {field: 'entity', header: 'Участиков (телефонов)'}
    ];

    const exportColumns = cols.map(col => ({title: col.header, dataKey: col.field}));
    const d = useRef(null);
    const exportCSV = (selectionOnly) => {
        d.current.exportCSV({selectionOnly});
    }

    const menu = useRef(null);
    const toast = useRef(null);
    const exportMenu = [
        {
            label: 'PDF',
            icon: 'pi pi-refresh',
            command: () => {
                exportPdf(exportColumns, props.dataAll)
            }
        }, {
            label: 'Excel',
            icon: 'pi pi-refresh',
            command: () => {
                exExcel(props.dataAll)
            }
        }, {
            label: 'CSV',
            icon: 'pi pi-refresh',
            command: () => {
                exportCSV(false);
            }
        },
    ];


    const header = (
        <div className="flex flex-column md:flex-row">
            <div className="flex align-items-center justify-content-left m-1 w-15rem">
                <div className="p-inputgroup">
                 <span className="p-float-label">
                     <InputText id="search_main" type="search" onInput={(e) => setGlobalFilter(e.target.value)}/>
                     <label htmlFor="search_main">Поиск</label>
                </span>

                </div>
            </div>
            <div className="flex justify-content-left w-10rem m-1">
                <Menu model={exportMenu} popup ref={menu} id="popup_menu"/>
                <Button label="Экспорт" className="p-button" icon="pi pi-caret-down" onClick={(event) => menu.current.toggle(event)} aria-controls="popup_menu"/>
            </div>
        </div>
    )

    return (<div>
        <Toast ref={toast}/>
        <DataTable value={props.dataAll} removableSort scrollable scrollHeight="flex" header={header} globalFilter={globalFilter} emptyMessage="Пусто!" resizableColumns showGridlines className="justify-content-start"
                   selectionMode="single" selection={selectedNodeKey} onSelectionChange={e => setSelectedNodeKey(e.value)} globalFilterFields={['code_1c']} ref={d}
        >
            {
                cols.map((col, index) => <Column key={index} field={col.field} header={col.header} sortable />)
            }
        </DataTable>
    </div>);
}
