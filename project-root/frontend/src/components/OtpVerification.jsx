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
    <div className="h-screen w-screen flex items-center justify-center bg-[#f4f1ee]">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 左側のロゴ部分 */}
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-[#e6eaeb]">
          <img
            src="/images/LibroLogIcon.jpg"
            alt="LibroLogアイコン"
            className="w-48 h-48 mb-4"
          />
          <h2 className="text-3xl font-crimson-text text-[#2d3436] mb-2">
            Libro Log
          </h2>
          <p className="text-[#505e61] font-noto-sans text-center">
            認証コードを確認してください
          </p>
        </div>

        {/* 右側のフォーム部分 */}
        <div className="flex-1 p-12">
          <h1 className="text-2xl font-noto-sans text-[#2d3436] mb-8">
            認証コード入力
          </h1>

          <div className="mb-6">
            <p className="text-sm text-[#505e61] font-noto-sans mb-2">
              以下のメールアドレスに認証コードを送信しました：
            </p>
            <p className="text-[#2d3436] font-noto-sans font-semibold break-all">
              {email}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-noto-sans text-[#505e61] mb-2">
                認証コード（6桁）
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                className="w-full px-4 py-3 border border-[#c8d1d3] rounded-lg focus:outline-none focus:border-[#2d3436] text-center text-2xl font-mono tracking-widest"
                maxLength={6}
                required
              />
            </div>

            {/* エラーメッセージ */}
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {errorMessage}
              </div>
            )}

            {/* 成功メッセージ */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-[#2d3436] text-white font-noto-sans py-3 px-4 rounded-lg hover:bg-[#1e2527] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '認証中...' : '認証する'}
            </button>
          </form>

          {/* 再送・戻るボタン */}
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading || resendCooldown > 0}
              className="w-full bg-[#4a90e2] text-white font-noto-sans py-2 px-4 rounded-lg hover:bg-[#357abd] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {resendLoading
                ? '再送中...'
                : resendCooldown > 0
                  ? `再送可能まで ${resendCooldown}秒`
                  : '認証コードを再送'}
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="w-full bg-gray-200 text-gray-700 font-noto-sans py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              登録画面に戻る
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#505e61] font-noto-sans">
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
