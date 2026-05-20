namespace DofyEcom.Contracts
{
    using DofyEcom.ViewEntities;

    public interface IAuthModel : IEntityModel<UserLogin>, IDisposable
    {
        /// <summary>
        /// Post the login credential.
        /// </summary>
        /// <param name="employeecode">User Name.</param>
        /// <param name="password">Password.</param>
        /// <returns>auth value.</returns>
        Task<ViewEntities.UserLogin> Authenticate(string phone);
        /// <summary>
        /// Post the login credential.
        /// </summary>
        /// <param name="employeecode">User Name.</param>
        /// <param name="password">Password.</param>
        /// <returns>auth value.</returns>
        Task<ViewEntities.UserLogin> AuthenticateUser(string email, string password);

        Task<bool> VerifyOTP(int loginId, string otp);




        public void Dispose()
        {
            //throw new NotImplementedException();
        }

        Task<ViewEntities.UserLogin> AuthenticateWithOTP(string phoneNumber, string otp);

        Task<long> AddUser(CreateUserRequestViewModel request);

        Task<ViewEntities.UserMaster> GetUserMaster(long userId);

    }
}

