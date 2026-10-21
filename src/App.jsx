import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Admin from "./Pages/Admin";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Detail from "./Pages/Detail";
import Navbar from "./Pages/Navbar";
import Login from "./Pages/Login"; 

const ProtectedRoute = ({ children }) => {
    const isAdmin = localStorage.getItem("isAdmin");
    
    if (!isAdmin) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/detail/:id" element={<Detail />} />
                
              
                <Route path="/login" element={<Login />} />
                
                
                <Route 
                    path="/admin" 
                    element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;