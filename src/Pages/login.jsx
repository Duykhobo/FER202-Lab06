import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        
        
        if (username === "admin" && password === "123456") {
           
            localStorage.setItem("isAdmin", "true");
            alert("Đăng nhập thành công!");
            navigate("/admin"); 
        } else {
            alert("Sai tài khoản hoặc mật khẩu!");
        }
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <h2>Đăng Nhập</h2>
                
                <input
                    type="text"
                    placeholder="Tài khoản (admin)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                
                <input
                    type="password"
                    placeholder="Mật khẩu (123456)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                
                <button type="submit">
                    Vào Trang Quản Trị
                </button>
            </form>
        </div>
    );
}