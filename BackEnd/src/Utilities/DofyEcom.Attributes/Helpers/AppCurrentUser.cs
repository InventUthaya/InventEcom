namespace DofyEcom.Attributes.Helpers
{
    using System;
    using System.Security.Claims;

    public class AppCurrentUser : ClaimsPrincipal
    {
        public AppCurrentUser(ClaimsPrincipal principal)
            : base(principal)
        {
        }

        public string Name
        {
            get
            {
                return this.FindFirst(ClaimTypes.Name).Value;
            }
        }

        public long RoleId
        {
            get
            {
                return Convert.ToInt64(this.FindFirst(ClaimTypes.GroupSid).Value);
            }
        }

        public long CompanyId
        {
            get
            {
                return Convert.ToInt64(this.FindFirst(ClaimTypes.GroupSid).Value);
            }
        }

        public string Role
        {
            get
            {
                return this.FindFirst(ClaimTypes.Role).Value;
            }
        }

        public long UserId
        {
            get
            {
                return Convert.ToInt64(this.FindFirst(ClaimTypes.Sid).Value);
            }
        }

        public string DisplayName
        {
            get
            {
                return this.FindFirst(ClaimTypes.GivenName).Value;
            }
        }

        public int DepartmentId
        {
            get
            {
                return Convert.ToInt32(this.FindFirst(ClaimTypes.PrimarySid).Value);
            }
        }

        //public bool IsAdmin
        //{
        //    get
        //    {
        //        return this.RoleId == (long)Helper.ROLES_ENUM.ADMIN;              
        //    }
        //}

        public string UserToken
        {
            get
            {
                return this.FindFirst(ClaimTypes.Hash)?.Value;
            }
        }
    }
}
