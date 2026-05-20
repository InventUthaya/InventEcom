
namespace DofyEcom.DBO
{
    public class RolePermissionMapping : EntityBase
    {
        public int RoleId { get; set; }

        public int ScreenId { get; set; }

        public int PermissionId { get; set; }

        public bool DisplayInList { get; set; }

    }
}