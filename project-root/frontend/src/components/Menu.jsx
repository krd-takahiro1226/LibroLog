"use client";
import React from "react";
import axios from 'axios';
import '../assets/styles/styles.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBook, faUser, faBookOpen, faClock, faStar, faChevronRight, faSignOutAlt, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Menu() {

    // --- タイトル ---
  useEffect(() => {
    document.title = "メニュー | Libro Log";
  }, []);
  // --- ここまで ---


  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { icon: faSearch, text: "書籍を検索", link: "/searchBooks" },
    { icon: faBook, text: "登録書籍一覧", link: "/showRecords" },
    { icon: faUser, text: "マイページ", link: "/myPage" },
    { icon: faBookOpen, text: "読書目標設定", link: "/achievementsSettings" },
    { icon: faClock, text: "読書履歴", link: "/achievements" },
    { icon: faHeart, text: "お気に入り著者", link: "/favoriteAuthors" },
    { icon: faStar, text: "お気に入りの本", link: "#" },
  ];
  const handleLogout = () => {
      // トークンを削除
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
  };
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen bg-[#f5f5f5] p-8 w-full">
      <div className="w-full mx-auto">
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
        <nav className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="text-2xl text-[#4a90e2] w-12"
              />
              <span className="font-crimson-text text-lg text-[#333333] ml-4">
                {item.text}
              </span>
              <FontAwesomeIcon
                icon={faChevronRight}
                className="ml-auto text-[#999999]"
              />
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Menu;
