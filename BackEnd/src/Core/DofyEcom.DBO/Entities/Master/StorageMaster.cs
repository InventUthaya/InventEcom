namespace DofyEcom.DBO
{
    public class StorageMaster : EntityBase
    {
        public string StorageSize { get; set; }
        public bool IsActive { get; set; }
        public bool DisplayInList { get; set; }
        public int? PartnerId { get; set; }
    }
}