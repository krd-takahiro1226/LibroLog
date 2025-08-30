"use client";
import React, {useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/styles.css'; 

function Top() {

  // --- タイトル ---
  useEffect(() => {
    document.title = "Libro Log";
  }, []);
  // --- ここまで ---
  
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPopup, setShowPopup] = React.useState(false);

  const navigate = useNavigate(); 

  // エラーがあればポップアップを表示
  useEffect(() => {
    const errorParam = new URLSearchParams(window.location.search).get("error");
    if (errorParam) {
      setShowPopup(true);
    }
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // サーバーへログインリクエスト
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        { username, password },
        { withCredentials: true } // 必要に応じてクッキーを有効化
      );

      console.log("サーバーレスポンス:", response.data);

      // トークンがレスポンスに含まれているか確認
      if (response.data?.token) {
        // ローカルストレージにトークンを保存
        localStorage.setItem("token", response.data.token);

        // メインページにリダイレクト
        window.location.href = "/menu";
      } else {
        // トークンがない場合はエラーを表示
        setShowPopup(true);
      }
    } catch (error) {
      console.error("ログインエラー:", error.response || error);

      // 401エラーなど特定のステータスコードをチェック
      if (error.response?.status === 401) {
        setShowPopup(true);
      } else {
        alert("サーバーエラーが発生しました。後ほどお試しください。");
      }
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#f4f1ee]">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-[#e6eaeb]">
          <img
            src="/images/LibroLogIcon.jpg"
            alt="LibroLogアイコン"
            className="w-48 h-48 mb-4"
          />
          <h2 className="text-3xl font-crimson-text text-[#2d3436] mb-2">
            Libro Log
          </h2>
          <p className="text-[#505e61] font-noto-sans">
            あなたの読書体験を記録しよう
          </p>
        </div>

        <div className="flex-1 p-12">
          <h1 className="text-2xl font-noto-sans text-[#2d3436] mb-12">
            Libro Logへようこそ！
          </h1>

          
            <div className="space-y-8">
                <div className="space-y-2">
                    <p>アカウントをお持ちの方は</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="w-full bg-[#2d3436] text-white font-noto-sans py-2 px-4 rounded-lg hover:bg-[#1e2527] transition-colors"
                    >
                        ログイン
                    </button>
                </div>

                <div className="space-y-2">
                    <p>はじめての方は</p>
                    <button 
                        onClick={() => navigate('/userRegistration')}
                        className="w-full bg-[#2d3436] text-white font-noto-sans py-2 px-4 rounded-lg hover:bg-[#1e2527] transition-colors"
                    >
                        新規登録
                    </button>
                </div>

            </div>

        </div>
      </div>
    </div>
  );
}

export default Top;
