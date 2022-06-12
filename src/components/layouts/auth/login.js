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
            <section className="h-100 gradient-form" >
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-lg-6">
                            <div className="card rounded-3 text-black">

                                <div className="card-body p-md-5 mx-md-4">

                                    <div className="text-center">
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp" style={{ width: 185 }}
                                            alt="logo" />
                                        <h4 className="mt-1 mb-5 pb-1">Đăng Nhập Hệ Thống</h4>
                                    </div>



                                    <div className="form-outline mb-4">
                                        <label className="form-label" htmlFor="form2Example11">Tài Khoản:</label>
                                        <input type="email" id="form2Example11" className="form-control"
                                            placeholder="Nhập số điện thoại..." />
                                    </div>

                                    <div className="form-outline mb-4">
                                        <label className="form-label" htmlFor="form2Example22">Mật Khẩu:</label>
                                        <input type="password" placeholder="Nhập mật khẩu..." id="form2Example22" className="form-control" />
                                    </div>

                                    <div className="text-center pt-1 mb-5 pb-1">
                                        <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3" style={{ width: "100%" }} onClick={() => login(value.phone, value.password, check)} type="button">Log
                                            in</button>
                                        <a className="text-muted" href="#!">Quên mật khẩu?</a>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-center pb-4">
                                        <p className="mb-0 me-2">Bạn chưa có tài khoản?</p>
                                        <button type="button" className="btn btn-outline-danger">Tạo mới tài khoản!</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Login;