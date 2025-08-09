"use client";
import React from "react";
import axios from "axios";
import "../assets/styles/styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function NewUserRegister() {
  const navigate = useNavigate();

  // --- タイトル ---
  useEffect(() => {
    document.title = "新規登録 | Libro Log";
  }, []);
  // --- ここまで ---


  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // パスワードの一致確認
    if (password !== confirmPassword) {
      alert("パスワードが一致しません。入力内容を確認してください。");
      return;
    }

    try {
      // サーバーへOTP送信リクエストを送信
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/otp/send-registration`,
        { username, email, password, confirmPassword },
        { withCredentials: true }
      );

      // レスポンスの内容をコンソールに表示
      console.log("サーバーレスポンス:", response.data);

      // OTP送信が成功した場合
      if (response.data.success) {
        alert("認証コードをメールアドレスに送信しました。");
        // OTP検証画面に遷移（emailを渡す）
        navigate("/otpVerification", { state: { email } });
      } else {
        alert(response.data.message || "OTP送信に失敗しました。再度お試しください。");
      }

    } catch (error) {
      console.error("エラー:", error.response || error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("エラーが発生しました。後ほどお試しください。");
      }
    }
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
          <h1 className="text-2xl font-noto-sans text-[#2d3436] mb-8">
            新規登録
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-noto-sans text-[#505e61] mb-2">
                ユーザー名
              </label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-[#c8d1d3] rounded-lg focus:outline-none focus:border-[#2d3436]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-noto-sans text-[#505e61] mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-[#c8d1d3] rounded-lg focus:outline-none focus:border-[#2d3436]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-noto-sans text-[#505e61] mb-2">
                パスワード
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-[#c8d1d3] rounded-lg focus:outline-none focus:border-[#2d3436]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-noto-sans text-[#505e61] mb-2">
                確認用パスワード
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

            <button
              type="submit"
              className="w-full bg-[#2d3436] text-white font-noto-sans py-2 px-4 rounded-lg hover:bg-[#1e2527] transition-colors"
            >
              アカウントを作成
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#505e61] font-noto-sans">
            すでにアカウントをお持ちの方は
            <a
              href="/login"
              className="text-[#2d3436] hover:underline"
            >
              ログイン
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NewUserRegister;
