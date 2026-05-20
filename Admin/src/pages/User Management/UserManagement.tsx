import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, 
    Edit, 
    Filter, 
    ChevronUp, 
    ChevronDown, 
    Users, 
    UserCheck, 
    UserX,
    UserPlus
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import CommonService from '../../services/CommonService';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import Pagination from '../CustomComponent/Pagination'; // Import pagination component

const UserManagement = () => {
    const [activeTab, setActiveTab] = useState('riders');
    const [riders, setRiders] = useState([]);
    const [managementUsers, setManagementUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10); // Changed from 99999 to 10
    const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);
    const [filters, setFilters] = useState({
        name: '',
        phone: '',
        role: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [totalRecords, setTotalRecords] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        setError(null);
        
        try {
            // Build search text from all filters
            const searchText = [
                filters.name,
                filters.phone,
                activeTab === 'management' ? filters.role : ''
            ].filter(text => text !== '').join(' ') || null;

            const params = {
                RoleType: activeTab === 'riders' ? 'Rider' : 'Management',
                SearchText: searchText,
                Page: page,
                PageSize: usersPerPage,
                SortColumn: 'Created',
                SortOrder: 'DESC'
            };

            const res = await CommonService.post("rider-assignment", "GetUsersByRole", params);
            
            if (res.data && res.data.Users) {
                const transformedUsers = res.data.Users.map((user) => ({
                    id: user.UserID,
                    name: user.FullName,
                    phone: user.Phone,
                    email: user.Email,
                    role: user.RoleName,
                    status: user.Status,
                    type: activeTab
                }));
                
                // Set data based on active tab
                if (activeTab === 'riders') {
                    setRiders(transformedUsers);
                } else {
                    setManagementUsers(transformedUsers);
                }
                
                // Set pagination info
                const total = res.data.TotalRecords || 0;
                setTotalRecords(total);
                setCurrentPage(page);
                
                // Calculate if there are more pages
                const totalPages = Math.ceil(total / usersPerPage);
                setHasMore(page < totalPages);
            }
        } catch (e: any) {
            console.error("Error fetching users:", e.response ? e.response.data : e);
            setError(e.response?.data?.message || 'Failed to fetch users');
            
            // Clear data on error
            if (activeTab === 'riders') {
                setRiders([]);
            } else {
                setManagementUsers([]);
            }
            setTotalRecords(0);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when component mounts
    useEffect(() => {
        fetchUsers(1);
        if (location.state?.successMessage) {
            setSuccessMessage(location.state.successMessage);
            setTimeout(() => setSuccessMessage(null), 5000);
        }
    }, []); // Empty dependency array - runs only on mount

    // Fetch data when tab changes
    useEffect(() => {
        // Reset to page 1 when tab changes
        setCurrentPage(1);
        fetchUsers(1);
    }, [activeTab]);

    // Fetch data when page changes
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchUsers(page);
    };

    // Handle filter changes with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            // Reset to page 1 when filters change
            setCurrentPage(1);
            fetchUsers(1);
        }, 500); // 500ms debounce
        
        return () => clearTimeout(timer);
    }, [filters]);

    const handleEdit = (userId: number) => {
        navigate(`/user-management/edit/${userId}`);
    };

    const handleAddUser = () => {
        navigate('/user-management/add');
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        // Clear filters when switching tabs
        setFilters({
            name: '',
            phone: '',
            role: '',
        });
    };

    const handleFilterChange = (filterType: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: value,
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            name: '',
            phone: '',
            role: '',
        });
    };

    const getActiveFilterCount = () => {
        let count = 0;
        Object.values(filters).forEach((value) => {
            if (value !== '') count++;
        });
        return count;
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get current users based on active tab
    const currentUsers = activeTab === 'riders' ? riders : managementUsers;

    if (loading && currentUsers.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">Loading user management...</p>
                </div>
            </div>
        );
    }

    if (error && currentUsers.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <PageMeta title="User Management | SmartStore" description="Error loading users" />
                <PageBreadcrumb pageTitle="User Management" />
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <Users className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Users</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => fetchUsers(1)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PageMeta title="User Management | SmartStore" description="Manage riders and management users" />
            <PageBreadcrumb pageTitle="User Management" />

            {successMessage && (
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-600">{successMessage}</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:flex sm:items-center sm:space-x-4">
                            <button
                                onClick={handleAddUser}
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                            >
                                <UserPlus className="h-4 w-4 inline mr-2" />
                                Add User
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200">
                        <nav className="flex p-1 space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
                            <button
                                onClick={() => handleTabChange('riders')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                    activeTab === 'riders'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <UserCheck className="h-4 w-4 inline mr-2" />
                                Riders 
                            </button>
                            <button
                                onClick={() => handleTabChange('management')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                    activeTab === 'management'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Users className="h-4 w-4 inline mr-2" />
                                Management
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <h3 className="text-lg font-medium text-gray-700">Filters</h3>
                            {getActiveFilterCount() > 0 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {getActiveFilterCount()} active
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            {getActiveFilterCount() > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Clear all filters
                                </button>
                            )}
                            <button
                                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                aria-label={isFiltersExpanded ? "Collapse filters" : "Expand filters"}
                            >
                                {isFiltersExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {isFiltersExpanded && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={filters.name}
                                    onChange={(e) => handleFilterChange('name', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Filter by name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="text"
                                    value={filters.phone}
                                    onChange={(e) => handleFilterChange('phone', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Filter by phone"
                                />
                            </div>
                            {activeTab === 'management' && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                                    <input
                                        type="text"
                                        value={filters.role}
                                        onChange={(e) => handleFilterChange('role', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Filter by role"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Users Table */}
            <div className="max-w-7xl mx-auto pb-6 px-4 sm:px-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                        <div className="text-sm text-gray-500">
                            {/* Showing {currentUsers.length} of {totalRecords} {activeTab === 'riders' ? 'riders' : 'users'} */}
                            {getActiveFilterCount() > 0 && <span className="ml-2 text-blue-600">(filtered)</span>}
                        </div>
                    </div>

                    {/* Desktop Table */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading users...</p>
                        </div>
                    ) : (
                        <>
                            <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">Phone</th>
                                        {activeTab === 'management' && (
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">Email</th>
                                        )}
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">Role</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                        <span className="text-xs font-medium text-blue-600">
                                                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                                        </span>
                                                    </div>
                                                    <span>{user.name || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                                                {user.phone || 'N/A'}
                                            </td>
                                            {activeTab === 'management' && (
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                                                    {user.email || 'N/A'}
                                                </td>
                                            )}
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                                                {user.role || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm border-r border-gray-200">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                                                    {user.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(user.id)}
                                                        className="inline-flex items-center px-2 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                                    >
                                                        <Edit className="h-3.5 w-3.5 mr-2" />
                                                        Edit
                                                    </button>
                                                    {activeTab === 'management' && (
                                                        <button
                                                            className="inline-flex items-center px-2 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                                            onClick={() => console.log("Toggle status for user:", user.id)}
                                                        >
                                                            {user.status === 'Active' ? (
                                                                <UserX className="h-3.5 w-3.5" />
                                                            ) : (
                                                                <UserCheck className="h-3.5 w-3.5" />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Mobile Cards */}
                            <div className="sm:hidden space-y-4 p-4">
                                {currentUsers.map((user) => (
                                    <div key={user.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
                                        <div className="flex items-center mb-3">
                                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-xs font-medium text-blue-600">
                                                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-gray-500">Phone:</span>
                                                <p className="text-gray-900">{user.phone || 'N/A'}</p>
                                            </div>
                                            {activeTab === 'management' && (
                                                <div>
                                                    <span className="text-gray-500">Email:</span>
                                                    <p className="text-gray-900">{user.email || 'N/A'}</p>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-gray-500">Role:</span>
                                                <p className="text-gray-900">{user.role || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Status:</span>
                                                <p className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                                                    {user.status || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-2 mt-3">
                                            <button
                                                onClick={() => handleEdit(user.id)}
                                                className="inline-flex items-center px-2 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                            >
                                                <Edit className="h-3.5 w-3.5 mr-2" />
                                                Edit
                                            </button>
                                            {activeTab === 'management' && (
                                                <button
                                                    className="inline-flex items-center px-2 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                                    onClick={() => console.log("Toggle status for user:", user.id)}
                                                >
                                                    {user.status === 'Active' ? (
                                                        <UserX className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <UserCheck className="h-3.5 w-3.5" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Empty State */}
                    {!loading && currentUsers.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                {activeTab === 'riders' ? (
                                    <UserCheck className="h-8 w-8 text-gray-400" />
                                ) : (
                                    <Users className="h-8 w-8 text-gray-400" />
                                )}
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No {activeTab === 'riders' ? 'riders' : 'management users'} found
                            </h3>
                            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
                        </div>
                    )}

                    {/* Pagination Component */}
                    {currentUsers.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            hasMore={hasMore}
                            totalRecords={totalRecords}
                            pageSize={usersPerPage}
                            isLoading={loading}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserManagement;