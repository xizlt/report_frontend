import React, {useEffect, useRef, useState} from 'react';
import classNames from 'classnames';
import {useLocation} from 'react-router-dom';
import {CSSTransition} from 'react-transition-group';

import {AppTopbar} from './AppTopbar';
import {AppMenu} from './AppMenu';
import {AppConfig} from './AppConfig';

import PrimeReact, {addLocale} from 'primereact/api';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './assets/layout/flags/flags.css';
import './assets//layout/layout.scss';
import './App.scss';
import {useAuth} from "./hook/auth.hook";
import {useRoutes} from "./router";
import {AuthContext} from './context/AuthContext'

const App = () => {

    const [layoutMode, setLayoutMode] = useState('overlay');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();

    const {accessToken, login, logout, ready} = useAuth()
    const isAuthenticated = !!accessToken
    const routes = useRoutes(isAuthenticated)

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    addLocale('ru', {
        firstDayOfWeek: 0,
        closeText: 'Закрыть',
        prevText: 'Назад',
        nextText: 'Вперёд',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        dayNamesShort: ['Воск', 'Пон', 'Вт', 'Ср', 'Четв', 'Пят', 'Суб'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        weekHeader: 'Неделя',
        FirstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: '',
        timeOnlyTitle: 'Только время',
        timeText: 'Время',
        hourText: 'Час',
        minuteText: 'Минута',
        secondText: 'Секунда',
        currentText: 'Сегодня',
        ampm: false,
        month: 'Месяц',
        week: 'неделя',
        day: 'День',
        allDayText: 'Весь день',
        today: "Сегодня",
        clear: "Очистить"
    });


    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            } else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        } else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const menu = [
        {
            label: 'Отчеты',
            items: [{
                label: 'По артикулам', icon: 'pi pi-fw pi-home', to: '/article'
            }]
        },
    ];

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

    const mainMenu = () => {
        return (<><AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
                             mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}/>
            <div className="layout-sidebar w-17rem" onClick={onSidebarClick}>
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode}/>
            </div>
        </>)
    }

    return (
        <AuthContext.Provider value={{
            accessToken, login, logout, isAuthenticated
        }}>
            <div className={wrapperClass} onClick={onWrapperClick}>
                {isAuthenticated ? <>
                        {mainMenu()}
                        <div className="layout-main-container" style={{paddingTop: "4rem", paddingBottom: "0rem"}}>
                            <div className="layout-main">
                                {routes}
                            </div>
                        </div>
                    </> :
                    <div className="layout-main-container" style={{marginLeft: '0px'}}>
                        <div className="layout-main">
                            {routes}
                        </div>
                    </div>
                }

                <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                           layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange}/>
                <CSSTransition classNames="layout-mask" timeout={{enter: 200, exit: 200}} in={mobileMenuActive} unmountOnExit>
                    <div className="layout-mask p-component-overlay"/>
                </CSSTransition>
            </div>
        </AuthContext.Provider>
    );

}

export default App;
