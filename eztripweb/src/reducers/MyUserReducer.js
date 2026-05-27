import { clearStoredAuth } from "@utils/localStorageHelper";

export default (current, action) => {
    switch (action.type) {
        case "LOGIN":
            return action.payload;
        case "LOGOUT":
            clearStoredAuth();
            return null;
    }
    return current;
};
