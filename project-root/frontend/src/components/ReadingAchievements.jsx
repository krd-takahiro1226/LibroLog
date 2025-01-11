"use client";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ReadingAchievements() {
  const [readingStats] = React.useState({
    yearlyGoal: 24,
    booksReadThisYear: 18,
    monthlyGoal: 2,
    booksReadThisMonth: 1,
    currentStreak: 15,
    totalPagesRead: 4328,
    genreDistribution: [
      { genre: "文学・小説", count: 8 },
      { genre: "ビジネス", count: 4 },
      { genre: "自己啓発", count: 3 },
      { genre: "歴史", count: 2 },
      { genre: "その他", count: 1 },
    ],
  });

  const percentageComplete =
    (readingStats.booksReadThisYear / readingStats.yearlyGoal) * 100;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen bg-[#f5f5f5] p-8 w-full">
    <div className="w-full mx-auto">
        <div className="flex items-center gap-3 mb-8">
        <header className="flex items-center justify-between mb-12">
        <div>
          {/* <h1 className="text-2xl md:text-3xl font-crimson-text text-[#333333] mb-2">
            📚 Libro Log
          </h1> */}
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
    </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-noto-sans text-xl mb-4">年間目標達成状況</h2>
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-noto-sans">
                  {readingStats.booksReadThisYear} / {readingStats.yearlyGoal}冊
                </div>
                <div className="text-lg font-noto-sans">
                  {Math.round(percentageComplete)}%
                </div>
              </div>
              <div className="overflow-hidden h-3 bg-gray-200 rounded">
                <div
                  className="h-full bg-[#2c5282] rounded"
                  style={{ width: `${percentageComplete}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-noto-sans text-xl mb-4">今月の読書状況</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2c5282]">
                  {readingStats.booksReadThisMonth}
                </div>
                <div className="text-sm text-gray-600">読了数</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2c5282]">
                  {readingStats.monthlyGoal}
                </div>
                <div className="text-sm text-gray-600">月間目標</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-noto-sans text-xl mb-4">ジャンル別読書数</h2>
            <div className="space-y-3">
              {readingStats.genreDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-noto-sans">{item.genre}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#2c5282] font-bold">
                      {item.count}
                    </span>
                    <span className="text-gray-600">冊</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-noto-sans text-xl mb-4">その他の実績</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2c5282]">
                  {readingStats.currentStreak}
                </div>
                <div className="text-sm text-gray-600">連続読書日数</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2c5282]">
                  {readingStats.totalPagesRead}
                </div>
                <div className="text-sm text-gray-600">総読書ページ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReadingAchievements;
