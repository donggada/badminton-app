import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const getMatchingRoom = async (roomId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/matching-rooms/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching matching room:', error);
    throw error;
  }
}; 