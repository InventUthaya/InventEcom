using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.ViewEntities.ViewModel
{
    public class RiderDetailViewModel
    {
        public long OrderID { get; set; }  // OrderID from RiderAssignment
        public long RiderID { get; set; }  // RiderID from RiderAssignment
        public string Phone { get; set; }  // Phone number from UserLogin
        public string FullName { get; set; }  // Full name from UserMaster
    }

   
}
