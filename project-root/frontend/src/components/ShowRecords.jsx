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
  const [showPopup, setShowPopup] = useState(false); // ポップアップ表示状態
  const [editableBooks, setEditableBooks] = useState([]); // 編集対象の書籍

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

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/updateRecords",
        editableBooks,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
     //バックエンドから成功レスポンスが返ってきた場合
    if (response.status === 200) {
        const updatedBooks = await axios.get("http://localhost:8080/showRecords", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBooks(updatedBooks.data); // 最新データをbooksに反映
      alert("保存しました");
      setShowPopup(false); // ポップアップを閉じる
    } 
    else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  }
   catch (error) {
    if (error.response) {
      // サーバーからのエラー (例: 400, 500エラー)
      alert(
        `エラーが発生しました: ${error.response.status} - ${error.response.data.message || "詳細は不明です"}`
      );
    } else if (error.request) {
      // リクエストが送信されたがレスポンスが返ってこない
      alert("サーバーに接続できませんでした。ネットワークを確認してください。");
    } else {
      // 予期しないエラー
      alert(`エラーが発生しました: ${error.message}`);
    }
  }
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
            onClick={() => {
              const selected = books.filter((book) =>
                selectedBooks.includes(book.isbn)
              );
              setEditableBooks(selected);
              setShowPopup(true);
            }}
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
                  <td className="border p-3">{book.book_name}</td>
                  <td className="border p-3">{book.author}</td>
                  <td className="border p-3">{book.start_date}</td>
                  <td className="border p-3">{book.end_date}</td>
                  {/* <td className="border p-3">{book.priority}</td> */}
                  <td className="border p-3">
                    {(() => {
                      switch (book.priority) {
                        case 1:
                          return "すぐ読みたい本";
                        case 2:
                          return "今後読みたい本";
                        case 3:
                          return "読んだことのある本";
                        default:
                          return "未分類";
                      }
                    })()}
                  </td>
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
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 max-w-4xl">
            <h2 className="text-xl font-bold mb-4">編集</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left">ISBN</th>
                  <th className="border p-2 text-left">書籍名</th>
                  <th className="border p-2 text-left">著者</th>
                  <th className="border p-2 text-left">読み始めた日</th>
                  <th className="border p-2 text-left">読了日</th>
                  <th className="border p-2 text-left">優先度</th>
                </tr>
              </thead>
              <tbody>
                {editableBooks.map((book, index) => (
                  <tr key={index}>
                    <td className="border p-2">{book.isbn}</td>
                    <td className="border p-2">{book.book_name}</td>
                    <td className="border p-2">{book.author}</td>
                    <td className="border p-2">
                      <input
                        type="date"
                        value={book.start_date}
                        onChange={(e) =>
                          setEditableBooks((prev) =>
                            prev.map((b, i) =>
                              i === index ? { ...b, start_date: e.target.value } : b
                            )
                          )
                        }
                        className="w-full border rounded p-1"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="date"
                        value={book.end_date}
                        onChange={(e) =>
                          setEditableBooks((prev) =>
                            prev.map((b, i) =>
                              i === index ? { ...b, end_date: e.target.value } : b
                            )
                          )
                        }
                        className="w-full border rounded p-1"
                      />
                    </td>
                    <td className="border p-2">
                      <select
                        value={book.priority}
                        onChange={(e) =>
                          setEditableBooks((prev) =>
                            prev.map((b, i) =>
                              i === index ? { ...b, priority: parseInt(e.target.value) } : b
                            )
                          )
                        }
                        className="w-full border rounded p-1"
                      >
                        <option value={1}>すぐ読みたい本</option>
                        <option value={2}>今後読みたい本</option>
                        <option value={3}>読んだことのある本</option>
                        <option value={0}>未分類</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => {
                  setShowPopup(false);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                戻る
              </button>
              <button
                onClick={() => handleSave()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowRecords;
