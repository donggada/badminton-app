import React, { useState, useEffect, useRef } from 'react';
import { 
  UserCircleIcon, 
  CalendarIcon, 
  ArrowLeftOnRectangleIcon,
  PencilIcon,
  ChevronDownIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { deleteMember, getMemberProfile, updateMemberProfile } from '../services/Axios';

function ProfileScreen({ onReturnClick, onLogout }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    name: '',
    level: ''
  });
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const levelOptions = [
    { value: 'MASTER', label: '준자강' },
    { value: 'GROUP_A', label: 'A조' },
    { value: 'GROUP_B', label: 'B조' },
    { value: 'GROUP_C', label: 'C조' },
    { value: 'GROUP_D', label: 'D조' },
    { value: 'BEGINNER', label: '초심' }
  ];

  const getLevelLabel = (levelValue) => {
    return levelOptions.find(option => option.value === levelValue)?.label || '초심';
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

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

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const data = await getMemberProfile();
      console.log('Fetched profile data:', data);
      setProfileData(data);
      setEditForm({
        name: data.name || '',
        level: data.level || 'BEGINNER'
      });
    } catch (err) {
      console.error('프로필 정보 가져오기 실패:', err);
      setError('프로필 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async () => {
    try {
      setIsEditing(true);
      setError(null);
      console.log('Sending profile update with data:', editForm);
      const updatedProfile = await updateMemberProfile(editForm);
      console.log('Received updated profile:', updatedProfile);
      
      setProfileData(prevData => ({
        ...prevData,
        name: editForm.name,
        level: editForm.level
      }));
      
      setShowEditModal(false);
    } catch (err) {
      console.error('프로필 수정 실패:', err);
      setError(err.response?.data?.message || '프로필 수정에 실패했습니다.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      await deleteMember(password);
      localStorage.removeItem('token');
      onLogout();
    } catch (err) {
      console.error('회원 탈퇴 실패:', err);
      setError(err.response?.data?.message || '회원 탈퇴에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchProfileData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">마이페이지</h1>
            <button
              onClick={onLogout}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 p-4 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* 프로필 카드 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">프로필 정보</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="로그아웃"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="프로필 수정"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 p-3 rounded-full">
                {profileData?.profileImage ? (
                  <img 
                    src={profileData.profileImage} 
                    alt="프로필" 
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="h-16 w-16 text-blue-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{profileData?.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {getLevelLabel(profileData?.level)}
                  </span>
                  {profileData?.email && (
                    <span className="text-sm text-gray-500">{profileData.email}</span>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>가입일: {new Date(profileData?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 버튼 그룹 */}
          <div className="space-y-3">
            {/* 뒤로가기 버튼 */}
            <button
              onClick={onReturnClick}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              뒤로가기
            </button>

            {/* 로그아웃 버튼 */}
            <button
              onClick={onLogout}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              로그아웃
            </button>

            {/* 회원 탈퇴 버튼 */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-red-50 text-red-600 py-3 px-4 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>

      {/* 프로필 수정 모달 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">프로필 수정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  레벨
                </label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className="block truncate">
                      {getLevelLabel(editForm.level)}
                    </span>
                    <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isLevelDropdownOpen ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {isLevelDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
                      {levelOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            setEditForm(prev => ({ ...prev, level: option.value }));
                            setIsLevelDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-blue-50 ${
                            editForm.level === option.value ? 'bg-blue-50' : ''
                          }`}
                        >
                          <span className="block truncate">{option.label}</span>
                          {editForm.level === option.value && (
                            <CheckIcon className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setError(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                취소
              </button>
              <button
                onClick={handleEditProfile}
                disabled={isEditing}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
              >
                {isEditing ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 회원 탈퇴 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">회원 탈퇴</h2>
            <p className="text-gray-600 mb-4">
              정말로 탈퇴하시겠습니까? 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setPassword('');
                  setError(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
              >
                {isDeleting ? '처리 중...' : '탈퇴하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileScreen;