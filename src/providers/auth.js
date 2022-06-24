import { useState } from "react"
import { userAPI } from "../apis/user.api";
import AuthContext from "../contexts/auth"
import { TOAST } from "../customs/toast-custom"
const AuthProvider = ({ children }) => {

    const [user, setUser] = useState({});

    const getMe = async () => {
        const data = localStorage.getItem("auth");
        if (data !== null) {
            const auth = JSON.parse(data)
            setUser(auth);
            return auth
        }
        return false;
    }

    const login = async (username, password, callback) => {
        try {
            const {data} = await userAPI.login({ numberPhone: username, password })
            if (data?.numberPhone?.length > 0 && data?.password?.length > 0) {
                delete data.password
                const auth = JSON.stringify(data);
                localStorage.setItem("auth", auth)
            }
            if (callback) {
                callback();
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            login,
            getMe,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;