namespace DofyEcom.DBO
{
    public class OrderOTP : EntityBase
    {

        public long LoginId { get; set; }

        public long OrderId { get; set; }

        public bool IsVerified { get; set; }

        public string OTP { get; set; }

        public DateTime GeneratedTime { get; set; }

        public DateTime ExpiredTime { get; set; }
        public int? PartnerId { get; set; }

    }
}
