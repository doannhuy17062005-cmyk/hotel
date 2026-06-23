import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { roomAPI, adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const RoomTypeManagement = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: ''
  });

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const response = await roomAPI.getRoomTypes();
      setRoomTypes(response.data);
    } catch (error) {
      console.error('Error fetching room types:', error);
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

  const handleOpenModal = (type = null) => {
    if (type) {
      setEditingType(type);
      setFormData({
        name: type.name,
        description: type.description || '',
        basePrice: type.basePrice
      });
    } else {
      setEditingType(null);
      setFormData({
        name: '',
        description: '',
        basePrice: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingType) {
        await adminAPI.updateRoomType(editingType.id, formData);
        toast.success('Cập nhật loại phòng thành công');
      } else {
        await adminAPI.createRoomType(formData);
        toast.success('Thêm loại phòng thành công');
      }
      setShowModal(false);
      fetchRoomTypes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa loại phòng này?')) return;
    try {
      await adminAPI.deleteRoomType(id);
      toast.success('Xóa loại phòng thành công');
      fetchRoomTypes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Xóa thất bại');
    }
  };

  return (
    <AdminLayout title="Quản Lý Loại Phòng">
      <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <FaPlus /> Thêm Loại Phòng
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
                <th>ID</th>
                <th>Tên Loại Phòng</th>
                <th>Mô Tả</th>
                <th>Giá Cơ Bản</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.map(type => (
                <tr key={type.id}>
                  <td>{type.id}</td>
                  <td><strong>{type.name}</strong></td>
                  <td style={{ maxWidth: '300px' }}>{type.description || '-'}</td>
                  <td>{formatPrice(type.basePrice)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <button onClick={() => handleOpenModal(type)} className="btn btn-ghost btn-sm">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(type.id)} className="btn btn-danger btn-sm">
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
              <h3 className="modal-title">{editingType ? 'Sửa Loại Phòng' : 'Thêm Loại Phòng Mới'}</h3>
              <button onClick={() => setShowModal(false)} className="modal-close">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Tên Loại Phòng *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Giá Cơ Bản (VNĐ) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mô Tả</label>
                  <textarea
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingType ? 'Cập Nhật' : 'Thêm Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default RoomTypeManagement;
