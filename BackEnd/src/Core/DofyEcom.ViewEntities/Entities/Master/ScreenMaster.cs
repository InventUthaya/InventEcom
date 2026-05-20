namespace DofyEcom.ViewEntities
{
    public class ScreenMaster : EntityBase
    {
        public string ScreenName { get; set; }

        public string ScreenCode { get; set; }

        public int? ParentScreenId { get; set; }

        public bool DisplayInList { get; set; }
        public int? PartnerId { get; set; }

        public string? Icon { get; set; }

        public string? IsSidebar { get; set; }

    }
}