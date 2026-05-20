
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.ViewEntities.ViewModel
{
    public class ScreenPermissionViewModel
    {
        public int RoleId { get; set; }
        public int ScreenId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public List<string> Permissions { get; set; } = new List<string>();
    }

    public class ScreenResponseViewModel
    {
        public List<ScreenPermissionViewModel> Screens { get; set; } = new List<ScreenPermissionViewModel>();
    }
}