"use client";
import React from "react";
import axios from 'axios';
import '../assets/styles/styles.css'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBook, faUser, faBookOpen, faClock, faStar, faChevronRight, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";

function Menu() {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { icon: faSearch, text: "書籍を検索", link: "#" },
    { icon: faBook, text: "登録書籍一覧", link: "#" },
    { icon: faUser, text: "マイページ", link: "#" },
    { icon: faBookOpen, text: "現在読んでいる本", link: "#" },
    { icon: faClock, text: "読書履歴", link: "#" },
    { icon: faStar, text: "お気に入りの本", link: "#" },
  ];
  const handleLogout = () => {
    axios.post('http://localhost:8080/logout', {}, { withCredentials: true })
      .then(() => {
        window.location.href = '/login'; // ログインページにリダイレクト
      })
      .catch(error => {
        console.error("ログアウトに失敗しました", error);
      });
  };

  return (
    <div className="min-h-screen w-screen bg-[#f5f5f5] p-8 w-full">
      <div className="w-full mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-crimson-text text-[#333333] mb-2">
            📚 Libro Log
          </h1>
          <p className="text-[#666666] font-crimson-text">
            あなたの読書体験を記録・管理
          </p>
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
      {/* ログアウトボタン */}
      <div className="text-center mt-8">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white font-crimson-text py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          ログアウト
        </button>
      </div>
      </div>
    </div>
  );
}

export default Menu;
