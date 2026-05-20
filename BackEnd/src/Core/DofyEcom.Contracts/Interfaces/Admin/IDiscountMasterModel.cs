namespace DofyEcom.Contracts
{
    using DofyEcom.ViewEntities;

    public interface IDiscountMasterModel : IEntityModel<DiscountMaster>, IDisposable
    {
        /// <summary>
        /// Post the login credential.
        /// </summary>
        /// <param name="employeecode">User Name.</param>
        /// <param name="password">Password.</param>
        /// <returns>auth value.</returns>

        IEnumerable<ViewEntities.DiscountMaster> GetDiscountList();



    }
}


