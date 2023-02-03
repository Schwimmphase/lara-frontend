import type { Organizer } from "@/model/Organizer";
import BasicApiCaller from "../BasicApiCaller";
import type { UserCategory } from "@/model/UserCategory";

export class AdminApiCaller {
    static urlUsermanagement = '/usermanagement/';
    static urlCategory = '/category/';

    public static getUsers(organizers: Organizer[]) {
        return BasicApiCaller.axiosInstance.get(this.urlUsermanagement, {
            data: {
                "organizers": organizers
            }
        });
    }

    public static createUser(username: string, password: string, userCategory: UserCategory) {
        return BasicApiCaller.axiosInstance.post(this.urlUsermanagement, {
            data: {
                "username": username,
                "password": password,
                "userCategory": userCategory
            }
        });
    }

    public static updateUser(userId: string, username: string, password: string, userCategory: UserCategory) {
        return BasicApiCaller.axiosInstance.patch(this.urlUsermanagement + userId, {
            data: {
                "username": username,
                "password": password,
                "useCategory": userCategory
            }
        })
    }

    public static deleteUser(userId: string) {
        return BasicApiCaller.axiosInstance.delete(this.urlUsermanagement + userId);
    }

    public static getUserCategories() {
        return BasicApiCaller.axiosInstance.get(this.urlUsermanagement + this.urlCategory);
    }

    public static createUserCategory(name: string, color: string) {
        return BasicApiCaller.axiosInstance.post(this.urlUsermanagement + this.urlCategory, {
            data: {
                "categoryname": name,
                "color": color
            }
        })
    }

    public static updateUserCategory(userCategoryId: string, name: string, color: string) {
        return BasicApiCaller.axiosInstance.patch(AdminApiCaller.urlUsermanagement + AdminApiCaller.urlCategory + userCategoryId, {
            data: {
                "categoryname": name,
                "color": color
            }
        });
    }

    public static deleteUserCategory(userCategoryId: string) {
        return BasicApiCaller.axiosInstance.delete(userCategoryId);
    }
}
