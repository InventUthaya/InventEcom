import React, { useEffect, useState } from 'react';
import CommonService from '../../services/CommonService';

const PageMeta = ({ title, description }: { title: string; description: string }) => (
  <head>
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
);

const Toaster = ({ message, type, onClose }: { message: string; type: string; onClose: () => void }) => (
  <div className={`p-4 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white rounded-md fixed top-4 right-4 z-50 shadow-lg`}>
    {message}
    <button onClick={onClose} className="ml-4 underline">Close</button>
  </div>
);

const Button = ({ variant, onClick, children, disabled }: {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md font-medium transition-colors ${variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
  >
    {children}
  </button>
);

const Loader = () => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
    </div>
  </div>
);

interface Role {
  Id: number;
  RoleName: string;
}

interface ScreenMasterData {
  Id: number;
  ScreenName: string;
}

interface ScreenAccessData {
  RoleId: number;
  ScreenId: string;
}

type ToastType = 'success' | 'error';

const ScreenAccessibility = () => {
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [screenMaster, setScreenMaster] = useState<ScreenMasterData[]>([]);
  const [screenAccess, setScreenAccess] = useState<ScreenAccessData[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedScreenIds, setSelectedScreenIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [rolesRes, screensRes, roleAccessRes] = await Promise.all([
          CommonService.get('rolemaster', 'rolelist', 'noParam'),
          CommonService.get('ScreenMaster', 'getall', 'noParam'),
          CommonService.get('Rolepermission', 'GetRoleList', 'noParam')
        ]);
        setRoleList(rolesRes.data || []);
        setScreenMaster(screensRes.data || []);
        setScreenAccess(roleAccessRes.data || []);
      } catch (err) {
        setToast({ msg: 'Failed to load data', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRoleSelect = (roleId: number) => {
    setSelectedRoleId(roleId);

    const permissionsForRole = screenAccess.filter(item => item.RoleId === roleId);

    let screenIds: number[] = [];

    if (permissionsForRole.length > 0) {
      permissionsForRole.forEach(perm => {
        if (perm.ScreenId) {
          const screenIdStr = String(perm.ScreenId).trim();

          if (screenIdStr && screenIdStr !== 'null' && screenIdStr !== 'undefined') {
            const idsFromThisRecord = screenIdStr
              .split(',')
              .map(id => parseInt(id.trim(), 10))
              .filter(id => !isNaN(id));

            screenIds.push(...idsFromThisRecord);
          }
        }
      });
    }

    const uniqueValidIds = Array.from(new Set(screenIds)).filter(id =>
      screenMaster.some(screen => screen.Id === id)
    );

    setSelectedScreenIds(new Set(uniqueValidIds));
  };

  const handleScreenToggle = (screenId: number) => {
    setSelectedScreenIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(screenId)) {
        newSet.delete(screenId);
      } else {
        newSet.add(screenId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    if (!selectedRoleId) {
      setToast({ msg: 'No role selected', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      // Get currently active screens for this role from backend data
      const currentActiveScreens: number[] = [];
      screenAccess
        .filter(item => item.RoleId === selectedRoleId)
        .forEach(item => {
          if (item.ScreenId) {
            const ids = String(item.ScreenId)
              .split(',')
              .map(id => parseInt(id.trim(), 10))
              .filter(id => !isNaN(id));
            currentActiveScreens.push(...ids);
          }
        });

      const previouslyActive = new Set(currentActiveScreens);
      const nowActive = selectedScreenIds;

      // Screens to activate (newly checked)
      const toActivate = [...nowActive].filter(id => !previouslyActive.has(id));

      // Screens to deactivate (unchecked)
      const toDeactivate = [...previouslyActive].filter(id => !nowActive.has(id));

      // Prepare payload: array of { ScreenId, IsActive }
      const updates = [
        ...toActivate.map(id => ({ ScreenId: id, IsActive: true })),
        ...toDeactivate.map(id => ({ ScreenId: id, IsActive: false }))
      ];

      if (updates.length === 0) {
        setToast({ msg: 'No changes to save', type: 'success' });
        setSaving(false);
        return;
      }

      const payload = {
        roleId: selectedRoleId,
        updates: updates
      };

      await CommonService.post('Rolepermission', 'RolepermissionCreate', payload);

      // Update local screenAccess state to reflect changes
      setScreenAccess(prev => {
        // Remove old entries for this role
        let filtered = prev.filter(item => item.RoleId !== selectedRoleId);

        // Add new consolidated entry (optional - depending on your backend response format)
        // Here we keep it as one entry with comma-separated active screens
        const activeIds = [...nowActive].join(',');
        if (activeIds) {
          filtered.push({ RoleId: selectedRoleId, ScreenId: activeIds });
        }

        return filtered;
      });

      setToast({ msg: 'Permissions saved successfully!', type: 'success' });
    } catch (err) {
      setToast({ msg: 'Failed to save permissions', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const selectedRole = roleList.find(r => r.Id == selectedRoleId);

  if (!selectedRoleId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageMeta title="Screen Accessibility" description="Manage screen access for roles" />
        {toast && <Toaster message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

        <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <h1 className="text-lg font-bold text-gray-900">Screen Accessibility</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-8 px-6">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Select a Role</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading roles...</div>
            ) : roleList.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No roles found</div>
            ) : (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roleList.map(role => (
                  <button
                    key={role.Id}
                    onClick={() => handleRoleSelect(role.Id)}
                    className="p-5 text-left bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500 rounded-lg transition-all"
                  >
                    <div className="font-medium text-gray-900">{role.RoleName}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageMeta title={`Permissions - ${selectedRole?.RoleName}`} description="Assign screens to role" />
      {toast && <Toaster message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {saving && <Loader />}

      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Permissions for <span className="text-blue-600">{selectedRole?.RoleName}</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Select Accessible Screens</h2>
            <p className="text-sm text-gray-600 mt-1">
              Checked screens will be accessible to this role.
            </p>
          </div>

          <div className="p-6">
            {screenMaster.length === 0 ? (
              <p className="text-gray-500 text-center">No screens available</p>
            ) : (
              <div className="space-y-3">
                {screenMaster.map(screen => (
                  <label
                    key={screen.Id}
                    className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedScreenIds.has(screen.Id)}
                      onChange={() => handleScreenToggle(screen.Id)}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-4 text-gray-800 font-medium">{screen.ScreenName}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
            <Button variant="secondary" onClick={() => {
              setSelectedRoleId(null);
              setSelectedScreenIds(new Set());
            }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Permissions'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenAccessibility;