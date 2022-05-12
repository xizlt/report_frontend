import {isArray} from "chart.js/helpers";

export const getLastDayOfMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
}


export function prepareFilterForTransaction(options) {
    let date=[]
    if (options.date){
        date.push(options.date[0].toLocaleDateString().split( '.' ).reverse( ).join( '-' ))
        date.push(options.date[1].toLocaleDateString().split( '.' ).reverse( ).join( '-' ))
    }
    return {
        "code_1c": options.articles ? options.articles.join(): "null",
        "date": options.date ? date.join(): null,
        "branch": options.branches ? options.branches.join(): "null",
        "entity": isArray(options.entity) ? options.entity.length: options.entity ? options.entity.join() : "null",
        "phone": options.phone ? options.phone.join(): "null"
    }
}
