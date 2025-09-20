"use client";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../assets/styles/styles.css';

function Menu() {
  // --- タイトル ---
  useEffect(() => {
    document.title = "メニュー | Libro Log";
  }, []);
  // --- ここまで ---

  const navigate = useNavigate();

  const menuItems = [
    {
      title: "書籍を検索",
      description: "新しい本を検索して登録",
      icon: "🔍",
      path: "/searchBooks",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "登録書籍一覧",
      description: "登録済みの書籍を確認",
      icon: "📚",
      path: "/showRecords",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "読書目標設定",
      description: "読書目標の確認と設定",
      icon: "📖",
      path: "/achievementsSettings",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "お気に入りの本",
      description: "お気に入り登録した書籍",
      icon: "⭐",
      path: "#",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "マイページ",
      description: "アカウント情報の管理",
      icon: "👤",
      path: "/myPage",
      color: "bg-gray-600 hover:bg-gray-700"
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen w-screen bg-[#f4f1e8] p-8">
      <div className="max-w-6xl mx-auto">
        {/* 統一されたヘッダー */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-noto-sans text-[#2d3436]">📚 Libro Log</h1>
            <p className="text-[#5d6d7e] font-noto-sans mt-1">
              あなたの読書体験を記録・管理
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-noto-sans px-6 py-2 rounded-lg transition-colors"
          >
            ログアウト
          </button>
        </header>

        {/* メニューグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => item.path !== "#" && navigate(item.path)}
              className={`bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] p-6 cursor-pointer hover:shadow-lg transition-all duration-300 group ${
                item.path === "#" ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="font-noto-sans text-xl font-semibold text-[#2d3436] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#5d6d7e] font-noto-sans text-sm mb-4">
                  {item.description}
                </p>
                <button className={`${item.color} text-white font-noto-sans px-6 py-2 rounded-lg transition-colors w-full ${
                  item.path === "#" ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                  {item.path === "#" ? "準備中" : "開く"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* フッター */}
        <div className="mt-12 text-center">
          <p className="text-[#5d6d7e] font-noto-sans text-sm">
            読書を通じて、新しい世界を発見しましょう
          </p>
        </div>
      </div>
    </div>
  );
}

export default Menu;
