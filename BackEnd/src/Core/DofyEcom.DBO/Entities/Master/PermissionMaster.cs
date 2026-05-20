
namespace DofyEcom.DBO
{
    public class PermissionMaster : EntityBase
    {
        public int PermissionId { get; set; }

        public string PermissionName { get; set; }

        public string PermissionCode { get; set; }

        public bool DisplayInList { get; set; }
        public int? PartnerId { get; set; }

        public ICollection<RolePermissionMapping> RolePermissions { get; set; }
    }
}