import axiosInstance from "./axcio";

export class ArticleService {

    getArticles() {
        return axiosInstance.get('articles/')
            .then(res => res.data);
    }

    getGroup() {
        return axiosInstance.get('article_grp/')
            .then(res => res.data);
    }

}
