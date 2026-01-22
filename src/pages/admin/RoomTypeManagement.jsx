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
      const res = await roomAPI.getRoomTypes();
      setRoomTypes(res.data || []);
    } catch {
      toast.error('Không tải được loại phòng');
    } finally {
      setLoading(false);
    }
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
      setFormData({ name: '', description: '', basePrice: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice)
      };

      if (editingType) {
        await adminAPI.updateRoomType(editingType.id, payload);
        toast.success('Đã cập nhật loại phòng');
      } else {
        await adminAPI.createRoomType(payload);
        toast.success('Đã thêm loại phòng');
      }

      setShowModal(false);
      fetchRoomTypes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa loại phòng này?')) return;
    await adminAPI.deleteRoomType(id);
    toast.success('Đã xóa');
    fetchRoomTypes();
  };

  return (
    <AdminLayout title="Quản Lý Loại Phòng">
      <button className="btn btn-primary" onClick={() => handleOpenModal()}>
        <FaPlus /> Thêm loại phòng
      </button>

      {loading ? (
        <div className="spinner" />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Mô tả</th>
              <th>Giá</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {roomTypes.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.name}</td>
                <td>{t.description || '-'}</td>
                <td>{t.basePrice.toLocaleString('vi-VN')} ₫</td>
                <td>
                  <FaEdit onClick={() => handleOpenModal(t)} />
                  <FaTrash onClick={() => handleDelete(t.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingType ? 'Sửa loại phòng' : 'Thêm loại phòng'}</h3>
            <form onSubmit={handleSubmit}>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <input type="number" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} required />
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <button type="submit">Lưu</button>
              <button type="button" onClick={() => setShowModal(false)}>Hủy</button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default RoomTypeManagement;
