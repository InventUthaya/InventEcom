using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.ViewEntities
{
    public class UserPaginationRequestViewModel
    {
        public string RoleType { get; set; }
        public string? SearchText { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string SortColumn { get; set; } = "Created";
        public string SortOrder { get; set; } = "DESC";
    }
}
