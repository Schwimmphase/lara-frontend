import BasicApiCaller from "../BasicApiCaller";

export class AdminApiCaller {
    static urlUsermanagement = '/usermanagement/';
    static urlCategory = '/category/';

    public static getUsers(organizerList: string) {
        return BasicApiCaller.axiosInstance.get(this.urlUsermanagement, {
            params: {
                "organizers": organizerList
            }
        });
    }

    public static createUser(username: string, password: string, userCategory: string) {
        return BasicApiCaller.axiosInstance.post(this.urlUsermanagement, {
                "username": username,
                "password": password,
                "userCategory": userCategory
            }
        );
    }

    public static updateUser(userId: string, username: string, password: string, userCategory: string) {
        return BasicApiCaller.axiosInstance.patch(this.urlUsermanagement + userId, {
                "username": username,
                "password": password,
                "useCategory": userCategory
            }
        );
    }

    public static deleteUser(userId: string) {
        return BasicApiCaller.axiosInstance.delete(this.urlUsermanagement + userId);
    }

    public static getUserCategories() {
        return BasicApiCaller.axiosInstance.get(this.urlUsermanagement + this.urlCategory);
    }

    public static createUserCategory(name: string, color: string) {
        return BasicApiCaller.axiosInstance.post(this.urlUsermanagement + this.urlCategory, {
                "categoryname": name,
                "color": color
            }
        );
    }

    public static updateUserCategory(userCategoryId: string, name: string, color: string) {
        return BasicApiCaller.axiosInstance.patch(AdminApiCaller.urlUsermanagement + AdminApiCaller.urlCategory + userCategoryId, {
                "categoryname": name,
                "color": color
            }
        );
    }

    public static deleteUserCategory(userCategoryId: string) {
        return BasicApiCaller.axiosInstance.delete(userCategoryId);
    }
}
