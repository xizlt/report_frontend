import React, {useEffect, useState} from 'react';
import {Chart} from 'primereact/chart';
import {SelectButton} from "primereact/selectbutton";
import {locale} from 'primereact/api';
import {TransactionService} from "../../service/TransactionService";
import {getLastDayOfMonth, prepareFilterForTransaction} from "../../helper/tools";
import {Tooltip} from "primereact/tooltip";
import {ScrollPanel} from "primereact/scrollpanel";

const colorLight = [
    "#74d6e0",
    "#edb795",
    "#74aff3",
    "#a8c280",
    "#e1b0dd",
    "#94d5a7",
    "#bcb8ec",
    "#dbefb7",
    "#a2bfe9",
    "#eadaa1",
    "#7bcaed",
    "#bbbc81",
    "#edaab4",
    "#7fe1cf",
    "#cfb793",
    "#bcf0d7",
    "#80b6aa",
    "#b9cda1",
    "#9bd1c6",
    "#98c3a6"
]
const colorDark = [
    "#b6a940",
    "#5672dc",
    "#6daf44",
    "#475ca9",
    "#56b776",
    "#7f9ee2",
    "#326d25",
    "#3f84bc",
    "#718c3b",
    "#4e5986",
    "#81752c",
    "#65b0c8",
    "#575c30",
    "#949dbb",
    "#43815d",
    "#416074",
    "#a1a47d",
    "#4c5e4f",
    "#5eb5a1",
    "#598a8b"
]

export const ChardArticle = (props) => {

    const defaultValue = {
        total: 0,
        model: '',
        labels: [],
        items: [
            {
                label: "",
                name: "",
                data: [],
                sum: 0,
            }
        ]
    }

    const [node, setNode] = useState(defaultValue)

    const [lineOptions, setLineOptions] = useState(null)
    const [pieOptions, setPieOptions] = useState(null)

    const [showChart, setShowChart] = useState(false)

    const [selectedTypeAnal, setSelectedTypeAnal] = useState("lin");

    const labelLocal = locale("ru");
    let connectData = new TransactionService();

    const monthLabel = labelLocal.options.monthNamesShort;
    const weekLabel = labelLocal.options.dayNamesMin;
    const yearLabel = [2020, 2021, new Date().getFullYear()];

    const dayLabel = Array.from({
        length: props.filtersParam.date ? getLastDayOfMonth(props.filtersParam.date[0].getMonth()+1, props.filtersParam.date[0].getFullYear()) : 31
    }, (v, k) => k + 1);

    useEffect(() => {
        if (props.dataChart) {
            connectData.getTransactionChart(prepareFilterForTransaction(props.filtersParam)).then(data => {
                    setNode(data.data.items?.length ? data.data : defaultValue);
                   setShowChart(!!data.data.items?.length)
                }
            );
        }
    }, [props.dataChart, props.filtersParam]);


    useEffect(() => {
        connectData.getTransactionChart(prepareFilterForTransaction(props.filtersParam)).then(data => {
                setNode(data.data.items?.length ? data.data : defaultValue);
                setShowChart(!!data.data.items?.length)
            }
        );
    }, []);

    const doughnutData = {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: []
        }]
    };

    if (showChart)
    node.items.map((item, i) => {
        doughnutData.labels.push(item.label);
        doughnutData.datasets[0].data.push(item.sum);
        doughnutData.datasets[0].backgroundColor.push(colorDark[i]);
        doughnutData.datasets[0].hoverBackgroundColor.push(colorDark[i]);
    })


    function getModelLabels(model) {
        if (model === 'month')
            return monthLabel
        else if (model === 'year')
            return yearLabel
        else if (model === 'week')
            return weekLabel
        else if (model === 'day')
            return dayLabel
        else
            return node.labels
    }

    const lineData = {
        labels: getModelLabels(node.model),
        datasets: node.items.map((item, i) => (
            {
                label: item.label,
                data: item.data,
                fill: false,
                backgroundColor: props.colorMode === 'light' ? colorLight[i] : colorDark[i],
                borderColor: props.colorMode === 'light' ? colorLight[i] : colorDark[i],
                tension: .4
            }
        ))
    };

    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#090909'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#090909'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
                y: {
                    ticks: {
                        color: '#090909'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
            }
        };

        const pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#090909'
                    }
                }
            }
        };
        setLineOptions(lineOptions)
        setPieOptions(pieOptions)
    }
    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#090909'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#090909'
                    },
                    grid: {
                        color: 'rgb(198,219,241)',
                    }
                },
                y: {
                    ticks: {
                        color: '#090909'
                    },
                    grid: {
                        color: 'rgb(198,219,241)',
                    }
                },
            }
        };
        const pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#090909'
                    }
                }
            }
        };
        setLineOptions(lineOptions)
        setPieOptions(pieOptions)
    }
    useEffect(() => {
        if (props.colorMode === 'light') {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    }, [props.colorMode]);


    const justifyOptions = [
        {icon: 'pi pi-chart-line', value: 'lin', name: 'Линейный'},
        {icon: 'pi pi-chart-bar', value: 'bar', name: 'Столбцы'},
        {icon: 'pi pi-chart-pie', value: 'doug', name: 'Пончик'},
    ];


    const justifyTemplate = (option) => {
        return <i className={`${option.icon} justify-content-center`}/>;
    }

    return (<>
        {showChart ?
        <div className="grid max-h-screen">
            <div className="mt-2 sm:col-12 lg:col-9 md:col-12">
                <div>
                    <SelectButton value={selectedTypeAnal} options={justifyOptions} onChange={(e) => setSelectedTypeAnal(e.value)} itemTemplate={justifyTemplate}/>
                </div>
                <div>
                    {selectedTypeAnal === "lin" && <Chart type="line" data={lineData} options={lineOptions}/>}
                    {selectedTypeAnal === "bar" && <Chart type="bar" data={lineData} options={lineOptions}/>}
                    {selectedTypeAnal === "doug" && <div className="flex flex-column align-items-center">
                        <Chart type="doughnut" data={doughnutData} options={pieOptions} style={{width: '50%'}}/>
                    </div>}
                </div>
            </div>

            <div className="mt-2 sm:col-12 lg:col-3 md:col-12">
                <div className=" justify-content-between align-items-center mb-5">
                    <h5>Показатели</h5>
                </div>
                <ScrollPanel style={{height: '510px'}}>
                <ul className="list-disc p-0 m-0">
                    {node.items.map((item, i) =>
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4" key={i}>
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0 tt" data-pr-tooltip={item.name}>{item.name} ({item.label})</span>
                                <div className="mt-1 text-600">{item.sum} шт.
                                </div>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{height: '8px'}}>
                                    <div className="h-full" style={{
                                        width: `${
                                            ((item.sum * 100) / node.total).toFixed(2)
                                        }%`,
                                        backgroundColor: lineData.datasets[i].backgroundColor
                                    }}/>
                                </div>
                                <span className="ml-3 font-medium" style={{color: lineData.datasets[i].backgroundColor}}>{
                                    ((item.sum * 100) / node.total).toFixed(2)
                                } %</span>
                            </div>
                        </li>
                    )}
                </ul>
                </ScrollPanel>
            </div>

        </div>
        : <div>Пусто!</div>}
        </>
    )
}
