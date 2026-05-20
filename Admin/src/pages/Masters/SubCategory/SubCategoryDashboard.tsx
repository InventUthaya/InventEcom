import { useEffect, useMemo, useState } from 'react';
import CommonService from '../../../services/CommonService';
import Pagination from '../../CustomComponent/Pagination';
import { Pencil, Plus, X } from 'lucide-react';

interface Menu {
    Id: number;
    CategoryName: string;
}

interface Subcategory {
    Id: number;
    CategoryMasterId: number;
    SubCategoryName: string;
    Description: string;
    Created: string;
    IsActive: number;
}

interface ItemSubcategory {
    Id: number;
    SubCategoryMasterId: number;
    ItemsCategoryName: string;
    Description: string;
    Created: string;
    IsActive: number;
}

const SubCategoryDashboard = () => {
    const [menu, setMenus] = useState<Menu[]>([]);
    const [subcategory, setSubcategory] = useState<Subcategory[]>([]);
    const [itemSubCategory, setItemSubcategory] = useState<ItemSubcategory[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrdersCount, setTotalOrdersCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState('');

    const pageSize = 10;

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [formData, setFormData] = useState({
        Id: 0,
        ItemsCategoryName: '',
        Description: '',
        SubCategoryMasterId: 0,
        IsActive: 1,
    });

    const fetchMenu = async () => {
        const res = await CommonService.get('CategoryMaster', 'GetAll', '');
        if (res.status === 200 && Array.isArray(res.data)) setMenus(res.data);
    };

    const fetchCategory = async () => {
        const res = await CommonService.get('Subcategory', 'GetAll', '');
        if (res.status === 200 && Array.isArray(res.data)) setSubcategory(res.data);
    };

    const fetchSubCategory = async (page = 1) => {
        setIsLoading(true);
        try {
            const res = await CommonService.post('itemssubcategory', 'GetList', {
                SearchText: '',
                OffsetStart: (page - 1) * pageSize + 1,
                RowsPerPage: pageSize,
            });

            if (res.status === 200 && Array.isArray(res.data)) {
                setItemSubcategory(res.data);
                setTotalOrdersCount(res.data[0]?.TotalCount || 0);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
        fetchCategory();
        fetchSubCategory(currentPage);
    }, [currentPage]);

    const filteredCategories = useMemo(() => {
        return subcategory.filter(s =>
            s.SubCategoryName.toLowerCase().includes(categorySearch.toLowerCase())
        );
    }, [subcategory, categorySearch]);

    const filteredMenu = useMemo(() => {
        return itemSubCategory.filter(
            (o) =>
                o.ItemsCategoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.Description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [itemSubCategory, searchTerm]);

    const openCreateModal = () => {
        setIsEdit(false);
        setFormData({
            Id: 0,
            ItemsCategoryName: '',
            Description: '',
            SubCategoryMasterId: 0,
            IsActive: 1,
        });
        setShowModal(true);
    };

    const openEditModal = (row: ItemSubcategory) => {
        setIsEdit(true);
        setFormData({
            Id: row.Id,
            ItemsCategoryName: row.ItemsCategoryName,
            Description: row.Description,
            SubCategoryMasterId: row.SubCategoryMasterId,
            IsActive: row.IsActive,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        const data = {
            ItemsCategoryName: formData.ItemsCategoryName,
            Description: formData.Description,
            SubCategoryMasterId: formData.SubCategoryMasterId,
            IsActive: formData.IsActive,
            ...(isEdit && { Id: formData.Id }),
        };

        if (isEdit) {
            await CommonService.post('itemssubcategory', 'Update', data);
        } else {
            await CommonService.post('itemssubcategory', 'Create', data);
        }

        setShowModal(false);
        fetchSubCategory(currentPage);
    };

    const getMenuName = (id: number) =>
        menu.find((m) => m.Id === id)?.CategoryName || '-';

    const getSubCategoryName = (id: number) =>
        subcategory.find((s) => s.Id === id)?.SubCategoryName || '-';

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold">SubCategory Dashboard</h2>

                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border rounded-md px-3 py-1 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-1 bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm"
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
                                <th className="px-4 py-3 text-left">Menu</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-center">Active</th>
                                <th className="px-4 py-3 text-center">Created</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredMenu.map((row) => (
                                <tr key={row.Id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 text-blue-600 text-xs">
                                        {row.ItemsCategoryName}
                                    </td>
                                    <td className="px-4 py-3 text-xs">{row.Description}</td>
                                    <td className="px-4 py-3 text-xs">
                                        {getMenuName(
                                            subcategory.find(s => s.Id === row.SubCategoryMasterId)?.CategoryMasterId || 0
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-xs">
                                        {getSubCategoryName(row.SubCategoryMasterId)}
                                    </td>
                                    <td className="px-4 py- text-green-600 text-center text-xs">
                                        {row.IsActive === 1 ? 'Active' : 'Inactive'}
                                    </td>
                                    <td className="px-4 py-3 text-center text-xs">
                                        {new Date(row.Created).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-center text-xs">
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
                    <div className="bg-white w-96 rounded-lg p-5">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-semibold">
                                {isEdit ? 'Edit Sub Category' : 'Create Sub Category'}
                            </h3>
                            <button onClick={() => setShowModal(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category Name</label>
                                <input
                                    type="text"
                                    placeholder="Sub Category Name"
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.ItemsCategoryName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, ItemsCategoryName: e.target.value })
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

                            {/* CATEGORY DROPDOWN */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <div className="relative">
                                    <div
                                        className="w-full border rounded px-3 py-2 cursor-pointer bg-white flex justify-between items-center"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <span className={formData.SubCategoryMasterId === 0 ? 'text-gray-400' : ''}>
                                            {formData.SubCategoryMasterId === 0
                                                ? 'Select Category'
                                                : subcategory.find(s => s.Id === formData.SubCategoryMasterId)?.SubCategoryName}
                                        </span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>

                                    {isDropdownOpen && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                            <div className="p-2 border-b">
                                                <input
                                                    type="text"
                                                    placeholder="Search category..."
                                                    className="w-full px-3 py-1.5 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={categorySearch}
                                                    onChange={(e) => setCategorySearch(e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                            <div className="max-h-40 overflow-y-auto">
                                                {filteredCategories.length === 0 ? (
                                                    <div className="px-3 py-2 text-sm text-gray-500">No results found</div>
                                                ) : (
                                                    filteredCategories.map((s) => (
                                                        <div
                                                            key={s.Id}
                                                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm transition-colors"
                                                            onClick={() => {
                                                                setFormData({
                                                                    ...formData,
                                                                    SubCategoryMasterId: s.Id,
                                                                });
                                                                setIsDropdownOpen(false);
                                                                setCategorySearch('');
                                                            }}
                                                        >
                                                            {s.SubCategoryName}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
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

export default SubCategoryDashboard;
