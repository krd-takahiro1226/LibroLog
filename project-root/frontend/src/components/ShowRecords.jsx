"use client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ShowRecords() {

  // --- タイトル ---
  useEffect(() => {
    document.title = "登録書籍一覧 | Libro Log";
  }, []);
  // --- ここまで ---

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editableBooks, setEditableBooks] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // JWT token取得関数
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // トークン有効性チェック
  const checkTokenValidity = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("トークンが存在しません。再ログインしてください。");
      navigate("/login");
      return false;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (Date.now() >= decodedToken.exp * 1000) {
        alert("トークンの有効期限が切れています。再ログインしてください。");
        localStorage.removeItem("token");
        navigate("/login");
        return false;
      }
    } catch (error) {
      console.error("トークンの解析に失敗しました:", error);
      alert("無効なトークンです。再ログインしてください。");
      localStorage.removeItem("token");
      navigate("/login");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (checkTokenValidity()) {
      fetchBooks();
    }
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/showRecords`, {
        headers: getAuthHeaders()
      });

      console.log('Records:', response.data);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate("/login");
      } else {
        setError('データの取得に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // チェックボックスの制御
  const handleCheckboxChange = (isbn) => {
    setSelectedBooks((prev) =>
      prev.includes(isbn) ? prev.filter((id) => id !== isbn) : [...prev, isbn]
    );
  };

  // 全選択/全解除
  const handleSelectAll = () => {
    if (selectedBooks.length === books.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(books.map(book => book.isbn));
    }
  };

  // 編集モーダルを開く
  const handleOpenEditModal = () => {
    const selected = books.filter((book) =>
      selectedBooks.includes(book.isbn)
    );
    setEditableBooks(selected);
    setShowEditModal(true);
  };

  // レコードの編集・保存
  const handleEdit = async () => {
    if (!checkTokenValidity()) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/updateRecords`,
        editableBooks,
        { headers: getAuthHeaders() }
      );

      if (response.status === 200) {
        alert("書籍情報を更新しました");
        setShowEditModal(false);
        setSelectedBooks([]);
        await fetchBooks(); // データを再取得
      }
    } catch (error) {
      console.error("更新エラー:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate("/login");
      } else {
        alert(error.response?.data?.message || "更新に失敗しました");
      }
    }
  };

  // レコードの物理削除
  const handleDelete = async () => {
    if (!checkTokenValidity()) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/deleteRecords`,
        { isbns: selectedBooks },
        { headers: getAuthHeaders() }
      );

      if (response.status === 200) {
        alert("書籍を登録解除しました");
        setShowDeleteModal(false);
        setSelectedBooks([]);
        await fetchBooks(); // データを再取得
      }
    } catch (error) {
      console.error("削除エラー:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate("/login");
      } else {
        alert(error.response?.data?.message || "登録解除に失敗しました");
      }
    }
  };

  // CSVダウンロード処理
  const handleCSVDownload = async () => {
    if (!checkTokenValidity()) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/exportRecords/csv`,
        {
          headers: getAuthHeaders(),
          responseType: 'blob', // CSVファイルをblobとして受信
        }
      );

      // CSVファイルのダウンロード処理
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);

      // ファイル名を現在の日時で設定
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/[:-]/g, '');
      link.setAttribute("download", `登録書籍一覧_${timestamp}.csv`);

      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("CSV出力エラー:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate("/login");
      } else {
        alert(error.response?.data?.message || "CSV出力に失敗しました");
      }
    }
  };

  // 優先度の表示名を取得
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 1:
        return "🔥 すぐ読みたい本";
      case 2:
        return "📚 今後読みたい本";
      case 3:
        return "✅ 読んだことのある本";
      default:
        return "❓ 未分類";
    }
  };

  // 優先度の色を取得
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return "bg-red-100 text-red-800 border border-red-200";
      case 2:
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case 3:
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // 書籍画像の表示
  const renderBookImage = (book) => {
    const imageUrl = book.imageUrl || "/images/default-book.svg";
    return (
      <div className="cursor-pointer hover:opacity-80 transition-opacity" title="将来的にアフィリエイトリンクになる予定">
        <img
          src={imageUrl}
          alt={book.bookName}
          className="w-30 h-30 object-cover rounded-lg border border-[#e8e2d4] shadow-sm"
          onError={(e) => {
            e.target.src = "/images/default-book.svg";
          }}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-[#f4f1e8] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d3436]"></div>
            <p className="text-[#5d6d7e] font-noto-sans mt-4">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-screen bg-[#f4f1e8] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 text-4xl mb-4">❌</div>
            <p className="text-red-600 font-noto-sans text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-noto-sans px-6 py-2 rounded-lg transition-colors mt-4"
            >
              再試行
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-[#f4f1e8] p-8">
      <div className="max-w-6xl mx-auto">
        {/* 統一されたヘッダー */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-noto-sans text-[#2d3436]">📚 Libro Log</h1>
            <p className="text-[#5d6d7e] font-noto-sans mt-1">登録書籍一覧</p>
          </div>
          <button
            onClick={() => navigate("/menu")}
            className="bg-gray-600 hover:bg-gray-700 text-white font-noto-sans px-6 py-2 rounded-lg transition-colors"
          >
            メニューに戻る
          </button>
        </header>

        {/* アクションバー */}
        <div className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-[#2d3436] font-noto-sans">
                <span className="font-medium">{books.length}</span> 冊の書籍が登録されています
              </p>
              {selectedBooks.length > 0 && (
                <p className="text-blue-600 font-noto-sans text-sm">
                  {selectedBooks.length} 冊選択中
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSelectAll}
                className="bg-gray-600 hover:bg-gray-700 text-white font-noto-sans px-4 py-2 rounded-lg transition-colors text-sm"
              >
                {selectedBooks.length === books.length ? "全解除" : "全選択"}
              </button>
              <button
                onClick={handleOpenEditModal}
                disabled={selectedBooks.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-noto-sans px-4 py-2 rounded-lg transition-colors text-sm disabled:cursor-not-allowed"
              >
                ✏️ 編集 ({selectedBooks.length})
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={selectedBooks.length === 0}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-noto-sans px-4 py-2 rounded-lg transition-colors text-sm disabled:cursor-not-allowed"
              >
                🗑️ 登録解除 ({selectedBooks.length})
              </button>
              <button
                onClick={handleCSVDownload}
                className="bg-green-600 hover:bg-green-700 text-white font-noto-sans px-4 py-2 rounded-lg transition-colors text-sm"
              >
                📊 CSV出力
              </button>
            </div>
          </div>
        </div>

        {/* 書籍一覧 */}
        <div className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] overflow-hidden">
          {Array.isArray(books) && books.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white border-b border-[#e8e2d4]">
                  <tr>
                    <th className="text-left p-4 font-noto-sans font-medium text-[#2d3436]">
                      <input
                        type="checkbox"
                        checked={books.length > 0 && selectedBooks.length === books.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="text-left p-4 font-noto-sans font-medium text-[#2d3436]">画像</th>
                    <th className="text-left p-4 font-noto-sans font-medium text-[#2d3436]">ISBN</th>
                    <th className="text-left p-4 font-noto-sans font-medium text-[#2d3436]">書籍名</th>
                    <th className="text-left p-4 font-noto-sans font-medium text-[#2d3436]">著者</th>
                    <th className="text-left p-4 font-noto-sans font-medium text-[#2d3436]">読み始めた日</th>
                    <th className="text-left p-4 font-noto-sans font-medium text-[#2d3436]">読了日</th>
                    <th className="text-left p-4 font-noto-sans font-medium text-[#2d3436]">優先度</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book, index) => (
                    <tr
                      key={index}
                      className={`border-b border-[#e8d1d3] hover:bg-white transition-colors ${selectedBooks.includes(book.isbn) ? 'bg-blue-50' : ''
                        }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedBooks.includes(book.isbn)}
                          onChange={() => handleCheckboxChange(book.isbn)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-4">
                        {renderBookImage(book)}
                      </td>
                      <td className="p-4 font-noto-sans text-[#5d6d7e] text-sm">{book.isbn}</td>
                      <td className="p-4 font-noto-sans text-[#2d3436] font-medium">{book.bookName}</td>
                      <td className="p-4 font-noto-sans text-[#5d6d7e]">{book.author}</td>
                      <td className="p-4 font-noto-sans text-[#5d6d7e]">{book.startDate || "未設定"}</td>
                      <td className="p-4 font-noto-sans text-[#5d6d7e]">{book.endDate || "未設定"}</td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-noto-sans ${getPriorityColor(book.priority)}`}>
                          {getPriorityLabel(book.priority)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-[#5d6d7e] text-6xl mb-4">📚</div>
              <p className="text-[#5d6d7e] font-noto-sans text-lg mb-2">登録された書籍がありません</p>
              <p className="text-[#5d6d7e] font-noto-sans text-sm mb-6">
                書籍検索から新しい書籍を登録してみましょう
              </p>
              <button
                onClick={() => navigate("/searchBooks")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-noto-sans px-6 py-2 rounded-lg transition-colors"
              >
                📖 書籍を検索
              </button>
            </div>
          )}
        </div>

        {/* 編集モーダル */}
        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-[#faf8f3] rounded-xl shadow-lg border border-[#e8e2d4] p-8 w-[90vw] max-w-5xl max-h-[80vh] overflow-hidden">
              <h3 className="font-noto-sans text-xl font-semibold text-[#2d3436] mb-6">
                ✏️ 書籍情報編集
              </h3>

              <div className="overflow-auto max-h-[50vh] mb-6">
                <table className="w-full border-collapse">
                  <thead className="bg-white sticky top-0">
                    <tr>
                      <th className="border border-[#c8d1d3] p-3 text-left font-noto-sans text-[#2d3436]">画像</th>
                      <th className="border border-[#c8d1d3] p-3 text-left font-noto-sans text-[#2d3436]">ISBN</th>
                      <th className="border border-[#c8d1d3] p-3 text-left font-noto-sans text-[#2d3436]">書籍名</th>
                      <th className="border border-[#c8d1d3] p-3 text-left font-noto-sans text-[#2d3436]">著者</th>
                      <th className="border border-[#c8d1d3] p-3 text-left font-noto-sans text-[#2d3436]">読み始めた日</th>
                      <th className="border border-[#c8d1d3] p-3 text-left font-noto-sans text-[#2d3436]">読了日</th>
                      <th className="border border-[#c8d1d3] p-3 text-left font-noto-sans text-[#2d3436]">優先度</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editableBooks.map((book, index) => (
                      <tr key={index} className="bg-white">
                        <td className="border border-[#c8d1d3] p-3">
                          <div className="w-20 h-20">
                            <img
                              src={book.imageUrl || "/images/default-book.svg"}
                              alt={book.bookName}
                              className="w-full h-full object-cover rounded border"
                              onError={(e) => {
                                e.target.src = "/images/default-book.svg";
                              }}
                            />
                          </div>
                        </td>
                        <td className="border border-[#c8d1d3] p-3 font-noto-sans text-[#5d6d7e] text-sm">{book.isbn}</td>
                        <td className="border border-[#c8d1d3] p-3 font-noto-sans text-[#2d3436]">{book.bookName}</td>
                        <td className="border border-[#c8d1d3] p-3 font-noto-sans text-[#5d6d7e]">{book.author}</td>
                        <td className="border border-[#c8d1d3] p-3">
                          <input
                            type="date"
                            value={book.startDate || ""}
                            onChange={(e) =>
                              setEditableBooks((prev) =>
                                prev.map((b, i) =>
                                  i === index ? { ...b, startDate: e.target.value } : b
                                )
                              )
                            }
                            className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-3 py-2 font-noto-sans outline-none transition-colors bg-white"
                          />
                        </td>
                        <td className="border border-[#c8d1d3] p-3">
                          <input
                            type="date"
                            value={book.endDate || ""}
                            onChange={(e) =>
                              setEditableBooks((prev) =>
                                prev.map((b, i) =>
                                  i === index ? { ...b, endDate: e.target.value } : b
                                )
                              )
                            }
                            className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-3 py-2 font-noto-sans outline-none transition-colors bg-white"
                          />
                        </td>
                        <td className="border border-[#c8d1d3] p-3">
                          <select
                            value={book.priority}
                            onChange={(e) =>
                              setEditableBooks((prev) =>
                                prev.map((b, i) =>
                                  i === index ? { ...b, priority: parseInt(e.target.value) } : b
                                )
                              )
                            }
                            className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-3 py-2 font-noto-sans outline-none transition-colors bg-white"
                          >
                            <option value={1}>🔥 すぐ読みたい本</option>
                            <option value={2}>📚 今後読みたい本</option>
                            <option value={3}>✅ 読んだことのある本</option>
                            <option value={0}>❓ 未分類</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-noto-sans px-6 py-3 rounded-lg transition-colors"
                >
                  ❌ キャンセル
                </button>
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-noto-sans px-6 py-3 rounded-lg transition-colors"
                >
                  💾 保存する
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 削除確認モーダル */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-[#faf8f3] rounded-xl shadow-lg border border-[#e8e2d4] p-8 w-[90vw] max-w-4xl max-h-[80vh] overflow-hidden">
              <h3 className="font-noto-sans text-xl font-semibold text-[#2d3436] mb-6">
                🗑️ 登録解除確認
              </h3>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-noto-sans">
                  ⚠️ 以下の {selectedBooks.length} 冊の書籍を登録解除します。この操作は取り消せません。
                </p>
              </div>

              <div className="overflow-auto max-h-[40vh] mb-6">
                <table className="w-full border-collapse">
                  <thead className="bg-white sticky top-0">
                    <tr>
                      <th className="border border-[#c8d1d3] p-3 text-left font-noto-sans text-[#2d3436]">画像</th>
                      <th className="border border-[#c8d1d3] p-3 text-left font-noto-sans text-[#2d3436]">ISBN</th>
                      <th className="border border-[#c8d1d3] p-3 text-left font-noto-sans text-[#2d3436]">書籍名</th>
                      <th className="border border-[#c8d1d3] p-3 text-left font-noto-sans text-[#2d3436]">著者</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBooks.map((isbn) => {
                      const book = books.find((b) => b.isbn === isbn);
                      return (
                        <tr key={isbn} className="bg-white">
                          <td className="border border-[#c8d1d3] p-3">
                            <div className="w-20 h-20">
                              <img
                                src={book?.imageUrl || "/images/default-book.svg"}
                                alt={book?.bookName}
                                className="w-full h-full object-cover rounded border"
                                onError={(e) => {
                                  e.target.src = "/images/default-book.svg";
                                }}
                              />
                            </div>
                          </td>
                          <td className="border border-[#c8d1d3] p-3 font-noto-sans text-[#5d6d7e] text-sm">{book?.isbn}</td>
                          <td className="border border-[#c8d1d3] p-3 font-noto-sans text-[#2d3436]">{book?.bookName}</td>
                          <td className="border border-[#c8d1d3] p-3 font-noto-sans text-[#5d6d7e]">{book?.author}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-noto-sans px-6 py-3 rounded-lg transition-colors"
                >
                  ❌ キャンセル
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-noto-sans px-6 py-3 rounded-lg transition-colors"
                >
                  🗑️ 登録解除する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowRecords;
