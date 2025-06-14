import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

function UserEmailChange() {

  // --- タイトル ---
  useEffect(() => {
    document.title = "メールアドレス変更 | Libro Log";
  }, []);
  // --- ここまで ---
  


  const [newUserEmail, setNewUserEmail] = useState("");
  const [error, setError] = useState("");

  // メールアドレスのバリデーション（ "@"の前後に1文字以上必須, 記号はドット、アンダーバー、%+-を許可, TLD2文字以上）
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._%+-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation Check
    if (!isValidEmail(newUserEmail)) {
      setError("有効なメールアドレスを入力してください。");
      return;
    }
    setError(""); // エラーをクリア

    try {
      const token = localStorage.getItem("token"); // JWTトークンを取得
      if (!token) {
        alert("トークンが存在しません。再ログインしてください。");
        window.location.href = "/login";
        return;
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/useremail/changeemail`,
        { newUserEmail: newUserEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert("メールアドレスが変更されました。");
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
        <h1 className="text-xl font-bold mb-6s">メールアドレス変更</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-noto-sans mb-2">新しいメールアドレス</label>
          <input
            type="text"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

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

export default UserEmailChange;
