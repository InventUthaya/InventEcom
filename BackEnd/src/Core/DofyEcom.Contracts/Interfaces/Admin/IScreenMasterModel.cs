using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;

namespace DofyEcom.Contracts
{
    public interface IScreenMasterModel : IEntityModel<ScreenMaster>
    {
        public void CreateRolePermission(RolePermissionRequest request);

        Task<List<ScreenPermissionViewModel>> GetScreensWithPermissionsAsync();
    }
}