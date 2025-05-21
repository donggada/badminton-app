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

export default api;

