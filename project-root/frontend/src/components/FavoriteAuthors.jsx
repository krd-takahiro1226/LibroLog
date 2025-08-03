"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSignOutAlt, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import '../assets/styles/styles.css';

function FavoriteAuthors() {
  
  // --- タイトル ---
  useEffect(() => {
    document.title = "お気に入り著者 | Libro Log";
  }, []);
  // --- ここまで ---

  const [favoriteAuthors, setFavoriteAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newAuthorName, setNewAuthorName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  // トークンの取得
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // お気に入り著者一覧を取得
  const fetchFavoriteAuthors = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/favoriteAuthors`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        setFavoriteAuthors(response.data.favoriteAuthors || []);
        setError('');
      } else {
        setError('お気に入り著者の取得に失敗しました');
      }
    } catch (error) {
      console.error('Error fetching favorite authors:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'サーバーエラーが発生しました';
        setError(`エラー: ${errorMessage} (Status: ${error.response?.status || 'Unknown'})`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 著者をフォロー
  const followAuthor = async (authorName) => {
    try {
      const token = getToken();
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/favoriteAuthors/follow`, null, {
        params: { authorName },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        fetchFavoriteAuthors(); // リフレッシュ
        setNewAuthorName('');
        setShowAddForm(false);
      } else {
        setError(response.data.message || 'フォローに失敗しました');
      }
    } catch (error) {
      console.error('Error following author:', error);
      setError('フォローに失敗しました');
    }
  };

  // 著者をアンフォロー
  const unfollowAuthor = async (authorName) => {
    try {
      const token = getToken();
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/favoriteAuthors/unfollow`, null, {
        params: { authorName },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        fetchFavoriteAuthors(); // リフレッシュ
      } else {
        setError(response.data.message || 'フォロー解除に失敗しました');
      }
    } catch (error) {
      console.error('Error unfollowing author:', error);
      setError('フォロー解除に失敗しました');
    }
  };

  // 新しい著者を追加
  const handleAddAuthor = (e) => {
    e.preventDefault();
    if (newAuthorName.trim()) {
      followAuthor(newAuthorName.trim());
    }
  };

  // ログアウト
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  // 初期データ取得
  useEffect(() => {
    fetchFavoriteAuthors();
  }, []);

  return (
    <div className="min-h-screen w-screen bg-[#f4f1e8] p-8">
      <div className="max-w-6xl mx-auto">
        {/* 統一されたヘッダー */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-noto-sans text-[#2d3436]">📚 Libro Log</h1>
            <p className="text-[#5d6d7e] font-noto-sans mt-1">お気に入り著者</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/menu")}
              className="bg-gray-600 hover:bg-gray-700 text-white font-noto-sans px-6 py-2 rounded-lg transition-colors"
            >
              メニューに戻る
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-noto-sans px-6 py-2 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              ログアウト
            </button>
          </div>
        </header>

        {/* 著者管理セクション */}
        <div className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] p-6 mb-8">
          <h2 className="font-noto-sans text-xl font-semibold text-[#2d3436] mb-6">
            <FontAwesomeIcon icon={faHeart} className="text-red-600 mr-2" />
            お気に入り著者の管理
          </h2>
          
          {/* 著者追加フォーム */}
          <div className="mb-6">
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-noto-sans py-2 px-4 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                著者を追加
              </button>
            ) : (
              <form onSubmit={handleAddAuthor} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    placeholder="著者名を入力してください"
                    className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-noto-sans px-4 py-3 rounded-lg transition-colors"
                  >
                    追加
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewAuthorName('');
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-noto-sans px-4 py-3 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
            <div className="text-red-600 text-4xl mb-4">❌</div>
            <p className="text-red-600 font-noto-sans text-lg">{error}</p>
          </div>
        )}

        {/* ローディング */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d3436]"></div>
            <p className="text-[#5d6d7e] font-noto-sans mt-4">読み込み中...</p>
          </div>
        ) : (
          <>
            {/* お気に入り著者一覧 */}
            {favoriteAuthors.length === 0 ? (
              <div className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] p-12 text-center">
                <div className="text-[#5d6d7e] text-6xl mb-4">👤</div>
                <p className="text-[#5d6d7e] font-noto-sans text-lg mb-2">お気に入りの著者がまだ登録されていません</p>
                <p className="text-[#5d6d7e] font-noto-sans text-sm mb-6">
                  「著者を追加」ボタンから好きな著者を登録してみましょう
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-[#5d6d7e] font-noto-sans">
                    <span className="font-medium text-[#2d3436]">{favoriteAuthors.length}</span> 人の著者をフォロー中
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteAuthors.map((author) => (
                    <div
                      key={author.id}
                      className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] p-6 hover:shadow-lg transition-shadow group"
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-noto-sans text-lg font-semibold text-[#2d3436] mb-2">
                              {author.authorName}
                            </h3>
                            <div className="flex items-center text-sm text-[#5d6d7e] font-noto-sans">
                              <FontAwesomeIcon icon={faHeart} className="text-red-600 mr-2" />
                              フォロー中
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => unfollowAuthor(author.authorName)}
                          className="bg-red-600 hover:bg-red-700 text-white font-noto-sans py-2 px-4 rounded-lg transition-colors mt-auto"
                        >
                          フォロー解除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FavoriteAuthors;