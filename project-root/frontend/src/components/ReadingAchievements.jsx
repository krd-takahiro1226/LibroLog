import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ReadingAchievements() {
  const [readingStats, setReadingStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // トークンを取得
    const token = localStorage.getItem("token");
    if (!token) {
      alert("トークンが存在しません。再ログインしてください。");
      window.location.href = "/login";
      return;
    }

    // トークンの有効期限を確認
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    if (Date.now() >= decodedToken.exp * 1000) {
      alert("トークンの有効期限が切れています。再ログインしてください。");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    // 読書目標実績データを取得
    axios
      .get("http://localhost:8080/showAchievements", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Reading Achievements:", response.data);
        setReadingStats(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reading achievements:", error);
        setError("データの取得に失敗しました");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const yearlyPercentage =
    ((readingStats.yearlyPercentage || 0) * 100).toFixed(2);

  return (
    <div className="min-h-screen w-screen bg-[#f5f5f5] p-8 w-full">
      <div className="w-full mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <button
              onClick={() => navigate("/menu")}
              className="text-3xl font-noto-sans hover:text-gray-600 transition-colors"
            >
              📚 Libro Log
            </button>
            <p className="text-[#666666] font-crimson-text">
              あなたの読書体験を記録・管理
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 年間目標 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-noto-sans text-xl mb-4">年間目標達成状況</h2>
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-noto-sans">
                  {readingStats.yearlyTotalBooks || 0} /{" "}
                  {readingStats.yearlyGoal || 0}冊
                </div>
                <div className="text-lg font-noto-sans">{yearlyPercentage}%</div>
              </div>
              <div className="overflow-hidden h-3 bg-gray-200 rounded">
                <div
                  className="h-full bg-[#2c5282] rounded"
                  style={{ width: `${yearlyPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 月間目標 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-noto-sans text-xl mb-4">今月の読書状況</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2c5282]">
                  {readingStats.monthlyRead || 0}
                </div>
                <div className="text-sm text-gray-600">読了数</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2c5282]">
                  {readingStats.monthlyGoal || 0}
                </div>
                <div className="text-sm text-gray-600">月間目標</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReadingAchievements;
