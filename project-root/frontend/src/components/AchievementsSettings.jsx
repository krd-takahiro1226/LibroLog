"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Modal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">本を追加する方法を選択</h3>
        <button
          onClick={() => onSelect("search")}
          className="block w-full bg-blue-500 text-white px-4 py-2 rounded-md mb-2 hover:bg-blue-600"
        >
          書籍を検索する
        </button>
        <button
          onClick={() => onSelect("existing")}
          className="block w-full bg-green-500 text-white px-4 py-2 rounded-md mb-2 hover:bg-green-600"
        >
          登録済みの書籍から追加する
        </button>
        <button
          onClick={onClose}
          className="block w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}

function AchievementsSettings() {
  const [monthlyGoal, setMonthlyGoal] = useState({ bookCount: "", targetBooks: [] });
  const [yearlyGoal, setYearlyGoal] = useState({ bookCount: "", targetBooks: [] });
  const [showModal, setShowModal] = useState(false);
  const [targetType, setTargetType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("トークンが存在しません。再ログインしてください。");
      window.location.href = "/login";
      return;
    }

    axios
      .get("http://localhost:8080/showSettingAchievements", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        // TODO 目標冊数は目標管理テーブルから取得したものを採用する
        setMonthlyGoal({
          bookCount: Array.isArray(data["MonthlyGoal"]) ? data["MonthlyGoal"].length : 0,
          targetBooks: Array.isArray(data["MonthlyGoal"])
            ? data["MonthlyGoal"].map((book, index) => ({
              id: index + 1,
              title: book.bookName,
              author: book.author,
            }))
            : [],
        });

        setYearlyGoal({
          bookCount: Array.isArray(data["YearlyGoal"]) ? data["YearlyGoal"].length : 0,
          targetBooks: Array.isArray(data["YearlyGoal"])
            ? data["YearlyGoal"].map((book, index) => ({
              id: index + 1,
              title: book.bookName,
              author: book.author,
            }))
            : [],
        });
      })
      .catch((error) => {
        console.error("Error fetching achievements data:", error);
        setError("データの取得に失敗しました");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddBook = (type) => {
    setTargetType(type);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen w-screen bg-[#f5f5f5] p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <button
          onClick={() => navigate("/menu")}
          className="text-3xl font-noto-sans hover:text-gray-600 transition-colors"
        >
          📚 Libro Log
        </button>
        {loading ? (
          <p>データを読み込んでいます...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-8">
            {["monthly", "yearly"].map((type) => {
              const goal = type === "monthly" ? monthlyGoal : yearlyGoal;
              return (
                <div key={type} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-noto-sans text-gray-800">
                      {type === "monthly" ? "月間目標" : "年間目標"}
                    </h2>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <label className="text-gray-700">目標冊数：</label>
                    <input
                      type="number"
                      value={goal.bookCount}
                      onChange={(e) =>
                        type === "monthly"
                          ? setMonthlyGoal({ ...monthlyGoal, bookCount: e.target.value })
                          : setYearlyGoal({ ...yearlyGoal, bookCount: e.target.value })
                      }
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                    <span className="text-gray-700">冊</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-semibold">読みたい本リスト</h3>
                    <button
                      onClick={() => handleAddBook(type)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      <i className="fas fa-plus mr-2"></i>本を追加
                    </button>
                  </div>
                  <div className="mt-4">
                    {goal.targetBooks.length === 0 ? (
                      <p className="text-gray-500">追加された本はありません</p>
                    ) : (
                      <ul className="space-y-2">
                        {goal.targetBooks.map((book) => (
                          <li
                            key={book.id}
                            className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-sm"
                          >
                            <div>
                              <p className="font-medium text-gray-800">{book.title}</p>
                              <p className="text-sm text-gray-600">{book.author}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AchievementsSettings;
