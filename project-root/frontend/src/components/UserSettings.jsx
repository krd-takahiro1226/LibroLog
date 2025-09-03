import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserSettings() {
  // --- タイトル ---
  useEffect(() => {
    document.title = "ユーザー設定 | Libro Log";
  }, []);
  // --- ここまで ---

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  // ユーザー情報のstate
  const [userInfo, setUserInfo] = useState({
    name: "Loading...",
    email: "Loading...",
    role: null
  });

  // ユーザー名変更のstate
  const [usernameData, setUsernameData] = useState({
    newUsername: ""
  });

  // メールアドレス変更のstate
  const [emailData, setEmailData] = useState({
    newUserEmail: ""
  });

  // パスワード変更のstate
  const [passwordData, setPasswordData] = useState({
    oldpassword: "",
    newpassword: "",
    confirmPassword: ""
  });

  const [passwordStrength, setPasswordStrength] = useState("");

  // JWT token取得関数
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // トークン有効性チェック
  const checkTokenValidity = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("トークンが存在しません。再ログインしてください。");
      navigate("/login");
      return false;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (Date.now() >= decodedToken.exp * 1000) {
        alert("トークンの有効期限が切れています。再ログインしてください。");
        localStorage.removeItem("token");
        navigate("/login");
        return false;
      }
    } catch (error) {
      console.error("トークンの解析に失敗しました:", error);
      alert("無効なトークンです。再ログインしてください。");
      localStorage.removeItem("token");
      navigate("/login");
      return false;
    }
    return true;
  };

  // メールアドレスのバリデーション
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._%+-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // パスワード強度チェック
  const checkPasswordStrength = (password) => {
    let strength = 0;
    let weakFlag = 0;
    if (password.length >= 8) strength++;

    if (password === "password") weakFlag = 1;
    if (password === "qwertyui") weakFlag = 1;
    if (password === "00000000") weakFlag = 1;
    if (password === "12345678") weakFlag = 1;
    if (password === "01234567") weakFlag = 1;

    if (strength <= 0) return "パスワードは8文字以上で設定してください。";
    if (weakFlag === 1) return "そのパスワードは使用できません。";
    return "OK";
  };

  useEffect(() => {
    if (checkTokenValidity()) {
      fetchUserInfo();
    }
  }, []);

  useEffect(() => {
    // 新しいパスワードの強度をチェック
    if (passwordData.newpassword.length === 0) {
      setPasswordStrength("");
      return;
    }
    const strength = checkPasswordStrength(passwordData.newpassword);
    setPasswordStrength(strength);
  }, [passwordData.newpassword]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/me`, {
        headers: getAuthHeaders()
      });

      setUserInfo({
        name: response.data.name,
        email: response.data.email,
        role: response.data.role || null
      });
    } catch (error) {
      console.error("ユーザー情報の取得に失敗しました:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate("/login");
      }
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!checkTokenValidity()) return;

    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/username/changeusername`,
        { newUsername: usernameData.newUsername },
        { 
          headers: getAuthHeaders(),
          withCredentials: true 
        }
      );

      if (response.status === 200) {
        alert("ユーザー名が変更されました。");
        setUsernameData({ newUsername: "" });
        fetchUserInfo(); // ユーザー情報を再取得
      }
    } catch (error) {
      console.error("エラー:", error.response || error);
      alert("ユーザー名の変更に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!checkTokenValidity()) return;

    if (!isValidEmail(emailData.newUserEmail)) {
      alert("有効なメールアドレスを入力してください。");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/useremail/changeemail`,
        { newUserEmail: emailData.newUserEmail },
        { 
          headers: getAuthHeaders(),
          withCredentials: true 
        }
      );

      if (response.status === 200) {
        alert("メールアドレスが変更されました。");
        setEmailData({ newUserEmail: "" });
        fetchUserInfo(); // ユーザー情報を再取得
      }
    } catch (error) {
      console.error("エラー:", error.response || error);
      alert("メールアドレスの変更に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!checkTokenValidity()) return;

    // 新しいパスワードの一致確認
    if (passwordData.newpassword !== passwordData.confirmPassword) {
      alert("新しいパスワードが一致しません。入力内容を確認してください。");
      return;
    }

    // 新しいパスワードの強度をチェック
    if (passwordData.newpassword.length === 0) {
      alert("新しいパスワードが入力されていません。");
      return;
    }
    const strength = checkPasswordStrength(passwordData.newpassword);
    if (strength !== "OK") {
      alert(strength);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/userPassword/change`,
        {
          oldPassword: passwordData.oldpassword,
          newPassword: passwordData.newpassword,
        },
        { 
          headers: getAuthHeaders(),
          withCredentials: true 
        }
      );

      if (response.status === 200) {
        alert("パスワードが変更されました。ログイン画面に遷移します。");
        
        // ログアウト処理
        try {
          await axios.post(`${process.env.REACT_APP_BACKEND_URL}/logout`, {}, { withCredentials: true });
        } catch (error) {
          console.error("ログアウトに失敗しました", error);
        }
        
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert("現在のパスワードが間違っています。");
      } else if (error.response?.status === 500) {
        alert("Internal Server Error");
      } else {
        alert("パスワードの変更に失敗しました。");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-screen bg-[#f4f1e8] p-8">
      <div className="max-w-4xl mx-auto">
        {/* 統一されたヘッダー */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-noto-sans text-[#2d3436]">📚 Libro Log</h1>
            <p className="text-[#5d6d7e] font-noto-sans mt-1">ユーザー設定</p>
          </div>
          <button
            onClick={() => navigate("/menu")}
            className="bg-gray-600 hover:bg-gray-700 text-white font-noto-sans px-6 py-2 rounded-lg transition-colors"
          >
            メニューに戻る
          </button>
        </header>

        {/* タブナビゲーション */}
        <div className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] mb-6">
          <div className="flex border-b border-[#e8e2d4]">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-4 px-6 font-noto-sans text-center transition-colors ${activeTab === "profile"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-[#5d6d7e] hover:text-[#2d3436]"
                }`}
            >
              👤 プロフィール情報
            </button>
            <button
              onClick={() => setActiveTab("username")}
              className={`flex-1 py-4 px-6 font-noto-sans text-center transition-colors ${activeTab === "username"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-[#5d6d7e] hover:text-[#2d3436]"
                }`}
            >
              ✏️ ユーザー名変更
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`flex-1 py-4 px-6 font-noto-sans text-center transition-colors ${activeTab === "email"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-[#5d6d7e] hover:text-[#2d3436]"
                }`}
            >
              📧 メール変更
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 py-4 px-6 font-noto-sans text-center transition-colors ${activeTab === "password"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-[#5d6d7e] hover:text-[#2d3436]"
                }`}
            >
              🔒 パスワード変更
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`flex-1 py-4 px-6 font-noto-sans text-center transition-colors ${activeTab === "account"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-[#5d6d7e] hover:text-[#2d3436]"
                }`}
            >
              ⚙️ アカウント管理
            </button>
          </div>
        </div>

        {/* タブコンテンツ */}
        <div className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] p-8">
          
          {/* プロフィール情報表示 */}
          {activeTab === "profile" && (
            <div>
              <h2 className="font-noto-sans text-2xl font-semibold text-[#2d3436] mb-6">👤 プロフィール情報</h2>
              
              <div className="space-y-6">
                <div className="bg-white border border-[#c8d1d3] rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#e8e2d4] pb-4">
                      <div>
                        <label className="font-noto-sans text-[#2d3436] font-medium">ユーザー名</label>
                        <div className="text-lg text-[#5d6d7e] mt-1">{userInfo.name}</div>
                      </div>
                      <button
                        onClick={() => setActiveTab("username")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-noto-sans px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        変更
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#e8e2d4] pb-4">
                      <div>
                        <label className="font-noto-sans text-[#2d3436] font-medium">メールアドレス</label>
                        <div className="text-lg text-[#5d6d7e] mt-1">{userInfo.email}</div>
                      </div>
                      <button
                        onClick={() => setActiveTab("email")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-noto-sans px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        変更
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-noto-sans text-[#2d3436] font-medium">パスワード</label>
                        <div className="text-lg text-[#5d6d7e] mt-1">********</div>
                      </div>
                      <button
                        onClick={() => setActiveTab("password")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-noto-sans px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        変更
                      </button>
                    </div>

                    {userInfo.role && (
                      <div className="border-t border-[#e8e2d4] pt-4">
                        <label className="font-noto-sans text-[#2d3436] font-medium">権限（管理者のみ表示）</label>
                        <div className="text-lg text-[#5d6d7e] mt-1">{userInfo.role}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ユーザー名変更 */}
          {activeTab === "username" && (
            <div>
              <h2 className="font-noto-sans text-2xl font-semibold text-[#2d3436] mb-6">✏️ ユーザー名変更</h2>
              
              <div className="bg-white border border-[#c8d1d3] rounded-lg p-6 mb-6">
                <div className="mb-4">
                  <span className="font-medium text-[#2d3436]">現在のユーザー名: </span>
                  <span className="text-[#5d6d7e]">{userInfo.name}</span>
                </div>
              </div>

              <form onSubmit={handleUsernameSubmit} className="space-y-6 max-w-md">
                <div>
                  <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                    新しいユーザー名
                  </label>
                  <input
                    type="text"
                    value={usernameData.newUsername}
                    onChange={(e) => setUsernameData({ newUsername: e.target.value })}
                    required
                    className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                    placeholder="新しいユーザー名を入力"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-noto-sans px-6 py-3 rounded-lg transition-colors"
                  >
                    {loading ? "変更中..." : "ユーザー名を変更"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUsernameData({ newUsername: "" })}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-noto-sans px-6 py-3 rounded-lg transition-colors"
                  >
                    クリア
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* メールアドレス変更 */}
          {activeTab === "email" && (
            <div>
              <h2 className="font-noto-sans text-2xl font-semibold text-[#2d3436] mb-6">📧 メールアドレス変更</h2>
              
              <div className="bg-white border border-[#c8d1d3] rounded-lg p-6 mb-6">
                <div className="mb-4">
                  <span className="font-medium text-[#2d3436]">現在のメールアドレス: </span>
                  <span className="text-[#5d6d7e]">{userInfo.email}</span>
                </div>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-6 max-w-md">
                <div>
                  <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                    新しいメールアドレス
                  </label>
                  <input
                    type="email"
                    value={emailData.newUserEmail}
                    onChange={(e) => setEmailData({ newUserEmail: e.target.value })}
                    required
                    className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                    placeholder="新しいメールアドレスを入力"
                  />
                  <p className="text-[#5d6d7e] font-noto-sans text-sm mt-1">
                    有効なメールアドレスを入力してください
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-noto-sans px-6 py-3 rounded-lg transition-colors"
                  >
                    {loading ? "変更中..." : "メールアドレスを変更"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailData({ newUserEmail: "" })}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-noto-sans px-6 py-3 rounded-lg transition-colors"
                  >
                    クリア
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* パスワード変更 */}
          {activeTab === "password" && (
            <div>
              <h2 className="font-noto-sans text-2xl font-semibold text-[#2d3436] mb-6">🔒 パスワード変更</h2>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                <div>
                  <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                    現在のパスワード
                  </label>
                  <input
                    type="password"
                    value={passwordData.oldpassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldpassword: e.target.value })}
                    required
                    className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                    新しいパスワード
                  </label>
                  <input
                    type="password"
                    value={passwordData.newpassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newpassword: e.target.value })}
                    required
                    className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                  />
                  <p className={`mt-2 text-sm font-noto-sans ${passwordStrength === "OK" ? "text-green-600" : "text-red-600"}`}>
                    {passwordStrength}
                  </p>
                </div>

                <div>
                  <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                    新しいパスワード（確認）
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-noto-sans text-sm">
                    ⚠️ パスワード変更後は自動的にログアウトされ、ログイン画面に遷移します。
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-noto-sans px-6 py-3 rounded-lg transition-colors"
                  >
                    {loading ? "変更中..." : "パスワードを変更"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPasswordData({ oldpassword: "", newpassword: "", confirmPassword: "" })}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-noto-sans px-6 py-3 rounded-lg transition-colors"
                  >
                    クリア
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* アカウント管理 */}
          {activeTab === "account" && (
            <div>
              <h2 className="font-noto-sans text-2xl font-semibold text-[#2d3436] mb-6">⚙️ アカウント管理</h2>

              <div className="space-y-6">
                <div className="bg-white border border-[#e8e2d4] rounded-lg p-6">
                  <h3 className="font-noto-sans text-lg font-medium text-[#2d3436] mb-4">🚪 ログアウト</h3>
                  <p className="text-[#5d6d7e] font-noto-sans mb-4">
                    アカウントからログアウトします。再度利用する際はログインが必要です。
                  </p>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-noto-sans px-6 py-3 rounded-lg transition-colors"
                  >
                    ログアウト
                  </button>
                </div>

                <div className="bg-white border border-[#e8e2d4] rounded-lg p-6">
                  <h3 className="font-noto-sans text-lg font-medium text-[#2d3436] mb-4">📱 アプリについて</h3>
                  <div className="space-y-2 text-[#5d6d7e] font-noto-sans">
                    <p>📚 Libro Log - 読書記録アプリ</p>
                    <p>Version 1.0.0</p>
                    <p>あなたの読書体験をより豊かにします</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserSettings;
