"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/styles/styles.css';

function OtpVerification() {
  // --- タイトル ---
  useEffect(() => {
    document.title = "認証コード入力 | Libro Log";
  }, []);
  // --- ここまで ---

  const location = useLocation();
  const navigate = useNavigate();

  // 前の画面から渡されたデータ
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // メールアドレスがない場合は登録画面にリダイレクト
  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  // 再送クールダウンタイマー
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // OTP検証処理
  const handleVerify = async (event) => {
    event.preventDefault();

    if (!otp.trim()) {
      setErrorMessage('認証コードを入力してください');
      return;
    }

    if (otp.length !== 6) {
      setErrorMessage('認証コードは6桁で入力してください');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/otp/verify-registration`,
        { email, otp },
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message);

        // 2秒後にログイン画面に自動遷移
        setTimeout(() => {
          navigate('/login', {
            state: {
              message: 'ユーザー登録が完了しました。ログインしてください。'
            }
          });
        }, 2000);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('認証処理でエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // OTP再送処理
  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setResendLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/otp/resend`,
        { email },
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setResendCooldown(60); // 60秒のクールダウン
        setOtp(''); // OTP入力欄をクリア
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error('OTP resend error:', error);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('認証コードの再送に失敗しました');
      }
    } finally {
      setResendLoading(false);
    }
  };

  // 戻る処理
  const handleBack = () => {
    navigate('/register');
  };

  // OTP入力フィールドの数字のみ制限
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#f4f1e8] p-8">
      <div className="max-w-4xl mx-auto">
        {/* 統一ヘッダー */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-noto-sans text-[#2d3436]">📚 Libro Log</h1>
            <p className="text-[#5d6d7e] font-noto-sans mt-1">認証コードを確認してください</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-600 hover:bg-gray-700 text-white font-noto-sans py-2 px-4 rounded-lg transition-colors"
            >
              登録画面に戻る
            </button>
          </div>
        </header>

        {/* メインコンテンツ */}
        <div className="bg-[#faf8f3] rounded-xl shadow-md border border-[#e8e2d4] p-8 max-w-md mx-auto">
          <h2 className="text-xl font-noto-sans text-[#2d3436] mb-6 text-center">
            認証コード入力
          </h2>

          <div className="mb-6">
            <p className="text-sm text-[#5d6d7e] font-noto-sans mb-2">
              以下のメールアドレスに認証コードを送信しました：
            </p>
            <p className="text-[#2d3436] font-noto-sans font-semibold break-all">
              {email}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-[#2d3436] font-noto-sans font-medium mb-2">
                認証コード（6桁）
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                className="w-full border border-[#c8d1d3] focus:border-[#2d3436] rounded-lg px-4 py-3 font-noto-sans outline-none transition-colors bg-white text-center text-2xl font-mono tracking-widest"
                maxLength={6}
                required
              />
              <p className="text-[#5d6d7e] font-noto-sans text-sm mt-1">
                6桁の数字を入力してください
              </p>
            </div>

            {/* エラーメッセージ */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <p className="text-red-600 font-noto-sans">{errorMessage}</p>
              </div>
            )}

            {/* 成功メッセージ */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <p className="text-green-600 font-noto-sans">{successMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-noto-sans py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '認証中...' : '認証する'}
            </button>
          </form>

          {/* 再送ボタン */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading || resendCooldown > 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-noto-sans py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {resendLoading
                ? '再送中...'
                : resendCooldown > 0
                  ? `再送可能まで ${resendCooldown}秒`
                  : '認証コードを再送'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#5d6d7e] font-noto-sans">
              認証コードの有効期限は10分間です。<br />
              受信されない場合は、迷惑メールフォルダをご確認ください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpVerification;
