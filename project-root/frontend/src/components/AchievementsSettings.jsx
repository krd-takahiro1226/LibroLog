"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Modal({ isOpen, onClose, onSelect }) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#faf8f3] rounded-xl shadow-lg border border-[#e8e2d4] p-8 w-96 max-w-[90vw]">
        <h3 className="font-noto-sans text-xl font-semibold text-[#2d3436] mb-6 text-center">
          本を追加する方法を選択
        </h3>
        <div className="space-y-4">
          <button
            onClick={() => navigate("/searchBooks")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-noto-sans py-3 px-4 rounded-lg transition-colors"
          >
            書籍を検索する
          </button>
          <button
            onClick={() => navigate("/showRecords")}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-noto-sans py-3 px-4 rounded-lg transition-colors"
          >
            登録済みの書籍から追加する
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-noto-sans py-3 px-4 rounded-lg transition-colors"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}

function AchievementsSettings() {
  // --- タイトル ---
  useEffect(() => {
    document.title = "読書目標設定 | Libro Log";
  }, []);
  // --- ここまで ---

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true); // データ読み込み状態を追加
  const [currentGoals, setCurrentGoals] = useState({
    monthlyGoal: 0,
    yearlyGoal: 0
  });
  const [newGoals, setNewGoals] = useState({
    monthlyGoal: "",
    yearlyGoal: ""
  });
  const [achievements, setAchievements] = useState({
    currentMonth: {
      read: 0,
      goal: 0,
      percentage: 0
    },
    currentYear: {
      read: 0,
      goal: 0,
      percentage: 0
    }
  });
  const [showModal, setShowModal] = useState(false);
  const [targetType, setTargetType] = useState("");
  const [error, setError] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

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

  useEffect(() => {
    if (checkTokenValidity()) {
      Promise.all([fetchCurrentGoals(), fetchAchievements()])
        .finally(() => setDataLoading(false));
    } else {
      setDataLoading(false);
    }
  }, []);

  // 現在の目標を取得
  const fetchCurrentGoals = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/showSettingAchievements`, {
        headers: getAuthHeaders()
      });

      if (response.data) {
        const monthlyGoal = response.data.monthlyGoal || 0;
        const yearlyGoal = response.data.yearlyGoal || 0;

        setCurrentGoals({
          monthlyGoal: monthlyGoal,
          yearlyGoal: yearlyGoal
        });
        setNewGoals({
          monthlyGoal: monthlyGoal.toString(),
          yearlyGoal: yearlyGoal.toString()
        });
      }
    } catch (error) {
      console.error("目標取得エラー:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate("/login");
      } else {
        setError("目標データの取得に失敗しました");
      }
    }
  };

  // 達成状況を取得
  const fetchAchievements = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/showSettingAchievements`, {
        headers: getAuthHeaders()
      });

      if (response.data) {
        // APIレスポンスの構造を確認し、安全にデータを設定
        setAchievements({
          currentMonth: {
            read: response.data.currentMonth?.read || 0,
            goal: response.data.currentMonth?.goal || 0,
            percentage: response.data.currentMonth?.percentage || 0
          },
          currentYear: {
            read: response.data.currentYear?.read || 0,
            goal: response.data.currentYear?.goal || 0,
            percentage: response.data.currentYear?.percentage || 0
          }
        });
      }
    } catch (error) {
      console.error("達成状況取得エラー:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate("/login");
      } else {
        setError("達成状況データの取得に失敗しました");
      }
    }
  };

  // 目標を保存
  const handleSaveGoals = async (e) => {
    e.preventDefault();
    if (!checkTokenValidity()) return;

    const monthlyGoal = parseInt(newGoals.monthlyGoal) || 0;
    const yearlyGoal = parseInt(newGoals.yearlyGoal) || 0;

    if (monthlyGoal < 0 || yearlyGoal < 0) {
      alert("目標値は0以上の数値を入力してください。");
      return;
    }

    if (monthlyGoal > 100 || yearlyGoal > 1000) {
      alert("現実的な目標値を設定してください。（月間：100冊以下、年間：1000冊以下）");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/setReadingGoals`,
        {
          monthlyGoal: monthlyGoal,
          yearlyGoal: yearlyGoal
        },
        { headers: getAuthHeaders() }
      );

      if (response.status === 200) {
        alert("読書目標を更新しました！");
        setCurrentGoals({
          monthlyGoal: monthlyGoal,
          yearlyGoal: yearlyGoal
        });
        await fetchAchievements(); // 達成状況を再取得
      }
    } catch (error) {
      console.error("目標保存エラー:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate("/login");
      } else {
        alert(error.response?.data?.message || "目標の保存に失敗しました。");
      }
    } finally {
      setLoading(false);
    }
  };

  // 目標をリセット
  const handleResetGoals = () => {
    setNewGoals({
      monthlyGoal: currentGoals.monthlyGoal.toString() || "",
      yearlyGoal: currentGoals.yearlyGoal.toString() || ""
    });
  };

  // 進捗率の表示色を取得
  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    if (percentage >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  // 進捗率のメッセージを取得
  const getProgressMessage = (percentage) => {
    if (percentage >= 100) return "🎉 目標達成おめでとうございます！";
    if (percentage >= 75) return "🔥 もう少しで目標達成です！";
    if (percentage >= 50) return "💪 順調に進んでいます！";
    if (percentage >= 25) return "📚 良いペースです！";
    return "⭐ まだまだこれからです！";
  };

  // 月の名前を取得
  const getCurrentMonthName = () => {
    const months = [
      "1月", "2月", "3月", "4月", "5月", "6月",
      "7月", "8月", "9月", "10月", "11月", "12月"
    ];
    return months[new Date().getMonth()];
  };

  const handleAddBook = (type) => {
    setTargetType(type);
    setShowModal(true);
  };

  // データ読み込み中の表示
  if (dataLoading) {
    return (
      <div className="min-h-screen w-screen bg-[#f4f1e8] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d3436]"></div>
            <p className="text-[#5d6d7e] font-noto-sans mt-4">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  // エラー状態の表示
  if (error) {
    return (
      <div className="min-h-screen w-screen bg-[#f4f1e8] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 text-4xl mb-4">❌</div>
            <p className="text-red-600 font-noto-sans text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-noto-sans px-6 py-2 rounded-lg transition-colors mt-4"
            >
              再試行
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 安全なデータアクセスのためのヘルパー関数
  const safeGetAchievement = (period) => {
    return achievements?.[period] || { read: 0, goal: 0, percentage: 0 };
  };

  const monthlyAchievement = safeGetAchievement('currentMonth');
  const yearlyAchievement = safeGetAchievement('currentYear');

  return (
    <div className="min-h-screen w-screen bg-[#f4f1e8] p-8">
      <div className="max-w-4xl mx-auto">
        {/* 統一されたヘッダー */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-noto-sans text-[#2d3436]">📚 Libro Log</h1>
            <p className="text-[#5d6d7e] font-noto-sans mt-1">読書目標設定</p>
          </div>
          <button
            onClick={() => navigate("/menu")}
            className="bg-gray-600 hover:bg-gray-700 text-white font-noto-sans px-6 py-2 rounded-lg transition-colors"
          >
            メニューに戻る
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 現在の達成状況 */}
          <div className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] p-6">
            <h2 className="font-noto-sans text-xl font-semibold text-[#2d3436] mb-6">📊 現在の達成状況</h2>

            {/* 月間目標 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-noto-sans text-lg font-medium text-[#2d3436]">
                  📅 {getCurrentMonthName()}の目標
                </h3>
                <span className="text-[#5d6d7e] font-noto-sans text-sm">
                  {monthlyAchievement.read} / {monthlyAchievement.goal} 冊
                </span>
              </div>

              <div className="bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(monthlyAchievement.percentage)}`}
                  style={{ width: `${Math.min(monthlyAchievement.percentage, 100)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#5d6d7e] font-noto-sans text-sm">
                  {monthlyAchievement.percentage.toFixed(1)}% 達成
                </span>
                <span className="text-[#5d6d7e] font-noto-sans text-xs">
                  {getProgressMessage(monthlyAchievement.percentage)}
                </span>
              </div>
            </div>

            {/* 年間目標 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-noto-sans text-lg font-medium text-[#2d3436]">
                  📆 {new Date().getFullYear()}年の目標
                </h3>
                <span className="text-[#5d6d7e] font-noto-sans text-sm">
                  {yearlyAchievement.read} / {yearlyAchievement.goal} 冊
                </span>
              </div>

              <div className="bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(yearlyAchievement.percentage)}`}
                  style={{ width: `${Math.min(yearlyAchievement.percentage, 100)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#5d6d7e] font-noto-sans text-sm">
                  {yearlyAchievement.percentage.toFixed(1)}% 達成
                </span>
                <span className="text-[#5d6d7e] font-noto-sans text-xs">
                  {getProgressMessage(yearlyAchievement.percentage)}
                </span>
              </div>
            </div>
          </div>

          {/* 目標設定フォーム */}
          <div className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] p-6">
            <h2 className="font-noto-sans text-xl font-semibold text-[#2d3436] mb-6">🎯 目標設定</h2>

            <form onSubmit={handleSaveGoals} className="space-y-6">
              {/* 月間目標 */}
              <div>
                <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                  📅 月間読書目標（冊）
                </label>
                <input
                  type="number"
                  value={newGoals.monthlyGoal}
                  onChange={(e) => setNewGoals({ ...newGoals, monthlyGoal: e.target.value })}
                  min="0"
                  max="100"
                  className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                  placeholder="例: 3"
                />
                <p className="text-[#5d6d7e] font-noto-sans text-sm mt-1">
                  現在の目標: {currentGoals.monthlyGoal} 冊
                </p>
              </div>

              {/* 年間目標 */}
              <div>
                <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                  📆 年間読書目標（冊）
                </label>
                <input
                  type="number"
                  value={newGoals.yearlyGoal}
                  onChange={(e) => setNewGoals({ ...newGoals, yearlyGoal: e.target.value })}
                  min="0"
                  max="1000"
                  className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                  placeholder="例: 36"
                />
                <p className="text-[#5d6d7e] font-noto-sans text-sm mt-1">
                  現在の目標: {currentGoals.yearlyGoal} 冊
                </p>
              </div>

              {/* 目標設定のヒント */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-noto-sans font-medium text-blue-800 mb-2">💡 目標設定のヒント</h4>
                <ul className="text-blue-700 font-noto-sans text-sm space-y-1">
                  <li>• 無理のない現実的な目標を設定しましょう</li>
                  <li>• 月間目標 × 12 = 年間目標の関係を意識しましょう</li>
                  <li>• 達成できた時の達成感を味わいましょう</li>
                  <li>• 目標は後からでも変更できます</li>
                </ul>
              </div>

              {/* ボタン */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-noto-sans py-3 px-6 rounded-lg transition-colors"
                >
                  {loading ? "保存中..." : "🎯 目標を保存"}
                </button>
                <button
                  type="button"
                  onClick={handleResetGoals}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-noto-sans py-3 px-6 rounded-lg transition-colors"
                >
                  🔄 リセット
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 読書記録へのリンク */}
        <div className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] p-6 mt-6">
          <div className="text-center">
            <h3 className="font-noto-sans text-lg font-medium text-[#2d3436] mb-4">
              📖 読書記録を追加して目標達成を目指しましょう！
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/reading-record")}
                className="bg-green-600 hover:bg-green-700 text-white font-noto-sans px-6 py-3 rounded-lg transition-colors"
              >
                📝 新しい読書記録を作成
              </button>
              <button
                onClick={() => navigate("/searchBooks")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-noto-sans px-6 py-3 rounded-lg transition-colors"
              >
                📚 書籍を検索して登録
              </button>
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] p-6 mt-6">
          <h3 className="font-noto-sans text-lg font-medium text-[#2d3436] mb-4">📈 統計情報</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-[#c8d1d3] rounded-lg p-4 text-center">
              <div className="text-2xl text-[#2d3436] font-noto-sans font-bold">
                {monthlyAchievement.read}
              </div>
              <div className="text-[#5d6d7e] font-noto-sans text-sm">今月読了</div>
            </div>

            <div className="bg-white border border-[#c8d1d3] rounded-lg p-4 text-center">
              <div className="text-2xl text-[#2d3436] font-noto-sans font-bold">
                {yearlyAchievement.read}
              </div>
              <div className="text-[#5d6d7e] font-noto-sans text-sm">今年読了</div>
            </div>

            <div className="bg-white border border-[#c8d1d3] rounded-lg p-4 text-center">
              <div className="text-2xl text-[#2d3436] font-noto-sans font-bold">
                {Math.round((monthlyAchievement.percentage + yearlyAchievement.percentage) / 2)}%
              </div>
              <div className="text-[#5d6d7e] font-noto-sans text-sm">平均達成率</div>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg">
          {popupMessage}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={(option) => {
          setShowModal(false);
          if (option === "search") {
            navigate(`/search-books?target=${targetType}`);
          } else if (option === "existing") {
            navigate(`/select-existing-books?target=${targetType}`);
          }
        }}
      />
    </div>
  );
}

export default AchievementsSettings;
