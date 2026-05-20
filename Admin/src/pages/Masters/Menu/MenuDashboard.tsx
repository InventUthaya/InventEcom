import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonService from '../../../services/CommonService';
import Pagination from '../../CustomComponent/Pagination';
import { Pencil, Plus, X } from 'lucide-react';

interface Orders {
    Id: number;
    CategoryName: string;
    Description: string;
    Created: string;
    Modified: string;
    IsActive: number;
    ImagePath?: string;
}

const MenuDashBoard = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState<Orders[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrdersCount, setTotalOrdersCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const pageSize = 10;

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [formData, setFormData] = useState({
        Id: 0,
        CategoryName: '',
        Description: '',
        IsActive: 1,
        ImagePath: '',
        ImageBase64: '',
    });

    const fetchOrders = async (page = 1) => {
        setIsLoading(true);
        try {
            const res = await CommonService.post('CategoryMaster', 'GetAll', {
                SearchText: '',
                OffsetStart: (page - 1) * pageSize + 1,
                RowsPerPage: pageSize,
            });

            if (res.status === 200 && Array.isArray(res.data)) {
                setOrders(res.data);
                setTotalOrdersCount(res.data[0]?.TotalCount || 0);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    const filteredMenu = useMemo(() => {
        return orders.filter(
            (o) =>
                o.CategoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.Description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orders, searchTerm]);

    const openCreateModal = () => {
        setIsEdit(false);
        setFormData({
            Id: 0,
            CategoryName: '',
            Description: '',
            IsActive: 1,
            ImagePath: '',
            ImageBase64: '',
        });
        setShowModal(true);
    };

    const openEditModal = (row: Orders) => {
        setIsEdit(true);
        setFormData({
            Id: row.Id,
            CategoryName: row.CategoryName,
            Description: row.Description,
            IsActive: row.IsActive,
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
            CategoryName: formData.CategoryName,
            Description: formData.Description,
            IsActive: formData.IsActive,
            ImagePath: formData.ImagePath,
            ImageBase64: formData.ImageBase64,
            ...(isEdit && { Id: formData.Id }),
        };

        if (isEdit) {
            await CommonService.post('CategoryMaster', 'Update', data);
        } else {
            await CommonService.post('CategoryMaster', 'Create', data);
        }

        setShowModal(false);
        fetchOrders(currentPage);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Menu Dashboard</h2>

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

                                {/* FIX */}
                                <th className="px-4 py-3 text-center">Active</th>

                                {/* FIX */}
                                <th className="px-4 py-3 text-center whitespace-nowrap">Created</th>

                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>


                        <tbody>
                            {filteredMenu.map((row) => (
                                <tr key={row.Id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-blue-600 text-xs">
                                        {row.CategoryName}
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
                                        <button onClick={() => openEditModal(row)}>
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
                        hasMore={currentPage * pageSize < totalOrdersCount}
                        totalRecords={totalOrdersCount}
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
                                {isEdit ? 'Edit Menu' : 'Create Menu'}
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
                                    value={formData.CategoryName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, CategoryName: e.target.value })
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
                                <label className="text-sm font-medium text-gray-700">Category Image</label>
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
                                <span className="text-sm">Active</span>
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
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                className="px-4 py-1.5 border rounded"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-1.5 bg-blue-600 text-white rounded"
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

export default MenuDashBoard;
