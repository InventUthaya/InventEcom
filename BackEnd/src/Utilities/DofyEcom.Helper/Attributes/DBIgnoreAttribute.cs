namespace DofyEcom.Helper.Attributes
{
    public class DBIgnoreAttribute : Attribute
    {
        public DBIgnoreAttribute()
        {
            this.IgnoreMember = true;
        }

        public bool IgnoreMember { get; set; }
    }
}
