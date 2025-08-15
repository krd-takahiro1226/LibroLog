"use client";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function Search() {

  // --- タイトル ---
  useEffect(() => {
    document.title = "書籍検索 | Libro Log";
  }, []);
  // --- ここまで ---

  const [searchForm, setSearchForm] = useState({
    title: "",
    author: "",
    publisherName: "",
    isbn: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // 検索条件が空の場合のバリデーション
    const hasSearchTerm = Object.values(searchForm).some(value => value.trim() !== "");
    if (!hasSearchTerm) {
      alert("検索条件を少なくとも1つ入力してください。");
      return;
    }

    navigate("/searchBooksResult", { state: searchForm });
  };

  const handleClear = () => {
    setSearchForm({
      title: "",
      author: "",
      publisherName: "",
      isbn: "",
    });
  };

  return (
    <div className="min-h-screen w-screen bg-[#f4f1e8] p-8">
      <div className="max-w-4xl mx-auto">
        {/* 統一されたヘッダー */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-noto-sans text-[#2d3436]">📚 Libro Log</h1>
            <p className="text-[#5d6d7e] font-noto-sans mt-1">書籍検索</p>
          </div>
          <button
            onClick={() => navigate("/menu")}
            className="bg-gray-600 hover:bg-gray-700 text-white font-noto-sans px-6 py-2 rounded-lg transition-colors"
          >
            メニューに戻る
          </button>
        </header>

        {/* 検索フォーム */}
        <div className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] p-8">
          <h2 className="font-noto-sans text-xl font-semibold text-[#2d3436] mb-6">
            🔍 書籍を検索
          </h2>

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                  書籍名
                </label>
                <input
                  type="text"
                  name="title"
                  value={searchForm.title}
                  onChange={handleChange}
                  className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                  placeholder="書籍のタイトルを入力"
                />
              </div>

              <div>
                <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                  著者名
                </label>
                <input
                  type="text"
                  name="author"
                  value={searchForm.author}
                  onChange={handleChange}
                  className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                  placeholder="著者名を入力"
                />
              </div>

              <div>
                <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                  出版社
                </label>
                <input
                  type="text"
                  name="publisherName"
                  value={searchForm.publisherName}
                  onChange={handleChange}
                  className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                  placeholder="出版社名を入力"
                />
              </div>

              <div>
                <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                  ISBN
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={searchForm.isbn}
                  onChange={handleChange}
                  className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                  placeholder="ISBNコードを入力"
                />
                <p className="text-[#5d6d7e] font-noto-sans text-sm mt-1">
                  ハイフンなしで入力してください
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-700 font-noto-sans text-sm">
                💡 ヒント: より正確な検索結果を得るために、複数の条件を組み合わせて検索することをお勧めします。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-noto-sans py-3 px-6 rounded-lg transition-colors"
              >
                🔍 検索実行
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-noto-sans py-3 px-6 rounded-lg transition-colors"
              >
                🗑️ クリア
              </button>
            </div>
          </form>

          {/* 検索のヒント */}
          <div className="mt-8 bg-white rounded-lg border border-[#c8d1d3] p-4">
            <h3 className="font-noto-sans font-medium text-[#2d3436] mb-3">
              📝 検索のコツ
            </h3>
            <ul className="text-[#5d6d7e] font-noto-sans text-sm space-y-1">
              <li>・ 部分的な単語でも検索できます</li>
              <li>・ 複数の条件を入力すると、より絞り込まれた結果が得られます</li>
              <li>・ ISBNでの検索が最も正確な結果を返します</li>
              <li>・ 著者名は姓名どちらでも検索可能です</li>
            </ul>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-8 text-center">
          <p className="text-[#5d6d7e] font-noto-sans text-sm">
            お探しの書籍が見つからない場合は、検索条件を変更してお試しください
          </p>
        </div>
      </div>
    </div>
  );
}

export default Search;
