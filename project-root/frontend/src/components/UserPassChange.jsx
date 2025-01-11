"use client";
import React from "react";
import axios from "axios";
import "../assets/styles/styles.css";


function UserPassChange() {
  const [oldpassword, setOldPassword] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 新しいパスワードの一致確認
    if (password !== confirmPassword) {
      alert("新しいパスワードが一致しません。入力内容を確認してください。");
      return;
    }

    try {
      // サーバーへ変更リクエストを送信（PUTメソッド）
      const response = await axios.put(
        "http://localhost:8080/userPassChange",
        { oldpassword, password, confirmPassword },
        { withCredentials: true }
      );

      // レスポンスの内容をコンソールに表示
      console.log("サーバーレスポンス:", response.data);

      // ステータスコードによって処理を分岐
      if (response.status === 200) {
        // 変更完了のポップアップを表示
        alert("パスワードが変更されました。ログイン画面に遷移します。");

        // ログアウト処理
        axios.post('http://localhost:8080/logout', {}, { withCredentials: true })
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

    } catch (error) {
      console.error("エラー:", error.response || error);
      alert("エラーが発生しました。後ほどお試しください。");
    }
  };





  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-[600px]">
        <div className="flex items-center gap-3 mb-8">
          <img
            src="/images/LibroLogIcon.jpg"
            alt="Libro Logのアイコン"
            className="w-8 h-8"
          />
          <h1 className="font-noto-sans text-xl">パスワード変更</h1>
        </div>


        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            <div>
              <label className="block text-sm font-noto-sans text-[#505e61] mb-2">
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
              <label className="block text-sm font-noto-sans text-[#505e61] mb-2">
                新しいパスワード
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


            <button
              type="submit"
              className="bg-[#2d3436] text-white px-6 py-2 rounded flex items-center justify-center gap-2 mx-auto hover:bg-[#434a54] transition-colors"
            >
              <i className="fas fa-user-edit"></i>
              変更する
            </button>

        </form>



        

        <div className="bg-white rounded-lg shadow p-6">
            
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

export default UserPassChange;