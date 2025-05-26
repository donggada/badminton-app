import React, { useState } from 'react';
import { login } from '../services/Axios';
import badmintonCourtIcon from './assets/logo4.png';

const LoginScreen = ({ onLoginSuccess, onRegisterClick }) => {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-start mb-8">
          <div className="-m-2">
            <img src={badmintonCourtIcon} alt="NEXTCOCK" className="h-36 w-36 object-contain" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">로그인</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-400"
            >
              {loading ? '처리중...' : '로그인'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={onRegisterClick}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              계정이 없으신가요? 회원가입하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen; 