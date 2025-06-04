import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: '/api/v1',  // 프록시 설정에 맞게 수정
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 요청 인터셉터 (토큰 추가)
api.interceptors.request.use(
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

// 응답 인터셉터 (토큰 만료 처리)
api.interceptors.response.use(
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

// API 함수들
export const login = (loginId, password) => {
  console.info('🔑 Login attempt:', { loginId });
  return api.post('/auth/login', { loginId, password });
};

export const getWaitingList = (id) => 
  api.get(`/matching-room/${id}`).then(response => ({
    ...response.data,
    isManager: response.data.isManager || false
  }));

export const register = async (userData) => {
  try {
    const response = await api.post('/member', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMatchingRoomList = () => 
  api.get('/matching-room').then(response => response.data);

export const getMatchingRoom = async (roomId) => {
  try {
    const response = await api.get(`/matching-room/${roomId}`);
    console.log('매칭방 정보 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('매칭방 정보 가져오기 실패:', error);
    throw error;
  }
};

export const createMatchingRoom = async (roomName) => {
  try {
    console.log('Sending request with roomName:', roomName); // 디버깅용 로그
    const response = await api.post('/matching-room', {
      roomName: roomName
    });
    console.log('Create room response:', response.data); // 디버깅용 로그
    return response.data;
  } catch (error) {
    console.error('Error creating matching room:', error);
    throw error;
  }
};

export const deleteMember = async (password) => {
  try {
    const response = await api.delete('/member', {
      headers: {
        'Content-Type': 'application/json'
      },
      data: { password }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMemberProfile = async () => {
  try {
    const response = await api.get('/member', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMemberProfile = async (profileData) => {
  try {
    console.log('Updating member profile with data:', profileData); // 요청 데이터 로깅
    const response = await api.put('/member', profileData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Profile update response:', response.data); // 응답 데이터 로깅
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

export const joinMatchingRoomByEntryCode = async (entryCode) => {
  try {
    const response = await api.post(`/matching-room/entry/${entryCode}`);
    return response.data;
  } catch (error) {
    console.error('Failed to join matching room with entry code:', error);
    throw error;
  }
};

export const joinMatchingRoom = async (roomId) => {
  try {
    const response = await api.post(`/matching-room/${roomId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to join matching room:', error);
    throw error;
  }
};

export const updateMatchingStatus = (roomId, data) => 
  api.patch(`/matching-room/${roomId}/status`, data);

export const grantManagerRole = (roomId, memberId) => 
  api.patch(`/manager/rooms/${roomId}/managers/${memberId}`);

export const revokeManagerRole = (roomId, memberId) => 
  api.delete(`/manager/rooms/${roomId}/managers/${memberId}`);

export default api;

