import React, { useState } from "react";
import axios from "axios";

function UsernameChange() {
  const [newUsername, setNewUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // JWTトークンを取得
      if (!token) {
        alert("トークンが存在しません。再ログインしてください。");
        window.location.href = "/login";
        return;
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/username/changeusername`,
        { newUsername: newUsername },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert("ユーザー名が変更されました。");
        window.location.href = "/menu";
      } else {
        alert("変更に失敗しました。再度お試しください。");
      }
    } catch (error) {
      console.error("エラー:", error.response || error);
      alert("エラーが発生しました。後ほどお試しください。");
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#f5f5f5] p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-2xl md:text-3xl font-crimson-text text-[#333333] mb-2">
              📚 Libro Log
            </h1>
          </div>
        </header>
        <h1 className="text-xl font-bold mb-6s">ユーザー名変更</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-noto-sans mb-2">新しいユーザー名</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />

          <div className="flex gap-4 mt-6">
            <button
              className="mt-4 bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
              onClick={() => (window.location.href = "/myPage")}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              変更する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UsernameChange;
