import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtnvfePkT9eAPoiJAuHbBUDvwP1igckxE",
  authDomain: "lab06-e63f3.firebaseapp.com",
  projectId: "lab06-e63f3",
  storageBucket: "lab06-e63f3.firebasestorage.app",
  messagingSenderId: "1076031010254",
  appId: "1:1076031010254:web:8a2aa25aed1187d4d0679f",
  measurementId: "G-NDQRLCW2YG"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Bắt buộc hiển thị hộp thoại chọn tài khoản Google mỗi lần bấm đăng nhập
googleProvider.setCustomParameters({
  prompt: "select_account"
});

export default app;
