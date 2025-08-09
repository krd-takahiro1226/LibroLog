"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../assets/styles/styles.css'; 

function Search() {

  // --- タイトル ---
  useEffect(() => {
    document.title = "検索 | Libro Log";
  }, []);
  // --- ここまで ---
  


  const [searchForm, setSearchForm] = React.useState({
    title: "",
    author: "",
    publisher: "",
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
    navigate("/searchBooksResult", { state: searchForm }); 
  };

  const handleClear = () => {
    setSearchForm({
      title: "",
      author: "",
      publisher: "",
      isbn: "",
    });
  };

  return (
    <div className="min-h-screen w-screen bg-[#f5f5f5] p-8">
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
    <header className="flex items-center justify-between mb-12">
        <div>
          <button
            onClick={() => navigate("/menu")}
            className="text-3xl font-noto-sans hover:text-gray-600 transition-colors"
          >
            📚 Libro Log
          </button>
        </div>
      </header>
        {/* <h1 className="text-2xl font-roboto text-gray-800 mb-6">書籍検索</h1> */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                書籍名
              </label>
              <input
                type="text"
                name="title"
                value={searchForm.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                著者名
              </label>
              <input
                type="text"
                name="author"
                value={searchForm.author}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                出版社
              </label>
              <input
                type="text"
                name="publisherName"
                value={searchForm.publisherName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ISBN
              </label>
              <input
                type="text"
                name="isbn"
                value={searchForm.isbn}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              検索
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              クリア
            </button>
            <button
              onClick={() => window.location.href = '/menu'}
              type="button"
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              メニューへ戻る
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Search;
