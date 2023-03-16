import type {Organizer} from "@/model/Organizer";
import BasicApiCaller from "../BasicApiCaller";

export class AdminApiCaller {
    static urlUsermanagement = '/usermanagement';
    static urlCategory = '/category';

    public static getUsers(organizers: Organizer[]) {
        return BasicApiCaller.axiosInstance.get(this.urlUsermanagement, {
            params: {
                "organizer": organizers.map(organizer => organizer.name + "=" + organizer.argument)
                    .join("&organizer=")
            }
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static createUser(username: string, password: string, userCategory: string) {
        return BasicApiCaller.axiosInstance.post(this.urlUsermanagement, {
            "username": username,
            "password": password,
            "usercategory": userCategory
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static updateUser(userId: string, username: string, password: string, userCategoryName: string) {
        return BasicApiCaller.axiosInstance.patch(this.urlUsermanagement + '/' + userId, {
            "username": username,
            "password": password,
            "usercategory": userCategoryName
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static deleteUser(userId: string) {
        return BasicApiCaller.axiosInstance.delete(this.urlUsermanagement + '/' + userId)
            .catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static getUserCategories() {
        return BasicApiCaller.axiosInstance.get(this.urlUsermanagement + this.urlCategory)
            .catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static createUserCategory(name: string, color: string) {
        return BasicApiCaller.axiosInstance.post(this.urlUsermanagement + this.urlCategory, {
            "name": name,
            "color": color
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static updateUserCategory(userCategoryId: string, name: string, color: string) {
        return BasicApiCaller.axiosInstance.patch(this.urlUsermanagement + this.urlCategory + '/' + userCategoryId, {
                "name": name,
                "color": color
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static deleteUserCategory(userCategoryId: string) {
        return BasicApiCaller.axiosInstance.delete(this.urlUsermanagement + this.urlCategory + '/' + userCategoryId)
            .catch(reason => { throw new Error(reason.response.data.message); });
    }
}
