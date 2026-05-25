import { useEffect, useMemo, useState } from 'react';
import CommonService from '../../../services/CommonService';
import Pagination from '../../CustomComponent/Pagination';
import { Pencil, Plus, X } from 'lucide-react';
import useDebounce from '../../../hooks/useDebounce';

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

const CategoryDashboard = () => {
    const [menu, setMenus] = useState<Menu[]>([]);
    const [subcategory, setSubcategory] = useState<Subcategory[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrdersCount, setTotalOrdersCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showMenuDropdown, setShowMenuDropdown] = useState(false);
    const [menuSearch, setMenuSearch] = useState('');

    const pageSize = 10;
    const debouncedSearch = useDebounce(searchTerm, 500);

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [formData, setFormData] = useState({
        Id: 0,
        SubCategoryName: '',
        Description: '',
        CategoryMasterId: 0,
        IsActive: 1,
    });

    /* ================= FETCH MENU ================= */
    const fetchMenu = async () => {
        setIsLoading(true);
        try {
            const res = await CommonService.get('CategoryMaster', 'GetAll', '');
            if (res.status === 200 && Array.isArray(res.data)) {
                setMenus(res.data);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategory = async (page = 1, search = '') => {
        setIsLoading(true);
        try {
            const res = await CommonService.post('Subcategory', 'GetList', {
                SearchText: search,
                OffsetStart: (page - 1) * pageSize + 1,
                RowsPerPage: pageSize,
            });

            if (res.status === 200 && Array.isArray(res.data)) {
                setSubcategory(res.data);
                setTotalOrdersCount(res.data[0]?.TotalCount || 0);
            } else {
                setSubcategory([]);
                setTotalOrdersCount(0);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    useEffect(() => {
        fetchCategory(currentPage, debouncedSearch);
    }, [currentPage, debouncedSearch]);

    const filteredMenu = useMemo(() => {
        return subcategory.filter((o) => {
            const matchesSearch = o.SubCategoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  (o.Description && o.Description.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const m = menu.find(x => x.Id === o.CategoryMasterId);
            const menuName = m ? m.CategoryName : '';
            const matchesMenu = menuName.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesSearch || matchesMenu;
        });
    }, [subcategory, searchTerm, menu]);

    const openCreateModal = () => {
        setIsEdit(false);
        setFormData({
            Id: 0,
            SubCategoryName: '',
            Description: '',
            CategoryMasterId: 0,
            IsActive: 1,
        });
        setShowModal(true);
    };

    const openEditModal = (row: Subcategory) => {
        setIsEdit(true);
        setFormData({
            Id: row.Id,
            SubCategoryName: row.SubCategoryName,
            Description: row.Description,
            CategoryMasterId: row.CategoryMasterId,
            IsActive: row.IsActive,
        });
        setShowModal(true);
    };

    /* ================= SAVE ================= */
    const handleSave = async () => {
        const data = {
            SubCategoryName: formData.SubCategoryName,
            Description: formData.Description,
            CategoryMasterId: formData.CategoryMasterId,
            IsActive: formData.IsActive,
            ...(isEdit && { Id: formData.Id }),
        };

        if (isEdit) {
            await CommonService.post('Subcategory', 'Update', data);
        } else {
            await CommonService.post('Subcategory', 'Create', data);
        }

        setShowModal(false);
        fetchCategory(currentPage);
    };

    const getMenuName = (id: number) =>
        menu.find((m) => m.Id === id)?.CategoryName || '-';

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Category Dashboard</h2>

                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border rounded-md px-3 py-1 text-sm"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />

                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-1 bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm"
                    >
                        <Plus size={16} /> Create
                    </button>
                </div>
            </div>

            {/* ================= TABLE ================= */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow border">
                    <table className="w-full table-fixed">
                        <thead className="bg-gray-100 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs">Name</th>
                                <th className="px-4 py-3 text-left text-xs">Description</th>
                                <th className="px-4 py-3 text-left text-xs">Menu</th>
                                <th className="px-4 py-3 text-center text-xs">Active</th>
                                <th className="px-4 py-3 text-center text-xs">Created</th>
                                <th className="px-4 py-3 text-center text-xs">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredMenu.map((row) => (
                                <tr key={row.Id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 text-blue-600 text-xs">
                                        {row.SubCategoryName}
                                    </td>
                                    <td className="px-4 py-3 text-xs">{row.Description}</td>
                                    <td className="px-4 py-3 text-xs">
                                        {getMenuName(row.CategoryMasterId)}
                                    </td>
                                    <td className="px-4 py-3 text-center text-xs">
                                        {row.IsActive === 1 ? (
                                            <span className="text-green-600">Active</span>
                                        ) : (
                                            <span className="text-red-500">Inactive</span>
                                        )}
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
                                {isEdit ? 'Edit Category' : 'Create Category'}
                            </h3>
                            <button onClick={() => setShowModal(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                <input
                                    type="text"
                                    placeholder="Category Name"
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.SubCategoryName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, SubCategoryName: e.target.value })
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Menu</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Select Menu"
                                        className="w-full border rounded px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={
                                            menu.find(m => m.Id === formData.CategoryMasterId)?.CategoryName || ''
                                        }
                                        readOnly
                                        onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                                    />

                                    {showMenuDropdown && (
                                        <div className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow">
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                className="w-full border-b px-3 py-2 text-sm outline-none"
                                                onChange={(e) => setMenuSearch(e.target.value)}
                                                autoFocus
                                            />

                                            {menu
                                                .filter(m =>
                                                    m.CategoryName.toLowerCase().includes(menuSearch.toLowerCase())
                                                )
                                                .map((m) => (
                                                    <div
                                                        key={m.Id}
                                                        className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50"
                                                        onClick={() => {
                                                            setFormData({
                                                                ...formData,
                                                                CategoryMasterId: m.Id,
                                                            });
                                                            setShowMenuDropdown(false);
                                                            setMenuSearch('');
                                                        }}
                                                    >
                                                        {m.CategoryName}
                                                    </div>
                                                ))}

                                            {menu.filter(m =>
                                                m.CategoryName.toLowerCase().includes(menuSearch.toLowerCase())
                                            ).length === 0 && (
                                                    <div className="px-3 py-2 text-sm text-gray-400">
                                                        No results found
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span>Active</span>
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

export default CategoryDashboard;
