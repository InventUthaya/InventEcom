namespace DofyEcom.Contracts
{
    using DofyEcom.ViewEntities;

    public interface IAuthOTPModel : IEntityModel<AuthOTP>, IDisposable
    {
        /// <summary>
        /// Post the login credential.
        /// </summary>
        /// <param name="employeecode">User Name.</param>
        /// <param name="password">Password.</param>
        /// <returns>auth value.</returns>
        Task<ViewEntities.AuthOTP> Authenticate(string phone);



    }
}

