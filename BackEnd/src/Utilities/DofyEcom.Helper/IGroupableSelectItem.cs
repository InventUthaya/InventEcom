namespace DofyEcom.Helper
{
    public interface IGroupableSelectItem
    {
        long Id { get; set; }

        string Name { get; set; }

        string ParentName { get; set; }

        bool Selected { get; set; }

        string Order { get; set; }

        bool HasChild { get; set; }
    }
}
