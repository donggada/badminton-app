import React, { useState, useRef, useEffect } from 'react';
import { register } from '../services/Axios';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import badmintonCourtIcon from '../assets/logo4.png';

const RegisterScreen = ({ onRegisterSuccess, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    username: '',
    phoneNumber: '',
    level: 'BEGINNER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const levelOptions = [
    { value: 'MASTER', label: '준자강' },
    { value: 'GROUP_A', label: 'A조' },
    { value: 'GROUP_B', label: 'B조' },
    { value: 'GROUP_C', label: 'C조' },
    { value: 'GROUP_D', label: 'D조' },
    { value: 'BEGINNER', label: '초심' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLevelDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getLevelLabel = (level) => {
    return levelOptions.find(option => option.value === level)?.label || '초심';
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^(\+82-?)?(010|011|016|017|018|019)-?\d{3,4}-?\d{4}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    if (formData.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      setError('올바른 전화번호 형식이 아닙니다.');
      return;
    }

    setLoading(true);

    try {
      const response = await register(formData);
      if (response) {
        onRegisterSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
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
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">회원가입</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="loginId" className="block text-sm font-medium text-gray-700 mb-1">
                아이디
              </label>
              <input
                type="text"
                id="loginId"
                name="loginId"
                value={formData.loginId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="아이디를 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="비밀번호를 입력하세요 (8자 이상)"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="이름을 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                전화번호
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="010-0000-0000"
              />
              <p className="text-xs text-gray-500 mt-1">
                예시: 010-0000-0000, 01000000000
              </p>
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                급수
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="block truncate">
                    {getLevelLabel(formData.level)}
                  </span>
                  <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isLevelDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {isLevelDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                    {levelOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, level: option.value }));
                          setIsLevelDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                          formData.level === option.value ? 'bg-blue-50' : ''
                        }`}
                      >
                        <span className="block truncate">{option.label}</span>
                        {formData.level === option.value && (
                          <CheckIcon className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
              {loading ? '처리중...' : '회원가입'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={onBackToLogin}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              이미 계정이 있으신가요? 로그인하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen; 