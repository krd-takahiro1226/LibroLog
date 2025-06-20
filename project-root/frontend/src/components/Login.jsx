"use client";
import React, {useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/styles.css'; 

function Login() {

  // --- タイトル ---
  useEffect(() => {
    document.title = "ログイン | Libro Log";
  }, []);
  // --- ここまで ---
  
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPopup, setShowPopup] = React.useState(false);

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
          <h1 className="text-2xl font-noto-sans text-[#2d3436] mb-8">
            ログイン
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-noto-sans text-[#505e61] mb-2">
                ユーザ名
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

            <button
              type="submit"
              className="w-full bg-[#2d3436] text-white font-noto-sans py-2 px-4 rounded-lg hover:bg-[#1e2527] transition-colors"
            >
              ログイン
            </button>
          </form>

          {/* ポップアップエラー表示 */}
          {showPopup && (
            <div className="popup" onClick={closePopup}>
              <div
                className="popup-content"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="close" onClick={closePopup}>
                  &times;
                </span>
                <h3>ログインエラー</h3>
                <p>ユーザー名またはパスワードが違います。</p>
                <button
                  type="button"
                  className="popup-ok-button"
                  onClick={closePopup}
                >
                  OK
                </button>
              </div>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-[#505e61] font-noto-sans">
            アカウントをお持ちでない方は
            <a
              href="/userRegistration"
              className="text-[#2d3436] hover:underline"
            >
              新規登録
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
