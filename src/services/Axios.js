import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// ===== Axios 인스턴스 설정 =====
const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ===== 인터셉터 설정 =====
// 요청 인터셉터
axiosInstance.interceptors.request.use(
  config => {
    console.info('🚀 API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  response => {
    console.info('✅ API Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  error => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== 인증 관련 API =====
export const login = (loginId, password) => {
  console.info('🔑 Login attempt:', { loginId });
  return axiosInstance.post('/api/v1/auth/login', { loginId, password });
};

// ===== 회원 관련 API =====
export const register = async (userData) => {
  try {
    const response = await axiosInstance.post('/api/v1/member', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMemberProfile = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/member');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMemberProfile = async (profileData) => {
  try {
    console.log('Updating member profile with data:', profileData);
    const response = await axiosInstance.put('/api/v1/member', profileData);
    console.log('Profile update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Profile update error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

export const deleteMember = async (password) => {
  try {
    const response = await axiosInstance.delete('/api/v1member', {
      data: { password }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ===== 매칭룸 관련 API =====
export const getMatchingRoomList = () => axiosInstance.get('/api/v1/matching/room/list');

export const getMatchingRoom = (roomId) => axiosInstance.get(`/api/v1/matching/room/${roomId}`);

export const createMatchingRoom = (data) => axiosInstance.post('/api/v1/matching/room', data);

export const joinMatchingRoom = async (roomId) => {
  try {
    const response = await axiosInstance.post(`/api/v1/matching-room/${roomId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to join matching room:', error);
    throw error;
  }
};

export const joinMatchingRoomByEntryCode = async (entryCode) => {
  try {
    const response = await axiosInstance.post(`/api/v1/matching-room/entry/${entryCode}`);
    return response.data;
  } catch (error) {
    console.error('Failed to join matching room with entry code:', error);
    throw error;
  }
};

export const updateMatchingStatus = (roomId, data) => axiosInstance.put(`/api/v1/matching-room/${roomId}/status`, data);

// ===== 매니저 관련 API =====
export const grantManagerRole = (roomId, memberId) => axiosInstance.post(`/api/v1/manager/${roomId}/manager/${memberId}`);

export const revokeManagerRole = (roomId, memberId) => axiosInstance.delete(`/api/v1/matching/room/${roomId}/manager/${memberId}`);

// ===== 매칭 관련 API =====
export const startMatching = (roomId, type) => axiosInstance.post(`/api/v1/matching/room/${roomId}/start`, { type });

export const startCustomMatching = (roomId, players) => axiosInstance.post(`/api/v1/matching/room/${roomId}/custom`, { players });

export const replaceGroupMember = (roomId, groupId, targetMemberId, replacementMemberId) => 
  axiosInstance.put(`/api/v1/matching/room/${roomId}/group/${groupId}/member`, { targetMemberId, replacementMemberId });

export const updateAllGroupsStatus = (roomId, status, groupId) => 
  axiosInstance.put(`/api/v1matching/room/${roomId}/groups/status`, { status, groupId });

export default axiosInstance;

