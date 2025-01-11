"use client";
import React from "react";
import axios from "axios";
import "../assets/styles/styles.css";


function MyPage() {
  const [user] = React.useState({
    name: "test_user",
    email: "example@email.com",
    password: "********",
  });

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
              <label className="font-noto-sans text-gray-600">ユーザー名</label>
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
                <button className="bg-[#4b89dc] text-white px-4 py-1 text-sm rounded hover:bg-[#357abd] transition-colors">
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