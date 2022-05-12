import React from 'react';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {TreeTable} from "primereact/treetable";

export const DataForPrint = (props) => {

    return <TreeTable value={props.data} showGridlines>
                    <Column key="phone" field="phone" header="Телефон" expander style={{width: "12%"}}/>
                    {props.columns}
            </TreeTable>

}
