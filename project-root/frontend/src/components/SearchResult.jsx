import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function SearchResult() {

  // --- タイトル ---
  useEffect(() => {
    document.title = "検索結果 | Libro Log";
  }, []);
  // --- ここまで ---

  const { state: searchForm } = useLocation();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(30);
  const [pageInfo, setPageInfo] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    if (searchForm) {
      searchBooks();
    } else {
      // 検索条件がない場合はメニューに戻る
      navigate("/menu");
    }
  }, [searchForm, currentPage]);

  const searchBooks = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/searchBooks/sruSearch`, {
        params: {
          ...searchForm,
          currentPage: currentPage,
          limit: limit
        },
        headers: getAuthHeaders(),
        withCredentials: true
      });

      console.log("API Response:", response.data); // デバッグ用

      if (response.data.items) {
        setItems(response.data.items || []);
        setCurrentPage(response.data.page || 1);

        // APIレスポンスからページ情報を取得
        if (response.data.page) {
          setPageInfo({
            pageCount: response.data.pageCount || 1,
            totalCount: response.data.count || 1,
            hasNextPage: response.data.pageCount > response.data.page || false
          }
          );
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate("/login");
      } else {
        setErrorMessage(error.response?.data?.message || "検索中にエラーが発生しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (pageInfo && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pageInfo && pageInfo.pageCount > currentPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRegisterClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
    setIsPriorityModalOpen(false);
  };

  const handlePriorityModalClose = () => {
    setIsPriorityModalOpen(false);
  };

  const handleRegisterOption = async (option) => {
    try {
      if (option === "new") {
        // 優先度選択モーダルを表示
        setIsPriorityModalOpen(true);
      } else if (option === "library") {
        // 書籍ライブラリに追加
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/searchBooks/sruSearch/register`, {
          title: selectedBook.title,
          author: selectedBook.author || selectedBook.authors?.join(", ") || "",
          genre: selectedBook.categories?.join(", ") || "",
          isbn: selectedBook.isbn || "",
          publisherName: selectedBook.publisherName || "",
          salesDate: selectedBook.salesDate || "",
          size: selectedBook.size || "",
          description: selectedBook.description || "",
          thumbnail: selectedBook.largeImageUrl || ""
        }, {
          headers: getAuthHeaders(),
          withCredentials: true
        });

        if (response.data.success) {
          alert("書籍をライブラリに追加しました");
        } else {
          alert(response.data.message || "書籍の追加に失敗しました");
        }
        handleModalClose();
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate("/login");
      } else {
        alert(error.response?.data?.message || "登録中にエラーが発生しました");
      }
      handleModalClose();
    }
  };

  const handlePrioritySelection = async (priority) => {
    try {
      const requestData = {
        isbn: selectedBook.isbn || "",
        title: selectedBook.title,
        author: selectedBook.author || selectedBook.authors?.join(", ") || "",
        size: selectedBook.size || "",
        salesDate: selectedBook.salesDate || "",
        publisherName: selectedBook.publisherName || "",
        selectedOption: priority
      };

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/searchBooks/sruSearch/register`, requestData, {
        headers: getAuthHeaders(),
        withCredentials: true
      });

      // バックエンドは文字列でレスポンスを返すため、response.dataを直接チェック
      if (response.data === "200") {
        let priorityText;
        switch (priority) {
          case 1: priorityText = "すぐに読みたい"; break;
          case 2: priorityText = "今後読みたい"; break;
          case 3: priorityText = "既に読んだ"; break;
          default: priorityText = "";
        }
        alert(`書籍を「${priorityText}」として読書記録に登録しました`);
      } else if (response.data === "400") {
        alert("この書籍は既に登録されています");
      } else {
        alert("読書記録の登録に失敗しました");
      }
    } catch (error) {
      console.error("Priority registration error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate("/login");
      } else {
        alert(error.response?.data?.message || "読書記録の登録中にエラーが発生しました");
      }
    } finally {
      handleModalClose();
    }
  };

  const handleBackToSearch = () => {
    navigate("/searchBooks");
  };

  // 画像URLの取得（優先順位: large > medium > small）
  const getBookImageUrl = (book) => {
    return book.largeImageUrl || book.mediumImageUrl || book.smallImageUrl || null;
  };

  return (
    <div className="min-h-screen w-screen bg-[#f4f1e8] p-8">
      <div className="max-w-6xl mx-auto">
        {/* 統一されたヘッダー */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-noto-sans text-[#2d3436]">📚 Libro Log</h1>
            <p className="text-[#5d6d7e] font-noto-sans mt-1">検索結果</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleBackToSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-noto-sans px-6 py-2 rounded-lg transition-colors"
            >
              再検索
            </button>
            <button
              onClick={() => navigate("/menu")}
              className="bg-gray-600 hover:bg-gray-700 text-white font-noto-sans px-6 py-2 rounded-lg transition-colors"
            >
              メニューに戻る
            </button>
          </div>
        </header>

        {/* 検索条件表示 */}
        {searchForm && (
          <div className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] p-6 mb-8">
            <h3 className="font-noto-sans text-lg font-semibold text-[#2d3436] mb-4">🔍 検索条件</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              {searchForm.title && (
                <div>
                  <span className="font-medium text-[#2d3436]">タイトル: </span>
                  <span className="text-[#5d6d7e]">{searchForm.title}</span>
                </div>
              )}
              {searchForm.author && (
                <div>
                  <span className="font-medium text-[#2d3436]">著者: </span>
                  <span className="text-[#5d6d7e]">{searchForm.author}</span>
                </div>
              )}
              {searchForm.publisherName && (
                <div>
                  <span className="font-medium text-[#2d3436]">出版社: </span>
                  <span className="text-[#5d6d7e]">{searchForm.publisherName}</span>
                </div>
              )}
              {searchForm.isbn && (
                <div>
                  <span className="font-medium text-[#2d3436]">ISBN: </span>
                  <span className="text-[#5d6d7e]">{searchForm.isbn}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 検索結果 */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d3436]"></div>
            <p className="text-[#5d6d7e] font-noto-sans mt-4">検索中...</p>
          </div>
        ) : errorMessage ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 text-4xl mb-4">❌</div>
            <p className="text-red-600 font-noto-sans text-lg mb-4">{errorMessage}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleBackToSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white font-noto-sans px-6 py-2 rounded-lg transition-colors"
              >
                検索条件を変更
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 hover:bg-gray-700 text-white font-noto-sans px-6 py-2 rounded-lg transition-colors"
              >
                再試行
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] p-12 text-center">
            <div className="text-[#5d6d7e] text-6xl mb-4">📚</div>
            <p className="text-[#5d6d7e] font-noto-sans text-lg mb-2">検索結果が見つかりませんでした</p>
            <p className="text-[#5d6d7e] font-noto-sans text-sm mb-6">
              検索条件を変更してもう一度お試しください
            </p>
            <button
              onClick={handleBackToSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-noto-sans px-6 py-2 rounded-lg transition-colors"
            >
              🔍 新しく検索する
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-[#5d6d7e] font-noto-sans">
                <span className="font-medium text-[#2d3436]">{pageInfo.totalCount}</span> 件の結果が見つかりました
                {pageInfo && (
                  <span className="ml-2">
                    (ページ {currentPage}
                    {pageInfo.pageCount && ` / ${pageInfo.pageCount}`})
                  </span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((book, index) => (
                <div key={index} className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] p-6 hover:shadow-lg transition-shadow group">
                  <div className="flex flex-col h-full">
                    {/* 書籍画像 */}
                    {getBookImageUrl(book) && (
                      <div className="mb-4 overflow-hidden rounded-lg">
                        <img
                          src={getBookImageUrl(book)}
                          alt={book.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <h3 className="font-noto-sans text-lg font-semibold text-[#2d3436] mb-2 line-clamp-2">
                      {book.title}
                    </h3>

                    <div className="space-y-1 text-sm mb-4 flex-grow">
                      <p className="text-[#5d6d7e] font-noto-sans">
                        <span className="font-medium">📝 著者:</span> {book.author || "不明"}
                      </p>

                      <p className="text-[#5d6d7e] font-noto-sans">
                        <span className="font-medium">🏢 出版社:</span> {book.publisherName || "不明"}
                      </p>

                      {book.isbn && (
                        <p className="text-[#5d6d7e] font-noto-sans">
                          <span className="font-medium">📚 ISBN:</span> {book.isbn}
                        </p>
                      )}

                      {book.salesDate && (
                        <p className="text-[#5d6d7e] font-noto-sans">
                          <span className="font-medium">📅 発売日:</span> {book.salesDate}
                        </p>
                      )}

                      {book.size && (
                        <p className="text-[#5d6d7e] font-noto-sans">
                          <span className="font-medium">📏 サイズ:</span> {book.size}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleRegisterClick(book)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-noto-sans py-2 px-4 rounded-lg transition-colors mt-auto"
                    >
                      📝 登録する
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ページネーション */}
            {pageInfo && (
              <div className="flex justify-center items-center mt-8 space-x-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-noto-sans px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  ← 前の{limit}件
                </button>

                <span className="text-[#2d3436] font-noto-sans bg-[#faf8f3] px-4 py-2 rounded-lg border border-[#c8d1d3]">
                  ページ {currentPage}
                  {pageInfo.pageCount && ` / ${pageInfo.pageCount}`}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={!pageInfo.hasNextPage}
                  className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-noto-sans px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  次の{limit}件 →
                </button>
              </div>
            )}
          </>
        )}

        {/* 登録方法選択モーダル */}
        {isModalOpen && !isPriorityModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-[#faf8f3] rounded-xl shadow-lg border border-[#e8e2d4] p-8 w-96 max-w-[90vw]">
              <h3 className="font-noto-sans text-xl font-semibold text-[#2d3436] mb-6 text-center">
                📚 登録方法を選択
              </h3>
              {selectedBook && (
                <div className="mb-6 p-4 bg-white rounded-lg border border-[#c8d1d3]">
                  <p className="font-noto-sans font-medium text-[#2d3436] text-sm">{selectedBook.title}</p>
                  <p className="text-[#5d6d7e] font-noto-sans text-xs mt-1">
                    {selectedBook.author || "不明"}
                  </p>
                  {selectedBook.isbn && (
                    <p className="text-[#5d6d7e] font-noto-sans text-xs">
                      ISBN: {selectedBook.isbn}
                    </p>
                  )}
                </div>
              )}
              <div className="space-y-4">
                <button
                  onClick={() => handleRegisterOption("new")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-noto-sans py-3 px-4 rounded-lg transition-colors"
                >
                  📖 読書記録として登録
                </button>
                <button
                  onClick={() => handleRegisterOption("library")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-noto-sans py-3 px-4 rounded-lg transition-colors"
                >
                  📚 書籍ライブラリに追加
                </button>
                <button
                  onClick={handleModalClose}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-noto-sans py-3 px-4 rounded-lg transition-colors"
                >
                  ❌ キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 優先度選択モーダル */}
        {isPriorityModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-[#faf8f3] rounded-xl shadow-lg border border-[#e8e2d4] p-8 w-96 max-w-[90vw]">
              <h3 className="font-noto-sans text-xl font-semibold text-[#2d3436] mb-6 text-center">
                📖 読書の優先度を選択
              </h3>
              {selectedBook && (
                <div className="mb-6 p-4 bg-white rounded-lg border border-[#c8d1d3]">
                  <p className="font-noto-sans font-medium text-[#2d3436] text-sm">{selectedBook.title}</p>
                  <p className="text-[#5d6d7e] font-noto-sans text-xs mt-1">
                    {selectedBook.author || "不明"}
                  </p>
                </div>
              )}
              <div className="space-y-4">
                <button
                  onClick={() => handlePrioritySelection(1)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-noto-sans py-3 px-4 rounded-lg transition-colors"
                >
                  🔥 すぐに読みたい
                </button>
                <button
                  onClick={() => handlePrioritySelection(2)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-noto-sans py-3 px-4 rounded-lg transition-colors"
                >
                  📚 今後読みたい
                </button>
                <button
                  onClick={() => handlePrioritySelection(3)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-noto-sans py-3 px-4 rounded-lg transition-colors"
                >
                  ✅ 既に読んだ
                </button>
                <button
                  onClick={handlePriorityModalClose}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-noto-sans py-3 px-4 rounded-lg transition-colors"
                >
                  ← 戻る
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResult;
