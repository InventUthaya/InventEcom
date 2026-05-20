using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;

namespace DofyEcom.Contracts;

public interface IDofyGeoModel : IEntityModel<DofyGeo>
{
    IEnumerable<ViewEntities.DofyGeo> GetPincodeAvailability(string pincode);

    //DOFY.Helper.CdnImages getImageSlider();

    IEnumerable<ViewEntities.DofyGeo> GetDofyGeoListBysearch(string searchText);

    //PagedList<ViewEntities.DofyGeo> GetDofyGeoListBySearchText(string searchText, int? parent);
    Task<IEnumerable<ViewEntities.DofyGeo>> GetDofyGeoListBySearchTextAsync(string searchText, int? parentId);


    IEnumerable<DofyGeo> GetStateList(long serviceTypeId);
    IEnumerable<DofyGeo> GetCityList(long serviceTypeId, long StateId);

}
