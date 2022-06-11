import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import "../../../css/component/login.scss"
import useAuth from "../../../hooks/useAuth";
import { TOAST } from "../../../customs/toast-custom";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";

const initValue = {
    phone: "",
    password: ""
}
const Login = () => {

    const history = useHistory();
    const { login, getMe } = useAuth();


    useEffect(() => {
        const data = localStorage.getItem("auth")
        if (data) {
            history.push("/Admin")
        }
    }, [])

    const [value, setValue] = useState(initValue);
    const check = async () => {
        if (await getMe()) {
            TOAST.SUCCESS("Đăng nhập thành công !");
            history.push("/Admin/")
        } else {
            TOAST.EROR("Sai tài khoản hoặc mật khẩu !");
        }

    }
    return (
        <div className="page_login">
            <div className="form">
                <div className="form_title">
                    <span>Sign In</span>
                </div>
                <div className="form_row">
                    <TextField label="Số điện thoại" value={value.phone} onChange={e => setValue({ ...value, phone: e.target.value })} variant="standard" type={"number"} />
                </div>
                <div className="form_row">
                    <TextField label="mật khẩu" type={"password"} variant="standard" value={value.password} onChange={e => setValue({ ...value, password: e.target.value })} />
                </div>
                <div className="form_row d-flex justify-content-end">
                    <Button color="primary" variant="contained" onClick={() => login(value.phone, value.password, check)}>Sign in</Button>
                </div>
            </div>
        </div>
    )
}

export default Login;