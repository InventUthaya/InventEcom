namespace DofyEcom.Helper.Attributes
{
    public class DisplayAttribute : Attribute
    {
        public DisplayAttribute()
        {
            this.IgnoreMember = true;
        }

        public string Name { get; set; }

        public bool IgnoreMember { get; set; }
    }
}
