import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { roomAPI, adminAPI, uploadAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImage, FaSpinner } from 'react-icons/fa';
import { BACKEND_BASE_URL } from '../../services/config';

const normalizeArray = (data, keys = []) => {
  if (Array.isArray(data)) return data;
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
};

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

  const safeRooms = Array.isArray(rooms) ? rooms : [];
  const safeRoomTypes = Array.isArray(roomTypes) ? roomTypes : [];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roomsRes, typesRes] = await Promise.all([
        roomAPI.getAll(),
        roomAPI.getRoomTypes()
      ]);

      setRooms(normalizeArray(roomsRes.data, ['data', 'rooms']));
      setRoomTypes(normalizeArray(typesRes.data, ['data', 'roomTypes']));
    } catch (error) {
      console.error('Error fetching data:', error);
      setRooms([]);
      setRoomTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);

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

      if (room.imageUrl) {
        setImagePreview(
          room.imageUrl.startsWith('/uploads/')
            ? `${BACKEND_BASE_URL}${room.imageUrl}`
            : room.imageUrl
        );
      }
    } else {
      setEditingRoom(null);
      setFormData({
        roomNumber: '',
        roomTypeId: safeRoomTypes[0]?.id || '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.imageUrl;

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
      fetchData();
    } catch (error) {
      setUploading(false);
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    }
  };

  return (
    <AdminLayout title="Quản Lý Phòng">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <FaPlus /> Thêm Phòng
        </button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Số Phòng</th>
              <th>Loại</th>
              <th>Sức Chứa</th>
              <th>Giá</th>
              <th>Trạng Thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {safeRooms.map(room => (
              <tr key={room.id}>
                <td>{room.roomNumber}</td>
                <td>{room.roomTypeName}</td>
                <td>{room.capacity}</td>
                <td>{formatPrice(room.price)}</td>
                <td>{room.status}</td>
                <td>
                  <button onClick={() => handleOpenModal(room)}><FaEdit /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
};

export default RoomManagement;
