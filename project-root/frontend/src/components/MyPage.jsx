"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles/styles.css";


function MyPage() {
  //const [user, setUser] = useState(null); // 初期値はnull

  // 初期値を固定値として設定
  const [user, setUser] = useState({
    name: "Loading...", // ユーザー名は最初は読み込み中と表示
    email: "example@email.com",
    password: "********",
  });


  // バックエンドからユーザー情報を取得
  useEffect(() => {
    // JWTトークンを取得（localStorageから）
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("トークンが見つかりません");
      return;
    }

    axios
      .get("http://localhost:8080/api/user/me",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        // nameの値を更新し、他の固定値をそのまま保持
        setUser((prevUser) => ({
          ...prevUser, // 以前のstateを保持
          name: response.data.name, // nameだけを更新
        }));
      })
      .catch((error) => {
        console.error("ユーザー情報の取得に失敗しました:", error);
      });
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-[600px]">
        <div className="flex items-center gap-3 mb-8">
          <img
            src="/images/LibroLogIcon.jpg"
            alt="Libro Logのアイコン"
            className="w-8 h-8"
          />
          <h1 className="font-noto-sans text-xl">マイページ</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-8">

            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-noto-sans text-gray-600">
                  ユーザー名
                </label>
                <button className="bg-[#4b89dc] text-white px-4 py-1 text-sm rounded hover:bg-[#357abd] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled>
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
                <button className="bg-[#4b89dc] text-white px-4 py-1 text-sm rounded hover:bg-[#357abd] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled>
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