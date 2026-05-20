namespace DofyEcom.Contracts;

using DataTables.AspNet.Core;
using Microsoft.AspNetCore.Http;

public interface IEntityModel<T> : IBaseModel<T>
{
    /// <summary>
    /// Creates the Entity Information with IFormFileCollection.
    /// </summary>
    /// <param name="item">Represents an entity to create entity Information.</param>
    /// <param name="postedFileCollection">Posted file collection to upload.</param>
    /// <returns>Entity Item Id.</returns>
    long Post(T item, IFormFileCollection postedFileCollection);

    /// <summary>
    /// Update Entity Information with IFormFileCollection.
    /// </summary>
    /// <param name="item">RepresentsEntity Item.</param>
    /// <param name="postedFileCollection">Posted file collection to upload.</param>
    /// <returns>returns Entity Id.</returns>
    long Put(T item, IFormFileCollection postedFileCollection);

    /// <summary>
    /// Creates the Entity Information with out IFormFileCollection.
    /// </summary>
    /// <param name="item">Represents an entity to create entity Information.</param>
    /// <returns>EntityItem Id</returns>
    long Post(T item);

    /// <summary>
    /// Update the Entity Information with out IFormFileCollection.
    /// </summary>
    /// <param name="item">Represents an entity to create entity Information.</param>
    /// <returns>Entity Item Id</returns>
    long Put(T item);

    /// <summary>
    /// Download entity Information based on the Type.
    /// </summary>
    /// <param name="request">Represents datatables request.</param>
    /// <param name="gridType">Represents grid Type Name.</param>
    /// <param name="fileHeader">Represents file header Name.</param>
    /// <param name="userId">Represents logged in user Id.</param>
    /// <param name="periodId">Represents period Id for year.</param>
    /// <returns>Entity Information as bytes</returns>
    byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId);

    /// <summary>
    /// Remove the Entity information from the repository.
    /// </summary>
    /// <param name="id">Represents Entity Id to delete.</param>
    /// <returns>returns true if deleted otherwise false.</returns>
    bool Remove(long id);
}
