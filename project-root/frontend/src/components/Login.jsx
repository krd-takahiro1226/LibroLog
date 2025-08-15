"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import '../assets/styles/styles.css';

function Login() {
  // --- タイトル ---
  useEffect(() => {
    document.title = "ログイン | Libro Log";
  }, []);
  // --- ここまで ---

  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        formData,
        { withCredentials: true } // 必要に応じてクッキーを有効化
      );

      console.log("サーバーレスポンス:", response.data);

      // トークンがレスポンスに含まれているか確認
      if (response.data?.token) {
        // ローカルストレージにトークンを保存
        localStorage.setItem("token", response.data.token);

        // メインページにリダイレクト
        navigate("/menu");
      } else {
        // トークンがない場合はエラーを表示
        alert("ログインに失敗しました。ユーザー名とパスワードを確認してください。");
      }
    } catch (error) {
      console.error("ログインエラー:", error.response || error);

      // 401エラーなど特定のステータスコードをチェック
      if (error.response?.status === 401) {
        alert("ログインに失敗しました。ユーザー名とパスワードを確認してください。");
      } else {
        alert("サーバーエラーが発生しました。後ほどお試しください。");
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

        {/* ログインフォーム */}
        <div className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] p-8">
          <h2 className="font-noto-sans text-2xl font-semibold text-[#2d3436] mb-6 text-center">ログイン</h2>

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
                className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                placeholder="パスワードを入力"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-noto-sans py-3 rounded-lg transition-colors"
            >
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#5d6d7e] font-noto-sans">
              アカウントをお持ちでない方は{" "}
              <Link
                to="/register"
                className="text-[#4a6fa5] hover:text-[#2d3436] font-medium transition-colors"
              >
                新規登録
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

export default Login;
