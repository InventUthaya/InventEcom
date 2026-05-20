namespace DofyEcom.ViewEntities
{
    public class PermissionMaster : EntityBase
    {
        public string PermissionName { get; set; }

        public string PermissionCode { get; set; }

        public bool DisplayInList { get; set; }
        public int? PartnerId { get; set; }

        public ICollection<RolePermissionMapping> RolePermissions { get; set; }
    }
}