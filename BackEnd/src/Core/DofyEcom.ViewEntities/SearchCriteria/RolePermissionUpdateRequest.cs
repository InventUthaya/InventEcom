namespace DofyEcom.ViewEntities
{
    public class RolePermissionUpdateRequest
    {

        public int roleId { get; set; }
        public List<ScreenPermissionUpdate> updates { get; set; } = new();
    }

        public class ScreenPermissionUpdate
        {
            public int ScreenId { get; set; }
            public bool IsActive { get; set; }
        }
    
}
