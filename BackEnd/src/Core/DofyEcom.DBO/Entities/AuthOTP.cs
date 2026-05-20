namespace DofyEcom.DBO
{
    public class AuthOTP : EntityBase
    {


        public long LoginId { get; set; }

        public string OTP { get; set; }

        public DateTime GeneratedTime { get; set; }

        public DateTime ExpiredTime { get; set; }
        public int? PartnerId { get; set; }

    }
}
