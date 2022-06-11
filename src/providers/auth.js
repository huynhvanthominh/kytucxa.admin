import { useState } from "react"
import AuthContext from "../contexts/auth"

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
        const data = { username, password }
        if (data) {
            const auth = JSON.stringify(data);
            localStorage.setItem("auth", auth)
        }
        if (callback) {
            callback();
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