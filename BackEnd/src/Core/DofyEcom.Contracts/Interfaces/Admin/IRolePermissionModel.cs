namespace DofyEcom.Contracts
{
    using DofyEcom.ViewEntities;
    using DofyEcom.ViewEntities.ViewModel;

    public interface IRolePermissionModel : IEntityModel<RolePermissionMapping>
    {
        IEnumerable<RolePermissionMapping> GetByRoleId(int RoleId);

        long CreateRolePermission(RolePermissionUpdateRequest request);


    }
}
