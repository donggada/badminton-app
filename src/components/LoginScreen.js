import React, { useState } from 'react';
import { login } from '../services/Axios';
import badmintonCourtIcon from './assets/logo4.png';

const LoginScreen = ({ onLoginSuccess }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.info('🔑 로그인 시도:', { loginId });
      const response = await login(loginId, password);
      console.info('✅ 로그인 성공:', {
        status: response.status,
        data: response.data
      });
      
      const { token } = response.data;
      
      // 토큰을 localStorage에 저장
      localStorage.setItem('token', token);
      console.info('💾 토큰 저장 완료');
      
      // 로그인 성공 시 홈 화면으로 이동
      onLoginSuccess();
    } catch (err) {
      console.error('❌ 로그인 실패:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      if (err.response) {
        setError(err.response.data.message || '아이디 또는 비밀번호가 올바르지 않습니다.');
      } else if (err.request) {
        setError('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
      } else {
        setError('로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 로고 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-8">
        <div className="w-32 h-32 mb-8">
          <img src={badmintonCourtIcon} alt="NEXTCOCK" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">NEXTCOCK</h1>
        <p className="text-gray-600 text-center mb-12">
          배드민턴 매칭 앱에 오신 것을<br />환영합니다
        </p>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="아이디"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 추가 옵션 */}
        <div className="mt-8 space-y-4 w-full">
          <button className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            회원가입
          </button>
          <button className="w-full py-3 px-4 text-gray-600 hover:text-gray-800">
            비밀번호 찾기
          </button>
        </div>
      </div>

      {/* 하단 버전 정보 */}
      <div className="p-4 text-center text-gray-500 text-sm">
        Version 1.0.0
      </div>
    </div>
  );
};

export default LoginScreen; 