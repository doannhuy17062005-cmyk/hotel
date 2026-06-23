import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { roomAPI, adminAPI, uploadAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImage, FaSpinner } from 'react-icons/fa';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomTypeId: '',
    description: '',
    price: '',
    capacity: 2,
    imageUrl: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roomsRes, typesRes] = await Promise.all([
        roomAPI.getAll(),
        roomAPI.getRoomTypes()
      ]);
      setRooms(roomsRes.data);
      setRoomTypes(typesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleOpenModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        roomNumber: room.roomNumber,
        roomTypeId: room.roomTypeId,
        description: room.description || '',
        price: room.price,
        capacity: room.capacity,
        imageUrl: room.imageUrl || ''
      });
      // Set preview for existing image
      if (room.imageUrl) {
        setImagePreview(room.imageUrl.startsWith('/uploads/') 
          ? `http://localhost:8080${room.imageUrl}` 
          : room.imageUrl);
      } else {
        setImagePreview('');
      }
    } else {
      setEditingRoom(null);
      setFormData({
        roomNumber: '',
        roomTypeId: roomTypes[0]?.id || '',
        description: '',
        price: '',
        capacity: 2,
        imageUrl: ''
      });
      setImagePreview('');
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif, webp)');
        return;
      }
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 10MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.imageUrl;
      
      // Upload new image if selected
      if (imageFile) {
        setUploading(true);
        const uploadRes = await uploadAPI.uploadImage(imageFile);
        imageUrl = uploadRes.data.imageUrl;
        setUploading(false);
      }
      
      const submitData = { ...formData, imageUrl };
      
      if (editingRoom) {
        await adminAPI.updateRoom(editingRoom.id, submitData);
        toast.success('Cập nhật phòng thành công');
      } else {
        await adminAPI.createRoom(submitData);
        toast.success('Thêm phòng thành công');
      }
      setShowModal(false);
      setImageFile(null);
      setImagePreview('');
      fetchData();
    } catch (error) {
      setUploading(false);
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa phòng này?')) return;
    try {
      await adminAPI.deleteRoom(id);
      toast.success('Xóa phòng thành công');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Xóa thất bại');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await adminAPI.updateRoomStatus(id, status);
      toast.success('Cập nhật trạng thái thành công');
      fetchData();
    } catch (error) {
      toast.error('Cập nhật thất bại');
    }
  };

  return (
    <AdminLayout title="Quản Lý Phòng">
      <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <FaPlus /> Thêm Phòng
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Số Phòng</th>
                <th>Loại Phòng</th>
                <th>Sức Chứa</th>
                <th>Giá</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.id}>
                  <td><strong>{room.roomNumber}</strong></td>
                  <td>{room.roomTypeName}</td>
                  <td>{room.capacity} người</td>
                  <td>{formatPrice(room.price)}</td>
                  <td>
                    <select
                      value={room.status}
                      onChange={(e) => handleStatusChange(room.id, e.target.value)}
                      className="form-select"
                      style={{ width: 'auto', padding: '4px 8px', fontSize: '0.85rem' }}
                    >
                      <option value="AVAILABLE">Còn phòng</option>
                      <option value="OCCUPIED">Đang sử dụng</option>
                      <option value="MAINTENANCE">Bảo trì</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <button onClick={() => handleOpenModal(room)} className="btn btn-ghost btn-sm">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(room.id)} className="btn btn-danger btn-sm">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingRoom ? 'Sửa Phòng' : 'Thêm Phòng Mới'}</h3>
              <button onClick={() => setShowModal(false)} className="modal-close">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Số Phòng *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Loại Phòng *</label>
                  <select
                    className="form-select"
                    value={formData.roomTypeId}
                    onChange={(e) => setFormData({ ...formData, roomTypeId: e.target.value })}
                    required
                  >
                    {roomTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                  <div className="form-group">
                    <label className="form-label">Giá (VNĐ) *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sức Chứa *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Mô Tả</label>
                  <textarea
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Hình Ảnh</label>
                  <div style={{ 
                    border: '2px dashed var(--border)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: 'var(--spacing-md)',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-secondary)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageChange}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                    {imagePreview ? (
                      <div>
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '200px', 
                            borderRadius: 'var(--radius-sm)',
                            marginBottom: 'var(--spacing-sm)'
                          }} 
                        />
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          Click để thay đổi ảnh
                        </p>
                      </div>
                    ) : (
                      <div style={{ padding: 'var(--spacing-lg)' }}>
                        <FaImage style={{ fontSize: '2rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }} />
                        <p style={{ color: 'var(--text-secondary)' }}>
                          Click hoặc kéo thả ảnh vào đây
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          Hỗ trợ: JPG, PNG, GIF, WebP (tối đa 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                  {uploading ? (
                    <>
                      <FaSpinner className="spinner" style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} />
                      Đang tải lên...
                    </>
                  ) : (
                    editingRoom ? 'Cập Nhật' : 'Thêm Mới'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default RoomManagement;
