import React from "react";


export const EmptyFilter = (props) => {

    return (<div>
        <div className="grid">
            {props.mainInfo.map(item=>
            <div className="col-12 md:col-6 lg:col-3" key={item.title}>
                <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round h-full">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">{item.title}</span>
                            <div className="text-900 font-medium text-xl">{item.data.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                            <i className={`${item.icon} pi text-blue-500 text-xl`}/>
                        </div>
                    </div>
                    <span className="text-500">За эту неделю</span>
                    <span className="text-green-500 font-medium"> +{item.information.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')}</span>
                </div>
            </div>)}
        </div>
        <div className="text-4xl m-8 text-center">Для отображения результатов задайте фильтры</div>
    </div>)
}
