import { useState, useEffect } from "react";

export default function Admin() {
   
    const [orchids, setOrchids] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    const [newOrchid, setNewOrchid] = useState({
        name: "",
        image: "",
        price: "",
        description: "" 
    });

    
    useEffect(() => {
        const fetchOrchids = async () => {
            try {
                const response = await fetch("https://6a48af3aa033dcb98d64ca87.mockapi.io/an1904/orchid/Orchids");
                if (!response.ok) throw new Error("Failed to fetch orchids");
                const data = await response.json();
                setOrchids(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrchids();
    }, []);

    
    const handleSubmit = async (e) => {
        e.preventDefault(); 

        if (!newOrchid.name || !newOrchid.image || !newOrchid.price) {
            alert("Vui lòng điền đầy đủ Tên, Hình ảnh và Giá!");
            return;
        }

        try {
            if (editingId) {
                
                const response = await fetch(`https://6a48af3aa033dcb98d64ca87.mockapi.io/an1904/orchid/Orchids/${editingId}`, {
                    method: 'PUT', // Dùng PUT để cập nhật
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newOrchid) 
                });

                if (!response.ok) throw new Error("Cập nhật thất bại!");
                const updatedData = await response.json();
                
                
                setOrchids(orchids.map((orchid) => (orchid.id === editingId ? updatedData : orchid)));
                setEditingId(null); // Thoát khỏi chế độ sửa
                alert("Đã cập nhật thành công!");

            } else {
                
                const response = await fetch("https://6a48af3aa033dcb98d64ca87.mockapi.io/an1904/orchid/Orchids", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newOrchid) 
                });

                if (!response.ok) throw new Error("Thêm thất bại!");
                const data = await response.json();
                
                setOrchids([...orchids, data]);
                alert("Đã thêm hoa lan thành công!");
            }

            
            setNewOrchid({ name: "", image: "", price: "", description: "" });

        } catch (err) {
            alert(err.message);
        }
    };

    
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa cây hoa lan này không?")) {
            try {
                const response = await fetch(`https://6a48af3aa033dcb98d64ca87.mockapi.io/an1904/orchid/Orchids/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) throw new Error("Xóa thất bại!");

               
                setOrchids(orchids.filter((orchid) => orchid.id !== id));
                alert("Đã xóa thành công!");
            } catch (err) {
                alert(err.message);
            }
        }
    };

    
    const handleEdit = (id) => {
        const orchidToEdit = orchids.find((orchid) => orchid.id === id);
        if (orchidToEdit) {
            setNewOrchid(orchidToEdit); 
            setEditingId(id);           
        }
    };

    
    if (loading) return <p >Đang tải dữ liệu...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    
    return (
        <div >
            <h1>Quản Trị Hoa Lan</h1>
            
            
            <div>
                <h3 style={{ marginTop: 0, color: "#555" }}>Thêm Hoa Lan Mới</h3>
                <form onSubmit={handleSubmit} style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                    <input 
                        type="text" 
                        placeholder="Tên Hoa Lan" 
                        value={newOrchid.name}
                        onChange={(e) => setNewOrchid({ ...newOrchid, name: e.target.value })}
                        style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                    <input 
                        type="text" 
                        placeholder="Link Hình Ảnh" 
                        value={newOrchid.image}
                        onChange={(e) => setNewOrchid({ ...newOrchid, image: e.target.value })}
                        style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                    <input 
                        type="number" 
                        placeholder="Giá ($)" 
                        value={newOrchid.price}
                        onChange={(e) => setNewOrchid({ ...newOrchid, price: e.target.value })}
                        style={{ width: "120px", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                    <button 
                        type="submit" 
                        >
                        Lưu Mới
                    </button>
                </form>
            </div>

            
            <table>
                <thead>
                    <tr style={{ backgroundColor: "#2c3e50", color: "white" }}>
                        <th >ID</th>
                        <th >Hình ảnh</th>
                        <th >Tên Hoa Lan</th>
                        <th >Giá</th>
                        <th >Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {orchids.map((orchid) => (
                        <tr key={orchid.id} style={{ borderBottom: "1px solid #eee", transition: "background-color 0.2s" }}>
                            <td >{orchid.id}</td>
                            <td >
                                <img 
                                    src={orchid.image} 
                                    alt={orchid.name} 
                                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }} 
                                />
                            </td>
                            <td >{orchid.name}</td>
                            <td>${Number(orchid.price).toFixed(2)}</td>
                            <td>
                                <button 
                                    onClick={() => handleEdit(orchid.id)}>
                                    Sửa
                                </button>
                                <button 
                                    onClick={() => handleDelete(orchid.id)} >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}