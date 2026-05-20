using DofyEcom.Helper.Attributes;

namespace DofyEcom.ViewEntities
{
    public class UserLogin : EntityBase
    {


        public long UserId { get; set; }

        public string? Email { get; set; }

        public string? Phone { get; set; }

        public string? PasswordHash { get; set; }

        public DateTime? LastLogin { get; set; }

        public bool? DisplayInList { get; set; }

    }
}
