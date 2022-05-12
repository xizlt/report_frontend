import React, {useEffect, useState} from 'react';
import {TableReportFull} from "../components/table/TableReportFull";
import {FilterControl} from "../components/table/FilterControl";
import '../MainCust.css';
import {TabPanel, TabView} from "primereact/tabview";
import {ChardArticle} from "../components/chart/ChartArticul";
import {TableReportShort} from "../components/table/TableReportShort";
import {ScrollPanel} from "primereact/scrollpanel";
import {EmptyFilter} from "../components/table/Empty";
import {TransactionService} from "../service/TransactionService";
import {DashboardService} from "../service/DashboardService";
import {prepareFilterForTransaction} from "../helper/tools";


export const MainPage = () => {

    const [dataMain, setDataMain] = useState([]);
    const [filters, setFilters] = useState({});
    const [filteredData, setFilteredData] = useState([]);
    const [filteredDataShort, setFilteredDataShort] = useState([]);
    const [dataChart, setDataChart] = useState(false);

    const [phoneValues, setPhoneValues] = useState([]);
    const [entityValues, setEntityValues] = useState([]);

    const [quantityValue, setQuantityValue] = useState([]);
    const [scoreValue, setScoreValue] = useState([]);
    const [showEmptyPage, setShowEmptyPage] = useState(true);

    Object.filter = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate));

    let connectData = new TransactionService();
    let dashboardService = new DashboardService();


    useEffect(() => {
        dashboardService.getMainData().then(data => setDataMain(data.data));
    }, []);


    useEffect(() => {
        let filters_ = Object.filter(filters, ([i, item]) => item?.length);

        if (Object.keys(filters_).length === 0) {
            setShowEmptyPage(true)
        } else {
            connectData.getTransaction(prepareFilterForTransaction(filters_)).then(data => {
                setFilteredData(data.data);
                setPhoneValues(data.data.map(i => {
                    return {name: i.data.phone, code: i.data.phone}
                }))
                setEntityValues(data.data.map(i => {
                    return {name: i.data.organisation, code: i.data.organisation}
                }))

                connectData.getTransactionShort(prepareFilterForTransaction(filters_)).then(data => setFilteredDataShort(data.data));

            });
            setShowEmptyPage(false)
            setDataChart(true)
        }

        setQuantityValue([20, 100])
        setScoreValue([20, 100])

    }, [filters]);


    const tabHeaderITemplate = (options, icon) => {
        return (
            <button type="button" onClick={options.onClick} className={options.className}>
                <i className={`pi ${icon} p-mr-2 pr-2`}/>
                {options.titleElement}
            </button>
        );
    };

    const [activeIndex, setActiveIndex] = useState(0);

    const getShortData = (index) => {
        if (index === 2) {
            connectData.getTransactionShort(prepareFilterForTransaction(filters)).then(data => setFilteredDataShort(data.data));
        } else if (index === 1) {
            setDataChart(true)
        }
    }

    return (
        <div className="grid p-col-12">
            <div className="xl:col-10 sm:col-12 md:col-12 lg:col-10">
                <div className="card">
                    <h3>Отчет по артикулам </h3>
                    {showEmptyPage ?
                        <EmptyFilter mainInfo={dataMain}/>
                        :
                        <TabView activeIndex={activeIndex} onTabChange={(e) => {
                            setActiveIndex(e.index);
                            getShortData(e.index);
                        }}>
                            <TabPanel header="Полный отчет" headerTemplate={(e) => tabHeaderITemplate(e, ' pi-list')}>
                                <TableReportFull dataAll={filteredData} setDataAll={setFilteredData}/>
                            </TabPanel>
                            <TabPanel header="Графики">
                                <ChardArticle filtersParam={filters} dataChart={dataChart}/>
                            </TabPanel>
                            <TabPanel header="Общий отчет" headerTemplate={(e) => tabHeaderITemplate(e, ' pi-server')}>
                                <TableReportShort dataAll={filteredDataShort}/>
                            </TabPanel>
                        </TabView>}
                </div>
            </div>

            <div className="xl:col-2 sm:col-12 md:col-12 lg:col-2">
                <ScrollPanel style={{height: '762px'}}>
                    <div className="card" style={{padding: '1em'}}>
                        <h3>Фильтры</h3>
                        <FilterControl filters={filters} setFilters={setFilters} phoneValues={phoneValues} entityValues={entityValues} scoreValue={scoreValue} quantityValue={quantityValue}/>
                    </div>
                </ScrollPanel>
            </div>

        </div>
    );
}
