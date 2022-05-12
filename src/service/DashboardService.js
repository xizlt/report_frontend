import axiosInstance from "./axcio";

export class DashboardService {

    getMainData() {
        return axiosInstance.get('main-data/')
            .then(res => res.data);
    }

}
