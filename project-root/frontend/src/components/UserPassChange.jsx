"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/styles.css";


function UserPassChange() {

  // --- タイトル ---
  useEffect(() => {
    document.title = "パスワード変更 | Libro Log";
  }, []);
  // --- ここまで ---

  const [oldpassword, setOldPassword] = React.useState("");
  const [newpassword, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordStrength, setPasswordStrength] = useState("");


  useEffect(() => {
    // トークンをローカルストレージから取得
    const token = localStorage.getItem("token");
    if (!token) {
      alert("トークンが存在しません。再ログインしてください。");
      window.location.href = "/login";
      return;
    }

    // トークンの有効期限を確認
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (Date.now() >= decodedToken.exp * 1000) {
        alert("トークンの有効期限が切れています。再ログインしてください。");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
    } catch (error) {
      console.error("トークンの解析に失敗しました:", error);
      alert("無効なトークンです。再ログインしてください。");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // 新しいパスワードの強度をチェック
    if (newpassword.length === 0) {
      setPasswordStrength(""); // 何も入力されていないときは空
      return;
    }
    const strength = checkPasswordStrength(newpassword);
    setPasswordStrength(strength);

  }, [newpassword]);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    let weakFlag = 0;
    if (password.length >= 8) strength++;
    // if (/[A-Z]/.test(password)) strength++;
    // if (/[a-z]/.test(password)) strength++;
    // if (/[0-9]/.test(password)) strength++;
    // if (/[\W]/.test(password)) strength++;

    if (password === "password") weakFlag = 1;
    if (password === "qwertyui") weakFlag = 1;
    if (password === "00000000") weakFlag = 1;
    if (password === "12345678") weakFlag = 1;
    if (password === "01234567") weakFlag = 1;

    if (strength <= 0) return "パスワードは8文字以上で設定してください。";
    if (weakFlag === 1) return "そのパスワードは使用できません。";
    // if (strength <= 2) return "Weak";
    // if (strength === 3) return "Moderate";
    return "OK";
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // 新しいパスワードの一致確認
    if (newpassword !== confirmPassword) {
      alert("新しいパスワードが一致しません。入力内容を確認してください。");
      return;
    }

    // 新しいパスワードの強度をチェック（要件を満たさない場合はエラーメッセージを表示）
    if (newpassword.length === 0) {
      alert("新しいパスワードが入力されていません。");
      return;
    }
    const strength = checkPasswordStrength(newpassword);
    if (strength !== "OK") {
      alert(strength);
      return;
    }

    try {
      const token = localStorage.getItem("token"); // トークンを取得
      if (!token) {
        alert("トークンが存在しません。再ログインしてください。");
        window.location.href = "/login";
        return;
      }

      // サーバーへ変更リクエストを送信（PUTメソッド）
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/userPassword/change`,
        {
          oldPassword: oldpassword, // キー名は"oldPassword"に変更
          newPassword: newpassword, // キー名は"newPassword"に変更
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // レスポンスの内容をコンソールに表示
      console.log("サーバーレスポンス:", response.data);

      // ステータスコードによって処理を分岐
      if (response.status === 200) {
        // 変更完了のポップアップを表示
        alert("パスワードが変更されました。ログイン画面に遷移します。");

        // ログアウト処理
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/logout`, {}, { withCredentials: true })
          .then(() => {
            window.location.href = '/login'; // ログインページにリダイレクト
          })
          .catch(error => {
            console.error("ログアウトに失敗しました", error);
          });
        window.location.href = "/login";

      } else {
        alert("変更に失敗しました。再度お試しください。");
      }

    }
    catch (error) {
      if (error.response && error.response.status === 401) {
        alert("現在のパスワードが間違っています。");
      } else if (error.response && error.response.status === 500) {
        alert("Internal Server Error");
      } else {
        alert("エラーが発生しました。後ほどお試しください。");
      }
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
        <h1 className="text-xl font-bold mb-6s">パスワード変更</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>

            <label className="block text-sm font-noto-sans mb-2">
              現在のパスワード
            </label>
            <input
              type="password"
              name="oldpassword"
              value={oldpassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#c8d1d3] rounded-lg focus:outline-none focus:border-[#2d3436]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-noto-sans mb-2">
              新しいパスワード
            </label>
            <input
              type="password"
              name="password"
              value={newpassword}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#c8d1d3] rounded-lg focus:outline-none focus:border-[#2d3436]"
              required
            />
            <p className={`mt-2 text-sm ${passwordStrength === "OK" ? "text-green-500" : passwordStrength === "Moderate" ? "text-yellow-500" : "text-red-500"}`}>
              {passwordStrength}
            </p>
          </div>

          <div>
            <label className="block text-sm font-noto-sans mb-2">
              新しいパスワード（確認）
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#c8d1d3] rounded-lg focus:outline-none focus:border-[#2d3436]"
              required
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              className="mt-4 bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
              onClick={() => (window.location.href = "/myPage")}
            >
              <i className="fas fa-home"></i>
              キャンセル
            </button>

            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              <i className="fas fa-user-edit"></i>
              変更する
            </button>
          </div>

        </form>


      </div>
    </div>
  );
}

export default UserPassChange;
