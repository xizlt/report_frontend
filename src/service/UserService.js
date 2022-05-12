import axiosInstance from "./axcio";

export class UserService {

    getUsers() {
        return axiosInstance.get('users/')
            .then(res => res.data);
    }

}
