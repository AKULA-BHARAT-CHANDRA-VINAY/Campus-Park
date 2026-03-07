import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const api = {
  async login(regNo: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo, password })
      });
      const data = await response.json();
      return data;
    } catch (error) {

      if (regNo === 'ADMIN001' && password === 'admin123') {
        return {
          success: true,
          data: {
            token: 'demo-token-' + Date.now(),
            user: {
              id: '1',
              name: 'System Admin',
              regNo: 'ADMIN001',
              role: 'admin',
              department: 'Parking Management'
            }
          }
        };
      }
      return { success: false, message: 'Login failed' };
    }
  },

  // Dashboard Analytics
  async getDashboardStats(): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to fetch dashboard stats" };
    }
  },

  async createParkingArea(payload: any): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/admin/create-area`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to create area" };
    }
  },

  getParkingAreas: async () => {
    const response = await axios.get('/api/admin/areas');
    return response.data;
  },

  updateParkingArea: async (id: string, payload: any) => {
    const response = await axios.put(`/api/admin/update-area/${id}`, payload);
    return response.data;
  },

  deleteParkingArea: async (id: string) => {
    const response = await axios.delete(`/api/admin/delete-area/${id}`);
    return response.data;
  },


  // Users Management
  async getUsers(): Promise<ApiResponse<any[]>> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/user/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to fetch users" };
    }
  },
};