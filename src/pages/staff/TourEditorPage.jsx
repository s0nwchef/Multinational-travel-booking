import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Save,
  Eye,
  Upload,
  Plus,
  Trash2,
  X,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import staffService from '../../services/staffService.js';

const TourEditorPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const [tourData, setTourData] = useState({
    title: "",
    description: "",
    destination: "",
    duration: 1,
    basePrice: 0,
    status: "draft",
    images: [],
    itinerary: [{ day: 1, title: "", description: "" }],
    inclusions: ["", ""],
    exclusions: ["", ""]
  });

  // Fetch existing tour data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchTourData(id);
    }
  }, [id, isEditMode]);

  const fetchTourData = async (tourId) => {
    try {
      setLoading(true);
      const response = await staffService.getTours({ search: tourId });
      const tour = response.tours?.find(t => t._id === tourId);
      
      if (tour) {
        setTourData({
          title: tour.title || "",
          description: tour.description || "",
          destination: tour.destinationId?.name || "",
          duration: tour.duration || 1,
          basePrice: tour.basePrice || 0,
          status: tour.status || "draft",
          images: tour.images || [],
          itinerary: tour.itinerary?.length > 0 
            ? tour.itinerary 
            : [{ day: 1, title: "", description: "" }],
          inclusions: tour.included?.length > 0 ? tour.included : ["", ""],
          exclusions: tour.excluded?.length > 0 ? tour.excluded : ["", ""]
        });
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tour:', err);
      setError('Không thể tải thông tin tour');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setTourData(prev => ({ ...prev, [field]: value }));
  };

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...tourData.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setTourData(prev => ({ ...prev, itinerary: newItinerary }));
  };

  const addItineraryDay = () => {
    setTourData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: "", description: "" }]
    }));
  };

  const removeItineraryDay = (index) => {
    const newItinerary = tourData.itinerary.filter((_, i) => i !== index);
    // Re-number days
    const renumberedItinerary = newItinerary.map((item, idx) => ({
      ...item,
      day: idx + 1
    }));
    setTourData(prev => ({ ...prev, itinerary: renumberedItinerary }));
  };

  const handleInclusionChange = (index, value) => {
    const newInclusions = [...tourData.inclusions];
    newInclusions[index] = value;
    setTourData(prev => ({ ...prev, inclusions: newInclusions }));
  };

  const addInclusion = () => {
    setTourData(prev => ({ ...prev, inclusions: [...prev.inclusions, ""] }));
  };

  const removeInclusion = (index) => {
    const newInclusions = tourData.inclusions.filter((_, i) => i !== index);
    setTourData(prev => ({ ...prev, inclusions: newInclusions }));
  };

  const handleExclusionChange = (index, value) => {
    const newExclusions = [...tourData.exclusions];
    newExclusions[index] = value;
    setTourData(prev => ({ ...prev, exclusions: newExclusions }));
  };

  const addExclusion = () => {
    setTourData(prev => ({ ...prev, exclusions: [...prev.exclusions, ""] }));
  };

  const removeExclusion = (index) => {
    const newExclusions = tourData.exclusions.filter((_, i) => i !== index);
    setTourData(prev => ({ ...prev, exclusions: newExclusions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare tour data for API
    const tourPayload = {
      title: tourData.title,
      description: tourData.description,
      duration: tourData.duration,
      basePrice: tourData.basePrice,
      status: tourData.status,
      images: tourData.images,
      itinerary: tourData.itinerary.filter(i => i.title || i.description),
      included: tourData.inclusions.filter(i => i.trim()),
      excluded: tourData.exclusions.filter(e => e.trim())
    };

    try {
      setSaving(true);
      
      if (isEditMode) {
        await staffService.updateTour(id, tourPayload);
        alert('Cập nhật tour thành công!');
      } else {
        await staffService.createTour(tourPayload);
        alert('Tạo tour thành công!');
      }
      
      navigate('/staff/tours');
    } catch (err) {
      console.error('Failed to save tour:', err);
      alert('Lưu tour thất bại: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/staff/tours');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/staff/tours')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Chỉnh sửa Tour' : 'Tạo Tour Mới'}
            </h1>
            <p className="text-gray-500 mt-2">
              {isEditMode ? 'Cập nhật thông tin tour hiện có' : 'Thiết kế và tạo tour du lịch mới'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
              previewMode 
                ? 'bg-orange-50 text-orange-600 border border-orange-200' 
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Eye className="w-4 h-4" />
            {previewMode ? 'Chỉnh sửa' : 'Xem trước'}
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white hover:bg-orange-600 rounded-xl font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            {isEditMode ? 'Cập nhật' : 'Tạo tour'}
          </button>
        </div>
      </div>

      {previewMode ? (
        // Preview Mode
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">{tourData.name || 'Tên tour'}</h2>
              <p className="text-gray-500 mt-2">{tourData.destination || 'Điểm đến'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Thời lượng</p>
                <p className="text-xl font-bold text-gray-900">{tourData.duration} ngày</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Giá</p>
                <p className="text-xl font-bold text-gray-900">${tourData.price}/người</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Trạng thái</p>
                <p className="text-xl font-bold text-gray-900 capitalize">{tourData.status}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mô tả</h3>
              <p className="text-gray-700 whitespace-pre-line">{tourData.description || 'Mô tả tour'}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch trình</h3>
              <div className="space-y-4">
                {tourData.itinerary.map((day, index) => (
                  <div key={index} className="border-l-4 border-orange-500 pl-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">Ngày {day.day}:</span>
                      <span className="font-semibold text-gray-900">{day.title || 'Tiêu đề ngày'}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{day.description || 'Mô tả hoạt động'}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bao gồm</h3>
                <ul className="space-y-2">
                  {tourData.inclusions.map((item, index) => (
                    item && (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {item}
                      </li>
                    )
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Không bao gồm</h3>
                <ul className="space-y-2">
                  {tourData.exclusions.map((item, index) => (
                    item && (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        {item}
                      </li>
                    )
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Edit Mode
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên tour *
                </label>
                <input
                  type="text"
                  value={tourData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
                  placeholder="Nhập tên tour"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điểm đến *
                </label>
                <input
                  type="text"
                  value={tourData.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
                  placeholder="Ví dụ: Đà Nẵng, Hội An"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời lượng (ngày) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={tourData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá (USD) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={tourData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả *
                </label>
                <textarea
                  value={tourData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
                  placeholder="Mô tả chi tiết về tour..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Itinerary */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Lịch trình</h3>
              <button
                type="button"
                onClick={addItineraryDay}
                className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Thêm ngày
              </button>
            </div>
            <div className="space-y-4">
              {tourData.itinerary.map((day, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900">Ngày {day.day}</span>
                    </div>
                    {tourData.itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItineraryDay(index)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề
                      </label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
                        placeholder="Ví dụ: Khám phá Hội An"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả
                      </label>
                      <textarea
                        value={day.description}
                        onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
                        placeholder="Mô tả hoạt động trong ngày..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inclusions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Bao gồm</h3>
                <button
                  type="button"
                  onClick={addInclusion}
                  className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Thêm mục
                </button>
              </div>
              <div className="space-y-3">
                {tourData.inclusions.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleInclusionChange(index, e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
                      placeholder="Ví dụ: Vé máy bay khứ hồi"
                    />
                    {tourData.inclusions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeInclusion(index)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Không bao gồm</h3>
                <button
                  type="button"
                  onClick={addExclusion}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Thêm mục
                </button>
              </div>
              <div className="space-y-3">
                {tourData.exclusions.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleExclusionChange(index, e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
                      placeholder="Ví dụ: Chi phí cá nhân"
                    />
                    {tourData.exclusions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeExclusion(index)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Trạng thái</h3>
            <div className="flex items-center gap-4">
              {['draft', 'active', 'archived'].map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={tourData.status === status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border-2 rounded-full flex items-center justify-center ${
                    tourData.status === status ? 'border-orange-500' : 'border-gray-300'
                  }`}>
                    {tourData.status === status && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium text-gray-900 capitalize">{status}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default TourEditorPage;