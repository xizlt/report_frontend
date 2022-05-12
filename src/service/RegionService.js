import axiosInstance from "./axcio";

export class RegionService {

    getBranches() {
        return axiosInstance.get('branches/')
            .then(res => res.data);
    }

}
