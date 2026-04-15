import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobDetail, updateJobPost } from '../../services/api'; // Đường dẫn import chuẩn xác
import './EditJob.css';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary: '',
    location: '',
    status: 'dang_mo',
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobData = async () => {
      try {
        const data = await fetchJobDetail(id);
        // Đồng nhất với data Postman trả về: tieu_de, noi_dung, luong_theo_gio...
        setFormData({
          title: data.tieu_de || '',
          description: data.noi_dung || '',
          salary: data.luong_theo_gio ? Math.round(Number(data.luong_theo_gio)) : '',
          location: data.dia_diem_lam_viec || '',
          status: data.trang_thai || 'dang_mo',
        });
      } catch (err) {
        alert('Lỗi tải dữ liệu: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadJobData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateJobPost(id, formData);
      alert("Cập nhật thành công!");
      navigate(-1); // Trở về trang trước đó
    } catch (err) {
      alert("Lỗi khi cập nhật: " + err.message);
    }
  };

  if (loading) return <div className="edit-job-loading">Đang tải dữ liệu...</div>;

  return (
    <div className="edit-job-container">
      <div className="edit-job-header">
        <h2>Chỉnh sửa thông tin tuyển dụng</h2>
        <p>Mã tin: #{id}</p>
      </div>

      <form onSubmit={handleSubmit} className="edit-job-form">
        <div className="form-group">
          <label>Tiêu đề công việc <span className="required">*</span></label>
          <input 
            type="text" name="title" 
            value={formData.title} onChange={handleChange} required 
          />
        </div>

        <div className="form-group">
          <label>Mô tả chi tiết <span className="required">*</span></label>
          <textarea 
            name="description" rows="6"
            value={formData.description} onChange={handleChange} required 
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Mức lương theo giờ (VND)</label>
            <input 
              type="number" name="salary" 
              value={formData.salary} onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Địa điểm làm việc</label>
            <input 
              type="text" name="location" 
              value={formData.location} onChange={handleChange} 
            />
          </div>
        </div>

        <div className="form-group status-group">
          <label>Trạng thái tuyển dụng</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="dang_mo">Đang mở (Nhận hồ sơ)</option>
            <option value="da_dong">Đã đóng (Ngừng nhận)</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-cancel" onClick={() => navigate(-1)}>Hủy bỏ</button>
          <button type="submit" className="btn btn-save">Lưu thay đổi</button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;