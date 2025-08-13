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
  const [activeTab, setActiveTab] = useState("goals");
  const [loading, setLoading] = useState(false);

  // 目標設定のstate
  const [goals, setGoals] = useState({
    yearlyGoal: "",
    monthlyGoal: ""
  });

  // パスワード変更のstate
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    fetchCurrentGoals();
  }, []);

  const fetchCurrentGoals = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getGoals`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setGoals({
        yearlyGoal: response.data.yearlyGoal || "",
        monthlyGoal: response.data.monthlyGoal || ""
      });
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const handleGoalsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/setGoals`,
        goals,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert("目標が正常に更新されました！");
    } catch (error) {
      console.error("Error updating goals:", error);
      alert("目標の更新に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("新しいパスワードと確認パスワードが一致しません。");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("パスワードは6文字以上で入力してください。");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/changePassword`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert("パスワードが正常に変更されました！");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Error changing password:", error);
      alert("パスワードの変更に失敗しました。現在のパスワードを確認してください。");
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
        <header className="flex items-center justify-between mb-12">
          <div>
            <button
              onClick={() => navigate("/menu")}
              className="text-3xl font-noto-sans text-[#2d3436] hover:text-[#4a6fa5] transition-colors"
            >
              📚 Libro Log
            </button>
            <p className="text-[#5d6d7e] font-noto-sans mt-1">
              あなたの読書体験を記録・管理
            </p>
          </div>
        </header>

        {/* タブナビゲーション */}
        <div className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] mb-6">
          <div className="flex border-b border-[#e8e2d4]">
            <button
              onClick={() => setActiveTab("goals")}
              className={`flex-1 py-4 px-6 font-noto-sans text-center transition-colors ${activeTab === "goals"
                  ? "text-[#4a6fa5] border-b-2 border-[#4a6fa5] bg-white"
                  : "text-[#5d6d7e] hover:text-[#2d3436]"
                }`}
            >
              目標設定
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 py-4 px-6 font-noto-sans text-center transition-colors ${activeTab === "password"
                  ? "text-[#4a6fa5] border-b-2 border-[#4a6fa5] bg-white"
                  : "text-[#5d6d7e] hover:text-[#2d3436]"
                }`}
            >
              パスワード変更
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`flex-1 py-4 px-6 font-noto-sans text-center transition-colors ${activeTab === "account"
                  ? "text-[#4a6fa5] border-b-2 border-[#4a6fa5] bg-white"
                  : "text-[#5d6d7e] hover:text-[#2d3436]"
                }`}
            >
              アカウント
            </button>
          </div>
        </div>

        {/* タブコンテンツ */}
        <div className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] p-8">
          {activeTab === "goals" && (
            <div>
              <h2 className="font-noto-sans text-2xl font-semibold text-[#2d3436] mb-6">読書目標設定</h2>
              <form onSubmit={handleGoalsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                      年間目標（冊数）
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={goals.yearlyGoal}
                      onChange={(e) => setGoals({ ...goals, yearlyGoal: e.target.value })}
                      className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                      placeholder="例: 24"
                    />
                    <p className="text-[#5d6d7e] font-noto-sans text-sm mt-1">
                      1年間で読みたい本の冊数を設定してください
                    </p>
                  </div>

                  <div>
                    <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                      月間目標（冊数）
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={goals.monthlyGoal}
                      onChange={(e) => setGoals({ ...goals, monthlyGoal: e.target.value })}
                      className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                      placeholder="例: 2"
                    />
                    <p className="text-[#5d6d7e] font-noto-sans text-sm mt-1">
                      1ヶ月で読みたい本の冊数を設定してください
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-noto-sans px-8 py-3 rounded-lg transition-colors"
                >
                  {loading ? "更新中..." : "目標を更新"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div>
              <h2 className="font-noto-sans text-2xl font-semibold text-[#2d3436] mb-6">パスワード変更</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                <div>
                  <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                    現在のパスワード
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
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
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength="6"
                    className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                  />
                  <p className="text-[#5d6d7e] font-noto-sans text-sm mt-1">
                    6文字以上で入力してください
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

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-noto-sans px-8 py-3 rounded-lg transition-colors"
                >
                  {loading ? "変更中..." : "パスワードを変更"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "account" && (
            <div>
              <h2 className="font-noto-sans text-2xl font-semibold text-[#2d3436] mb-6">アカウント管理</h2>

              <div className="space-y-6">
                <div className="bg-white border border-[#e8e2d4] rounded-lg p-6">
                  <h3 className="font-noto-sans text-lg font-medium text-[#2d3436] mb-4">ログアウト</h3>
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
                  <h3 className="font-noto-sans text-lg font-medium text-[#2d3436] mb-4">アプリについて</h3>
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
