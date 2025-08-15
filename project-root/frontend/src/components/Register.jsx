import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  useEffect(() => {
    document.title = "新規登録 | Libro Log";
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("パスワードと確認パスワードが一致しません。");
      return;
    }

    if (formData.password.length < 6) {
      alert("パスワードは6文字以上で入力してください。");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/otp/send-registration`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        alert("認証コードをメールアドレスに送信しました。");
        navigate("/otpVerification", { state: { email: formData.email } });
      } else {
        alert(response.data.message || "OTP送信に失敗しました。再度お試しください。");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("エラーが発生しました。後ほどお試しください。");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#f4f1e8] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* ロゴ・ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-noto-sans text-[#2d3436] mb-2">📚 Libro Log</h1>
          <p className="text-[#5d6d7e] font-noto-sans">あなたの読書体験を記録・管理</p>
        </div>

        {/* 登録フォーム */}
        <div className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] p-8">
          <h2 className="font-noto-sans text-2xl font-semibold text-[#2d3436] mb-6 text-center">新規登録</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                ユーザー名
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                placeholder="ユーザー名を入力"
              />
              <p className="text-[#5d6d7e] font-noto-sans text-sm mt-1">
                英数字で入力してください
              </p>
            </div>

            <div>
              <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                placeholder="メールアドレスを入力"
              />
              <p className="text-[#5d6d7e] font-noto-sans text-sm mt-1">
                認証コードを送信します
              </p>
            </div>

            <div>
              <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                パスワード
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength="6"
                className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                placeholder="パスワードを入力"
              />
              <p className="text-[#5d6d7e] font-noto-sans text-sm mt-1">
                6文字以上で入力してください
              </p>
            </div>

            <div>
              <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                パスワード（確認）
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                placeholder="パスワードを再入力"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-noto-sans py-3 rounded-lg transition-colors"
            >
              {loading ? "認証コード送信中..." : "認証コードを送信"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#5d6d7e] font-noto-sans">
              既にアカウントをお持ちの方は{" "}
              <Link
                to="/login"
                className="text-[#4a6fa5] hover:text-[#2d3436] font-medium transition-colors"
              >
                ログイン
              </Link>
            </p>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-8 text-center">
          <p className="text-[#5d6d7e] font-noto-sans text-sm">
            読書を通じて、新しい世界を発見しましょう
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
