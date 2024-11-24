"use client";
import {React, useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import axios from "axios";

function ShowRecords() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selectedBooks, setSelectedBooks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('トークンが存在しません。再ログインしてください。');
      window.location.href = '/login';
      return;
    }
  
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    if (Date.now() >= decodedToken.exp * 1000) {
      alert('トークンの有効期限が切れています。再ログインしてください。');
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }
  
    // レコード取得
    axios
      .get('http://localhost:8080/showRecords', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        console.log('Records:', response.data);
        setBooks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('データの取得に失敗しました');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>{error}</div>;

  const handleCheckboxChange = (isbn) => {
    setSelectedBooks((prev) =>
      prev.includes(isbn) ? prev.filter((id) => id !== isbn) : [...prev, isbn]
    );
  };

  return (
    <div className="min-h-screen w-screen bg-[#f5f5f5] p-8">
      <div className="mx-auto bg-white p-6 rounded-lg shadow-md w-full">
        <div className="flex justify-between items-center w-full">
          <button
            onClick={() => navigate("/menu")}
            className="text-3xl font-noto-sans hover:text-gray-600 transition-colors"
          >
            📚 Libro Log
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            disabled={selectedBooks.length === 0}
          >
            編集
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">選択</th>
              <th className="border p-3 text-left">ISBN</th>
              <th className="border p-3 text-left">書籍名</th>
              <th className="border p-3 text-left">著者</th>
              <th className="border p-3 text-left">読み始めた日</th>
              <th className="border p-3 text-left">読了日</th>
              <th className="border p-3 text-left">優先度</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(books) && books.length > 0 ? (
              books.map((book, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-3">
                    <input
                      type="checkbox"
                      checked={selectedBooks.includes(book.isbn)}
                      onChange={() => handleCheckboxChange(book.isbn)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="border p-3">{book.isbn}</td>
                  <td className="border p-3">{book.title}</td>
                  <td className="border p-3">{book.author}</td>
                  <td className="border p-3">{book.startDate}</td>
                  <td className="border p-3">{book.endDate || "-"}</td>
                  <td className="border p-3">{book.priority}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-3">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShowRecords;
