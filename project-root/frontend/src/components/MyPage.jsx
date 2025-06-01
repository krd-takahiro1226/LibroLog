"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles/styles.css";
import { useLocation, useNavigate } from "react-router-dom";


function MyPage() {
  //const [user, setUser] = useState(null); // 初期値はnull

  // --- タイトル ---
  useEffect(() => {
    document.title = "マイページ | Libro Log";
  }, []);
  // --- ここまで ---

  // 初期値を固定値として設定
  const [user, setUser] = useState({
    name: "Loading...", // 最初は読み込み中と表示
    email: "Loading...",
    password: "********",
    role: null, // 初期値はnull
  });
  const navigate = useNavigate();



  // バックエンドからユーザー情報を取得
  useEffect(() => {
    // JWTトークンを取得（localStorageから）
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("トークンが見つかりません");
      return;
    }

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        // nameとemailの値を更新し、他の固定値をそのまま保持
        setUser((prevUser) => ({
          ...prevUser, // 以前のstateを保持
          name: response.data.name, // nameを更新
          email: response.data.email, // emailを更新
          role: response.data.role || null, // roleが存在する場合のみ更新
        }));
      })
      .catch((error) => {
        console.error("ユーザー情報の取得に失敗しました:", error);
      });

  }, []);


  return (
    <div className="min-h-screen w-screen bg-[#f5f5f5] p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <header className="flex items-center justify-between mb-12">
          <div>
            <button
              onClick={() => navigate("/menu")}
              className="text-3xl font-noto-sans hover:text-gray-600 transition-colors"
            >
              📚 Libro Log
            </button>
            <p className="text-[#666666] font-crimson-text">
              あなたの読書体験を記録・管理
            </p>
          </div>
        </header>
        <h1 className="text-xl font-bold mb-6s">ユーザー情報照会・変更</h1><br></br>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-8">

            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-noto-sans text-gray-600">
                  ユーザー名
                </label>
                <button className="bg-[#4b89dc] text-white px-4 py-1 text-sm rounded hover:bg-[#357abd] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={() => (window.location.href = "/usernameChange")}
                >
                  変更
                </button>
              </div>
              <div className="text-lg">{user.name}</div>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-noto-sans text-gray-600">
                  メールアドレス
                </label>
                <button
                  className="bg-[#4b89dc] text-white px-4 py-1 text-sm rounded hover:bg-[#357abd] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={() => (window.location.href = "/userEmailChange")}

                >
                  変更
                </button>
              </div>
              <div className="text-lg">{user.email}</div>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-noto-sans text-gray-600">
                  パスワード
                </label>
                <button
                  className="bg-[#4b89dc] text-white px-4 py-1 text-sm rounded hover:bg-[#357abd] transition-colors"
                  onClick={() => (window.location.href = "/userPassChange")}
                >
                  変更
                </button>
              </div>
              <div className="text-lg">{user.password}</div>
            </div>


            {user.role && (
              <div className="flex flex-col space-y-2">
                <label className="font-noto-sans text-gray-600">権限（管理者のみ表示）</label>
                <div className="text-lg">{user.role}</div>
              </div>
            )}

          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            className="bg-[#656d78] text-white px-6 py-2 rounded flex items-center justify-center gap-2 mx-auto hover:bg-[#434a54] transition-colors"
            onClick={() => (window.location.href = "/menu")}
          >
            <i className="fas fa-home"></i>
            メニューに戻る
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
