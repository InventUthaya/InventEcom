using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.ViewEntities.ViewModel
{

    public class UserPaginationResponse
    {
        public int UserID { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string RoleName { get; set; }
        public string Status { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Modified { get; set; }
        public int TotalCount { get; set; }
    }

    public class ManagementUserViewModel
    {
        public List<UserPaginationResponse> Users { get; set; } = new List<UserPaginationResponse>();
        public int TotalRecords { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}
