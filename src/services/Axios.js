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

export default api;

