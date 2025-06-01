"use client";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SetReadingGoals() {

  // --- タイトル ---
  useEffect(() => {
    document.title = "目標設定編集 | Libro Log";
  }, []);
  // --- ここまで ---
  


  const [monthlyGoal, setMonthlyGoal] = React.useState({
    bookCount: "",
    targetBooks: [
      // サンプルデータ（実際はデータベースから取得）
      { id: 1, title: "テスト駆動開発", author: "Kent Beck" },
      { id: 2, title: "リーダブルコード", author: "Dustin Boswell" },
    ],
  });
  const [yearlyGoal, setYearlyGoal] = React.useState({
    bookCount: "24", // サンプルデータ（実際はデータベースから取得）
    targetBooks: [],
  });
  const [showBookSearch, setShowBookSearch] = React.useState(false);
  const [targetType, setTargetType] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);
  const navigate = useNavigate();

  const handleAddBook = (type) => {
    setTargetType(type);
    setShowBookSearch(true);
  };

  const handleDeleteBook = (type, bookId) => {
    if (type === "monthly") {
      setMonthlyGoal({
        ...monthlyGoal,
        targetBooks: monthlyGoal.targetBooks.filter(
          (book) => book.id !== bookId
        ),
      });
    } else {
      setYearlyGoal({
        ...yearlyGoal,
        targetBooks: yearlyGoal.targetBooks.filter(
          (book) => book.id !== bookId
        ),
      });
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#f5f5f5] p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center w-full">
          <button
            onClick={() => navigate("/menu")}
            className="text-3xl font-noto-sans hover:text-gray-600 transition-colors"
          >
            📚 Libro Log
          </button>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-noto-sans text-gray-800">月間目標</h2>
              {monthlyGoal.bookCount && (
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  設定済み
                </span>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-gray-700">目標冊数：</label>
                <input
                  type="number"
                  value={monthlyGoal.bookCount}
                  onChange={(e) =>
                    setMonthlyGoal({
                      ...monthlyGoal,
                      bookCount: e.target.value,
                    })
                  }
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
                <span className="text-gray-700">冊</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-700">読みたい本リスト</label>
                  <button
                    onClick={() => handleAddBook("monthly")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <i className="fas fa-plus mr-2"></i>本を追加
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-md min-h-[100px]">
                  {monthlyGoal.targetBooks.length === 0 ? (
                    <p className="text-gray-500 text-center">
                      読みたい本を追加してください
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {monthlyGoal.targetBooks.map((book) => (
                        <li
                          key={book.id}
                          className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {book.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {book.author}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteBook("monthly", book.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-noto-sans text-gray-800">年間目標</h2>
              {yearlyGoal.bookCount && (
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  設定済み
                </span>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-gray-700">目標冊数：</label>
                <input
                  type="number"
                  value={yearlyGoal.bookCount}
                  onChange={(e) =>
                    setYearlyGoal({ ...yearlyGoal, bookCount: e.target.value })
                  }
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
                <span className="text-gray-700">冊</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-700">読みたい本リスト</label>
                  <button
                    onClick={() => handleAddBook("yearly")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <i className="fas fa-plus mr-2"></i>本を追加
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-md min-h-[100px]">
                  {yearlyGoal.targetBooks.length === 0 ? (
                    <p className="text-gray-500 text-center">
                      読みたい本を追加してください
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsEditing(false)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
            >
              <i className="fas fa-save mr-2"></i>
              目標を保存
            </button>
            <button className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-semibold">
              <i className="fas fa-home mr-2"></i>
              メニューに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetReadingGoals;
