"use client";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import '../assets/styles/styles.css'; 

function SearchResult() {
  const { state: searchForm } = useLocation();
  const [items, setItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(token);
        const response = await axios.get("http://localhost:8080/searchBooks/sruSearch", {
          params: searchForm,
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setItems(response.data.items || []);
        console.log("Books state:", items);
      } catch (error) {
        setErrorMessage("検索中にエラーが発生しました。");
        console.error(error);
      }
    };

    fetchBooks();
  }, [searchForm]);

  return (
    <div className="min-h-screen w-screen bg-[#f5f5f5] p-8">
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-noto-sans mb-6">検索結果</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg table-fixed border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left w-12">No</th>
              <th className="px-4 py-3 text-left w-40">書籍画像</th>
              <th className="px-4 py-3 text-left">タイトル</th>
              <th className="px-4 py-3 text-left w-32">著者</th>
              <th className="px-4 py-3 text-left w-24">ジャンル</th>
              <th className="px-4 py-3 text-left w-32">出版社</th>
              <th className="px-4 py-3 text-left w-32">出版年</th>
              <th className="px-4 py-3 text-left w-24">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((book, index) => (
              <tr key={book.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">
                  <img
                    src={book.smallImageUrl}
                    alt={`${book.title}の表紙`}
                    className="w-16 h-24 object-cover"
                  />
                </td>
                <td className="px-4 py-3">{book.title}</td>
                <td className="px-4 py-3">{book.author}</td>
                <td className="px-4 py-3">{book.size}</td>
                <td className="px-4 py-3">{book.publisherName}</td>
                <td className="px-4 py-3">{book.salesDate}</td>
                <td className="px-4 py-3">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                    onClick={() => alert(`${book.title}を登録しました`)}
                  >
                    登録
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
}

export default SearchResult;
