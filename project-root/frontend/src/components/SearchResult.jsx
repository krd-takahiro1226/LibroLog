import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/styles.css";

function SearchResult() {
  const { state: searchForm } = useLocation();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 検索中の状態を管理
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true); // 検索中に設定
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/searchBooks/sruSearch", {
          params: { ...searchForm, currentPage, limit },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(response.data.items || []);
        setCurrentPage(response.data.page || 1);
        setTotalPages(response.data.pageCount || 1);
      } catch (error) {
        setErrorMessage("検索中にエラーが発生しました。");
        console.error(error);
      } finally {
        setIsLoading(false); // 検索完了後に設定
      }
    };

    fetchBooks();
  },  [searchForm, currentPage, limit]);
  
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleRegisterClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleRegisterOption = async (option) => {
    if (!selectedBook) {
      alert("本が選択されていません");
      return;
    }

    const requestData = {
      isbn: selectedBook.isbn,
      title: selectedBook.title,
      author: selectedBook.author,
      size: selectedBook.size,
      salesDate: selectedBook.salesDate,
      publisherName: selectedBook.publisherName,
      selectedOption: option, // 優先度に対応
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/searchBooks/sruSearch/register", requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(`${selectedBook.title}を登録しました`);
      setIsModalOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error("登録中にエラーが発生しました", error);
      alert("登録に失敗しました。もう一度お試しください。");
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

        {/* 検索中の場合 */}
        {isLoading && <p className="text-center mt-4 text-gray-600">検索中...</p>}

        {/* エラー表示 */}
        {!isLoading && errorMessage && (
          <p className="text-center mt-4 text-red-500">{errorMessage}</p>
        )}

        {/* 検索結果がない場合 */}
        {!isLoading && items.length === 0 && !errorMessage && (
          <p className="text-center mt-4 text-gray-600">検索結果がありません。</p>
        )}

        {/* 検索結果表示 */}
        {!isLoading && items.length > 0 && (
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
                    <td className="px-4 py-3">{(currentPage - 1) * limit + index + 1}</td>
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
                        onClick={() => handleRegisterClick(book)}
                      >
                        登録
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 space-x-4">
              <button
                className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                onClick={handlePreviousPage}
                disabled={totalPages <= 1 || currentPage === 1}
              >
                前へ
              </button>
              <span className="px-4 py-2">{currentPage} / {totalPages}</span>
              <button
                className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                onClick={handleNextPage}
                disabled={totalPages <= 1 || currentPage === totalPages}
              >
                次へ
              </button>
            </div>
            {/* モーダル */}
            {isModalOpen && selectedBook && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h2 className="text-lg font-bold mb-4">「{selectedBook.title}」を登録します</h2>
                  <div className="space-y-4">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600"
                      onClick={() => handleRegisterOption(1)}
                    >
                      すぐに読みたい
                    </button>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
                      onClick={() => handleRegisterOption(2)}
                    >
                      今後読みたい
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded w-full hover:bg-yellow-600"
                      onClick={() => handleRegisterOption(3)}
                    >
                      既に読んだ
                    </button>
                  </div>
                  <button
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full hover:bg-gray-600"
                    onClick={handleModalClose}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResult;
