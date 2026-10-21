export default function Contact() {
    return (
        <div>
            <h1>Liên Hệ Với Chúng Tôi</h1>
            <p>Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào, vui lòng điền thông tin vào form dưới đây. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
            
            <form>
                <div>
                    <label htmlFor="name">Họ và tên: </label>
                    <br />
                    <input type="text" id="name" placeholder="Nhập tên của bạn" />
                </div>
                <br />
                
                <div>
                    <label htmlFor="email">Email: </label>
                    <br />
                    <input type="email" id="email" placeholder="Nhập email của bạn" />
                </div>
                <br />
                
                <div>
                    <label htmlFor="message">Nội dung tin nhắn: </label>
                    <br />
                    <textarea id="message" rows="5" cols="40" placeholder="Bạn muốn nhắn gửi điều gì?"></textarea>
                </div>
                <br />
                
                <button type="submit">
                    Gửi Tin Nhắn
                </button>
            </form>
            
            <hr />
            <h3>Thông tin liên hệ trực tiếp:</h3>
            <p><strong>Email:</strong> admin@orchids-management.com</p>
            <p><strong>Điện thoại:</strong> +84 123 456 789</p>
            <p><strong>Địa chỉ:</strong> Thành phố Hồ Chí Minh, Việt Nam</p>
        </div>
    );
}