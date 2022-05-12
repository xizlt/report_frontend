import axiosInstance from "./axcio";

export class TransactionService {

    getTransaction(option) {
        return axiosInstance.get('transactions', {params:option})
            .then(res => res.data);
    }

    getTransactionShort(option) {
        return axiosInstance.get('transactions-short', {params:option})
            .then(res => res.data);
    }

    getTransactionChart(option) {
        return axiosInstance.get('transactions-chart', {params:option})
            .then(res => res.data);
    }

}
