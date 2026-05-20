
namespace DofyEcom.DBO
{
    public class StatusMaster : EntityBase
    {

        public string StatusType { get; set; }

        public string StatusName { get; set; }

        public bool DisplayInList { get; set; }

        public int? PartnerId { get; set; }


    }
}