"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

function AuthorFollowButton({ authorName, size = "small" }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // トークンの取得
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // フォロー状態を確認
  const checkFollowStatus = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/favoriteAuthors/status`, {
        params: { authorName },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        setIsFollowing(response.data.isFollowing);
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  // フォロー/アンフォローの切り替え
  const toggleFollow = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        navigate('/login');
        return;
      }

      const endpoint = isFollowing ? `${process.env.REACT_APP_BACKEND_URL}/favoriteAuthors/unfollow` : `${process.env.REACT_APP_BACKEND_URL}/favoriteAuthors/follow`;
      
      const response = await axios.post(endpoint, null, {
        params: { authorName },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        setIsFollowing(!isFollowing);
      } else {
        console.error('Failed to toggle follow status:', response.data.message);
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // 初期状態の確認
  useEffect(() => {
    if (authorName) {
      checkFollowStatus();
    }
  }, [authorName]);

  // サイズに応じたスタイル
  const buttonClass = size === "large" 
    ? "px-4 py-2 text-sm rounded-md" 
    : "px-3 py-1 text-xs rounded";

  const heartClass = size === "large" ? "mr-2" : "mr-1";

  return (
    <button
      onClick={toggleFollow}
      disabled={loading || !authorName}
      className={`${buttonClass} transition-colors ${
        isFollowing 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <FontAwesomeIcon 
        icon={faHeart} 
        className={`${heartClass} ${isFollowing ? 'text-white' : 'text-gray-500'}`} 
      />
      {loading ? '処理中...' : (isFollowing ? 'フォロー中' : 'フォロー')}
    </button>
  );
}

export default AuthorFollowButton;