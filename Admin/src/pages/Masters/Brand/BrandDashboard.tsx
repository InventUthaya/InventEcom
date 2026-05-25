import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonService from '../../../services/CommonService';
import Pagination from '../../CustomComponent/Pagination';
import { Pencil, Plus, X } from 'lucide-react';

interface Brand {
    Id: number;
    BrandName: string;
    Description: string;
    Created: string;
    Modified?: string;
    IsActive: number;
    DisplayInList: number;
    ImagePath?: string;
}

const BrandDashboard = () => {
    const navigate = useNavigate();

    const [brands, setBrands] = useState<Brand[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalBrandsCount, setTotalBrandsCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const pageSize = 10;

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [formData, setFormData] = useState({
        Id: 0,
        BrandName: '',
        Description: '',
        IsActive: 1,
        DisplayInList: 1,
        ImagePath: '',
        ImageBase64: '',
    });

    const fetchBrands = async (page = 1) => {
        setIsLoading(true);
        try {
            const res = await CommonService.post('BrandMaster', 'GetAll', {
                SearchText: '',
                OffsetStart: (page - 1) * pageSize + 1,
                RowsPerPage: pageSize,
            });

            if (res.status === 200 && Array.isArray(res.data)) {
                setBrands(res.data);
                setTotalBrandsCount(res.data[0]?.TotalCount || 0);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands(currentPage);
    }, [currentPage]);

    const filteredBrands = useMemo(() => {
        return brands.filter(
            (b) =>
                b.BrandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.Description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [brands, searchTerm]);

    const openCreateModal = () => {
        setIsEdit(false);
        setFormData({
            Id: 0,
            BrandName: '',
            Description: '',
            IsActive: 1,
            DisplayInList: 1,
            ImagePath: '',
            ImageBase64: '',
        });
        setShowModal(true);
    };

    const openEditModal = (row: Brand) => {
        setIsEdit(true);
        setFormData({
            Id: row.Id,
            BrandName: row.BrandName,
            Description: row.Description,
            IsActive: row.IsActive,
            DisplayInList: row.DisplayInList,
            ImagePath: row.ImagePath || '',
            ImageBase64: '',
        });
        setShowModal(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    ImageBase64: reader.result as string,
                    ImagePath: file.name
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        const data = {
            BrandName: formData.BrandName,
            Description: formData.Description,
            IsActive: formData.IsActive,
            DisplayInList: formData.DisplayInList,
            ImagePath: formData.ImagePath,
            ImageBase64: formData.ImageBase64,
            ...(isEdit && { Id: formData.Id }),
        };

        if (isEdit) {
            await CommonService.post('BrandMaster', 'Update', data);
        } else {
            await CommonService.post('BrandMaster', 'Create', data);
        }

        setShowModal(false);
        fetchBrands(currentPage);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Brand Dashboard</h2>

                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border rounded-md px-3 py-1 text-sm focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-1 bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700"
                    >
                        <Plus size={16} /> Create
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow border">
                    <table className="w-full table-fixed">
                        <thead className="bg-gray-100 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Description</th>
                                <th className="px-4 py-3 text-center">Active</th>
                                <th className="px-4 py-3 text-center whitespace-nowrap">Created</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredBrands.map((row) => (
                                <tr key={row.Id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-blue-600 text-xs font-medium">
                                        {row.BrandName}
                                    </td>

                                    <td className="px-4 py-3 text-xs">
                                        {row.Description}
                                    </td>

                                    <td className="px-4 py-3 text-sm text-center text-xs">
                                        {row.IsActive === 1 ? (
                                            <span className="text-green-600 text-xs">Active</span>
                                        ) : (
                                            <span className="text-red-500 text-xs">Inactive</span>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-sm text-center whitespace-nowrap">
                                        {new Date(row.Created).toLocaleDateString()}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => openEditModal(row)} className="text-gray-600 hover:text-blue-600">
                                            <Pencil size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Pagination
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        hasMore={currentPage * pageSize < totalBrandsCount}
                        totalRecords={totalBrandsCount}
                        pageSize={pageSize}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-96 rounded-lg shadow-lg p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">
                                {isEdit ? 'Edit Brand' : 'Create Brand'}
                            </h3>
                            <button onClick={() => setShowModal(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.BrandName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, BrandName: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    placeholder="Description"
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.Description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, Description: e.target.value })
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Brand Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full border rounded px-3 py-2 text-sm"
                                    onChange={handleImageChange}
                                />
                                {(formData.ImageBase64 || formData.ImagePath) && (
                                    <img
                                        src={formData.ImageBase64 || formData.ImagePath}
                                        alt="Preview"
                                        className="mt-2 h-16 w-16 object-cover rounded border"
                                    />
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">Active</span>
                                <input
                                    type="checkbox"
                                    checked={formData.IsActive === 1}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            IsActive: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">Display in List</span>
                                <input
                                    type="checkbox"
                                    checked={formData.DisplayInList === 1}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            DisplayInList: e.target.checked ? 1 : 0,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                className="px-4 py-1.5 border rounded text-gray-700 bg-gray-50 hover:bg-gray-100"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={handleSave}
                            >
                                {isEdit ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandDashboard;
