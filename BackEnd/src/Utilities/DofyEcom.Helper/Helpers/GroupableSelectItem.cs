namespace DofyEcom.Helper.Helpers
{
    public class GroupableSelectItem : IGroupableSelectItem
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public string ParentName { get; set; }

        public bool Selected { get; set; }

        public string Order { get; set; }

        public bool HasChild { get; set; }
    }
}
