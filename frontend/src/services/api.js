import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
 * Tự động lấy JWT trong localStorage
 * và gắn vào mọi request cần đăng nhập.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
 * Xử lý lỗi xác thực.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;

      const isAuthPage =
        currentPath.includes('/login') ||
        currentPath.includes('/register');

      /*
       * Không chuyển hướng khi đang ở trang đăng nhập
       * hoặc đăng ký để giao diện có thể hiện thông báo lỗi.
       */
      if (!isAuthPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

/* =========================
   AUTH API
========================= */

export const authAPI = {
  register: (data) => api.post('/auth/register', data),

  login: (data) => api.post('/auth/login', data),

  getProfile: () => api.get('/user/profile'),

  updateProfile: (data) =>
    api.put('/user/profile', data),
};

/* =========================
   ROOM API
========================= */

export const roomAPI = {
  getAll: () => api.get('/rooms'),

  getById: (id) =>
    api.get(`/rooms/${id}`),

  search: (params) =>
    api.get('/rooms/search', { params }),

  getRoomTypes: () =>
    api.get('/room-types'),
};

/* =========================
   BOOKING API
========================= */

export const bookingAPI = {
  create: (data) =>
    api.post('/bookings', data),

  getUserBookings: () =>
    api.get('/bookings'),

  getById: (id) =>
    api.get(`/bookings/${id}`),

  cancel: (id) =>
    api.post(`/bookings/${id}/cancel`),
};

/* =========================
   CONTACT API - KHÁCH HÀNG
========================= */

export const contactAPI = {
  /*
   * Khách hàng gửi liên hệ.
   * POST /api/contacts
   */
  send: (data) =>
    api.post('/contacts', data),

  /*
   * Lấy danh sách liên hệ và phản hồi
   * của tài khoản đang đăng nhập.
   * GET /api/contacts/my
   */
  getMyContacts: () =>
    api.get('/contacts/my'),

  /*
   * Đếm số phản hồi chưa đọc.
   * GET /api/contacts/unread-count
   */
  getUnreadCount: () =>
    api.get('/contacts/unread-count'),

  /*
   * Đánh dấu một phản hồi là đã đọc.
   * PUT /api/contacts/{id}/read
   */
  markAsRead: (id) =>
    api.put(`/contacts/${id}/read`),
};

/* =========================
   ADMIN API
========================= */

export const adminAPI = {
  /* ---------- Rooms ---------- */

  createRoom: (data) =>
    api.post('/admin/rooms', data),

  updateRoom: (id, data) =>
    api.put(`/admin/rooms/${id}`, data),

  updateRoomStatus: (id, status) =>
    api.put(`/admin/rooms/${id}/status`, {
      status,
    }),

  deleteRoom: (id) =>
    api.delete(`/admin/rooms/${id}`),

  /* ---------- Room Types ---------- */

  createRoomType: (data) =>
    api.post('/admin/room-types', data),

  updateRoomType: (id, data) =>
    api.put(`/admin/room-types/${id}`, data),

  deleteRoomType: (id) =>
    api.delete(`/admin/room-types/${id}`),

  /* ---------- Bookings ---------- */

  getAllBookings: () =>
    api.get('/admin/bookings'),

  updateBookingStatus: (id, status) =>
    api.put(`/admin/bookings/${id}/status`, {
      status,
    }),

  /* ---------- Statistics ---------- */

  getStatistics: () =>
    api.get('/admin/statistics'),

  /* ---------- Contacts ---------- */

  /*
   * Admin lấy toàn bộ liên hệ.
   * GET /api/admin/contacts
   */
  getAllContacts: () =>
    api.get('/admin/contacts'),

  /*
   * Admin xem chi tiết một liên hệ.
   * GET /api/admin/contacts/{id}
   */
  getContactById: (id) =>
    api.get(`/admin/contacts/${id}`),

  /*
   * Admin trả lời liên hệ.
   * PUT /api/admin/contacts/{id}/reply
   */
  replyContact: (id, reply) =>
    api.put(`/admin/contacts/${id}/reply`, {
      reply,
    }),
};

/* =========================
   UPLOAD API
========================= */

export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();

    formData.append('file', file);

    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteImage: (url) =>
    api.delete('/upload/image', {
      params: { url },
    }),
};

export default api;