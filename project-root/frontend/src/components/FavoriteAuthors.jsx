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

  // 著者を再フォロー
  const refollowAuthor = async (authorName) => {
    try {
      const token = getToken();
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/favoriteAuthors/refollow`, null, {
        params: { authorName },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        fetchFavoriteAuthors(); // リフレッシュ
      } else {
        setError(response.data.message || '再フォローに失敗しました');
      }
    } catch (error) {
      console.error('Error refollowing author:', error);
      setError('再フォローに失敗しました');
    }
  };

  // 著者を完全削除
  const deleteAuthor = async (authorName) => {
    if (!window.confirm(`「${authorName}」を完全に削除しますか？この操作は取り消せません。`)) {
      return;
    }

    try {
      const token = getToken();
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/favoriteAuthors/delete`, null, {
        params: { authorName },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        fetchFavoriteAuthors(); // リフレッシュ
      } else {
        setError(response.data.message || '削除に失敗しました');
      }
    } catch (error) {
      console.error('Error deleting author:', error);
      setError('削除に失敗しました');
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
            <p className="text-[#666666] font-crimson-text">
              あなたの読書体験を記録・管理
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-crimson-text py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            ログアウト
          </button>
        </header>

        <div className="mb-6">
          <h2 className="text-2xl font-crimson-text text-[#333333] mb-4">
            <FontAwesomeIcon icon={faHeart} className="text-red-500 mr-2" />
            お気に入り著者
          </h2>
          
          {/* 著者追加ボタン */}
          <div className="mb-4">
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                著者を追加
              </button>
            ) : (
              <form onSubmit={handleAddAuthor} className="flex gap-2">
                <input
                  type="text"
                  value={newAuthorName}
                  onChange={(e) => setNewAuthorName(e.target.value)}
                  placeholder="著者名を入力してください"
                  className="flex-1 rounded-md border border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  追加
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewAuthorName('');
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* ローディング */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : (
          <>
            {/* お気に入り著者一覧 */}
            {favoriteAuthors.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">お気に入りの著者がまだ登録されていません</p>
                <p className="text-gray-500 text-sm mt-2">
                  「著者を追加」ボタンから好きな著者を登録してみましょう
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteAuthors.map((author) => (
                  <div
                    key={author.id}
                    className={`p-4 rounded-lg border hover:shadow-md transition-shadow ${
                      author.isFollowing ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 mr-3">
                        <h3 className="font-medium text-gray-800 mb-1">
                          {author.authorName}
                        </h3>
                        <p className={`text-sm mb-2 ${
                          author.isFollowing ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {author.isFollowing ? 'フォロー中' : 'フォロー解除中'}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {author.isFollowing ? (
                          <button
                            onClick={() => unfollowAuthor(author.authorName)}
                            className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 transition-colors text-xs"
                          >
                            解除
                          </button>
                        ) : (
                          <button
                            onClick={() => refollowAuthor(author.authorName)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-xs"
                          >
                            再フォロー
                          </button>
                        )}
                        <button
                          onClick={() => deleteAuthor(author.authorName)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-xs"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* メニューに戻るボタン */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/menu')}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            メニューへ戻る
          </button>
        </div>
      </div>
    </div>
  );
}

export default FavoriteAuthors;