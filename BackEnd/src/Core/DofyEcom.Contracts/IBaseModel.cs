namespace DofyEcom.Contracts;

public interface IBaseModel<T>
{
    /// <summary>
    /// Get list of Item's available based on the logged in user role.
    /// </summary>
    /// <returns>List of Item's</returns>
    IEnumerable<T> GetList();

    /// <summary>
    /// Gets Item Information based on the Id.
    /// </summary>
    /// <param name="id">Represents Id</param>
    /// <returns>returns Item Information</returns>
    T Get(long id);
}
