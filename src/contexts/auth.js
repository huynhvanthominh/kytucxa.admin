import { createContext } from "react";

const init = {
    user: {},
    login: () => { },
    getMe: () => { }
}

const AuthContext = createContext(init);

export default AuthContext;