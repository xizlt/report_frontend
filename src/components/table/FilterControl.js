import React, {useEffect, useRef, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {MultiSelect} from "primereact/multiselect";
import {InputSwitch} from "primereact/inputswitch";
import {Divider} from "primereact/divider";
import {Calendar} from 'primereact/calendar';
import {Button} from "primereact/button";
import {AutoComplete} from "primereact/autocomplete";
import {Tree} from "primereact/tree";
import {ArticleService} from "../../service/ArticleService";
import {Toast} from "primereact/toast";
import {RegionService} from "../../service/RegionService";
import {OverlayPanel} from "primereact/overlaypanel";
import {Checkbox} from "primereact/checkbox";
import {getLastDayOfMonth} from "../../helper/tools";


export const FilterControl = (props) => {
    const defaultForScore = [0, 500]
    const defaultForQnt = [0, 500]

    const [branches, setBranches] = useState();

    const [phoneValue, setPhoneValue] = useState(null);
    const [entityValue, setEntityValue] = useState([]);

    const [checkedRegion, setCheckedRegion] = useState(false);
    const [dateFilter, setDateFilter] = useState(null);

    const [selectedArticles, setSelectedArticles] = useState(null);
    const [articleFilter, setArticleFilter] = useState([]);
    const [articles, setArticles] = useState();

    const [groupArticles, setGroupArticles] = useState([]);

    const [quantityFilter, setQuantityFilter] = useState(defaultForQnt);
    const [scoreFilter, setScoreFilter] = useState(defaultForScore);

    const articleService = new ArticleService();

    const toast = useRef(null);
    const op = useRef(null);

    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();

    const sendMassageOk = (data) => {
        toast.current.show({severity: 'success', summary: 'Добавлено', detail: `Вы добавили ${data}`})
    }
    const sendMassageError = (data) => {
        toast.current.show({severity: 'error', summary: 'Ошибка', detail: `${data}`})
    }

    useEffect(() => {
        const branchesService = new RegionService();
        branchesService.getBranches().then(data => setBranches(data.data)).catch(err => sendMassageError(err));
    }, [])


    const getArticles = () => {
        articleService.getArticles().then(data => setArticles(data)).catch(err => sendMassageError(err));
    }

    // useEffect(() => {
    //     setArticles([{name: "12544"}, {name: "12545"}]);
    //
    //    console.log("Изменения")
    //
    // }, [phoneValue, entityValue, selectedArticles, quantity, score, filterDate, ]);

    const searchArticle = (event) => {
//        setTimeout(() => {
            let _filteredArticles;
            if (!event.query.trim().length) {
                _filteredArticles = [...articles];
            } else {
                _filteredArticles = articles.filter((i) => {
                    return i.name.startsWith(event.query);
                });
            }
            setArticleFilter(_filteredArticles);
//        }, 250);
    }

    const [branchFilter, setBranchFilter] = useState(null);

    const [yearFilter, setYearFilter] = useState(null);
    const [mouthFilter, setFilterMonth] = useState(null);

    const [showCalendar, setShowCalendar] = useState(false);


    const dateNavigatorTemplate = (e, type) => {
        return <>
            <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} className="p-ml-2" style={{lineHeight: 1}}/>
            {type === 'year' && <Button label={showCalendar ? "По дате" : "По месяцам"}
                                        className="p-button-info p-button-text"
                                        onClick={() => setShowCalendar(!showCalendar)}/>}
        </>
    }

    const clearDataFilter = () => {
        setDateFilter(null)
        setFilterMonth(null)
        setYearFilter(0)
    }

    const selectDateYear = (val) => {
        if (dateFilter) {
            dateFilter[0].getDate()
            dateFilter[0].setFullYear(val)
        }
    }

    const selectDateMouth = (val) => {
        return val;
    }

    const footerActions = () => {
        return <>
            <Button label="Месяц" className="p-button-success p-button-text" onClick={() => selectDateMouth(mouthFilter)}/>
            <Button label="Год" className="p-button-success p-button-text" onClick={() => selectDateYear(yearFilter)}/>
        </>
    }


    const changeSelectAllBranches = (e) => {
        setCheckedRegion(e);
        if (e) {
            let res = {}
            branches.map(i => {
                res[i.key] = {
                    "checked": true,
                    "partialChecked": false
                };
                if (i.children)
                    i.children.map((k, n) =>
                        res[i.children[n].key] = {
                            "checked": true, "partialChecked": false
                        }
                    )
            })

            setBranchFilter(res);
        } else {
            setBranchFilter(null)
        }
    }
    const mainFiltersEmpty = {
        branches: [],
        articles: [],
        date: [],
        count: [],
        bonus: [],
        phone: [],
        organisation: []
    }
    const [mainFilters, setMainFilters] = useState(mainFiltersEmpty);


    function fullMonth(date) {
        if (date && date.length === 2) {
            if (date[0].getTime() === date[1]?.getTime()) {
                date[1].setDate(getLastDayOfMonth(date[1].getFullYear(), date[1].getMonth()));
            }
        }
        return date;
    }

    useEffect(() => {

        setMainFilters({
            branches: branchFilter && Object.keys(branchFilter).filter(function (number) {
                return number.length >= 3;
            }),
            articles: selectedArticles && selectedArticles.map(i => i.code || i),
            date: dateFilter && fullMonth(dateFilter),
            quantity: quantityFilter[0] === defaultForQnt[0] && quantityFilter[1] === defaultForQnt[1] ? [] : quantityFilter,
            score: scoreFilter[0] === defaultForScore[0] && scoreFilter[1] === defaultForScore[1] ? [] : scoreFilter,
            phone: phoneValue && phoneValue.map(i => i.name),
            entity: entityValue && entityValue.map(i => i.code)
        })
    }, [branchFilter, selectedArticles, dateFilter, quantityFilter, scoreFilter, phoneValue, entityValue, selectedGroupArticles]);

    useEffect(() => {

        if (mainFilters.articles && (mainFilters.date && mainFilters.date[1]) && mainFilters.branches) {
            // setTimeout(() => {
                props.setFilters(mainFilters)
            // }, 1000);
        }

    }, [mainFilters]);


    const [selectedGroupArticles, setSelectedGroupArticles] = useState(groupArticles.slice(1, 3));
    const onArticlesGroupChange = (e) => {
        let _selectedGroupArticles = [...selectedGroupArticles];

        if (e.checked) {
            _selectedGroupArticles.push(e.value);
        } else {
            for (let i = 0; i < _selectedGroupArticles.length; i++) {
                const selectedGroupArticle = _selectedGroupArticles[i];

                if (selectedGroupArticle.id === e.value.id) {
                    _selectedGroupArticles.splice(i, 1);
                    break;
                }
            }
        }
        setSelectedGroupArticles(_selectedGroupArticles);
        let _art = []
        _selectedGroupArticles.map(i => _art = [..._art, ...i.articles])
        setSelectedArticles(_art)
    }

    function getGroupArticles() {
        articleService.getGroup().then(data => setGroupArticles(data.data)).catch(err => sendMassageError(err));
    }

    return <div>
        <Toast ref={toast} position="bottom-left"/>
        <div className="mb-3">Все <InputSwitch checked={checkedRegion} onChange={(e) => changeSelectAllBranches(e.value)}/></div>
        <Tree value={branches} selectionMode="checkbox" selectionKeys={branchFilter} onSelectionChange={e => setBranchFilter(e.value)} style={{border: 0, padding: 0}}
              filterPlaceholder="Поиск филиала или региона" filter/>

        <div className="p-fluid p-col-12 p-md-4 mt-3">
            <span className="p-float-label">
                <AutoComplete value={selectedArticles} suggestions={articleFilter} completeMethod={searchArticle} field="name" multiple onChange={(e) => setSelectedArticles(e.value)} id="articles" onClick={getArticles}/>
                <label htmlFor="articles">Артикулы</label>
            </span>
            <div className="flex justify-content-between">
                <Button label="По группе" icon="pi pi-list" className="p-button-primer p-button-text" iconPos="right" style={{width: "90px", padding: "1px"}}
                        onClick={(e) => {
                            getGroupArticles();
                            op.current.toggle(e);
                        }} aria-haspopup aria-controls="articles-group"
                />
                <Button label="Очистить" icon="pi pi-filter" className="p-button-primer p-button-text" iconPos="right" style={{width: "90px", padding: "1px"}} onClick={() => {
                    setSelectedArticles(null);
                    setSelectedGroupArticles([]);
                    setArticleFilter([])
                }}/>
            </div>
        </div>

        <OverlayPanel ref={op} showCloseIcon id="articles-group" style={{width: '350px'}}>
            <div>
                <h5>Выберете группу:</h5>
                {groupArticles.map((art) => {
                    return (
                        <div key={art.name} className="field-checkbox">
                            <Checkbox inputId={art.id} name="group_art" value={art} onChange={onArticlesGroupChange} checked={selectedGroupArticles.some((item) => item.id === art.id)}/>
                            <label htmlFor={art.id}>{art.name}</label>
                        </div>
                    )
                })
                }
            </div>
        </OverlayPanel>


        <div className="p-field p-col-12 p-md-4 mt-3">
            <span className="p-float-label">
                <Calendar id="range" value={dateFilter} onChange={(e) => setDateFilter(fullMonth(e.value))}
                          selectionMode={"range"}
                          dateFormat="dd.mm.yy" readOnlyInput locale="ru"
                          view={showCalendar ? "month" : "date"}
                          style={{border: 0, padding: 0}}
                          maxDate={!showCalendar && today}
                          yearRange={`2020:${year}`}
                          monthNavigator
                          monthNavigatorTemplate={(e) => dateNavigatorTemplate(e, "month")}
                          yearNavigator
                          yearNavigatorTemplate={(e) => dateNavigatorTemplate(e, "year")}
                    // footerTemplate={footerActions}
                          className="w-full"
                          showButtonBar
                          onClearButtonClick={clearDataFilter}
                />
                <label htmlFor="range">Дата</label>
            </span>
        </div>

        {/*<h5>Уточнение по шт.:</h5>*/}
        {/*<div className="p-fluid p-col-12 p-md-4 mr-2 mb-4">*/}
        {/*    <p>Кол-во с {quantityFilter[0]} по {quantityFilter[1]}</p>*/}
        {/*    <Slider value={quantityFilter} onChange={(e) => setQuantityFilter(e.value)} range step={5} max={500} min={0}/>*/}
        {/*</div>*/}

        {/*<div className="p-fluid p-col-10 p-md-4 mr-2 mb-4">*/}
        {/*    <p>Cумма балов с {scoreFilter[0]} по {scoreFilter[1]}</p>*/}
        {/*    <Slider value={scoreFilter} onChange={(e) => setScoreFilter(e.value)} range step={50} max={500} min={0}/>*/}
        {/*</div>*/}

        <Divider/>

        <h5>Детализация по пользователям:</h5>

        <MultiSelect value={phoneValue} onChange={(e) => setPhoneValue(e.value)} options={props.phoneValues} optionLabel="name" placeholder="Выбрать телефоны" filter
                     className="multiselect-custom mr-2 mb-2 w-full" showClear style={{width: "100%", maxWidth: "15rem"}}/>

        <MultiSelect value={entityValue} onChange={(e) => setEntityValue(e.value)} options={props.entityValues} optionLabel="name" placeholder="Выбрать юр.лица" filter
                     className="multiselect-custom" style={{width: "100%", maxWidth: "15rem"}} showClear/>
    </div>
}
