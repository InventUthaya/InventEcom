using AutoMapper;
using DofyEcom.Contracts;
using DofyEcom.Contracts.Interfaces.Admin;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;

namespace DofyEcom.Public.API.Controllers
{
    [Route("api/userAddress")]
    [ApiController]
    public class UserAddressController : BaseController<IUserAddressModel, UserAddress>
    {
        private readonly IUserAddressModel userAddressModel;

        public UserAddressController(
            IOptionsSnapshot<AppConfiguration> appConfiguration,
            IMapper mapper,
            IUserAddressModel userAddressModel,
            CountryContext requestContext)
            : base(userAddressModel, appConfiguration, requestContext: requestContext)
        {
            this.userAddressModel = userAddressModel;
        }

        [HttpPost("Create")]
        public IActionResult Create([FromBody] UserAddress address)
        {
            if (address == null)
                return BadRequest("Invalid address data");

            address.Id = 0;

            long id = userAddressModel.Post(address);
            return Ok(new { Id = id });
        }

        [HttpPost("Edit")]
        public IActionResult Edit([FromBody] UserAddress address)
        {
            if (address == null || address.Id <= 0)
                return BadRequest("Invalid address data");

            userAddressModel.Put(address);
            return Ok(new { Id = address.Id });
        }

        [HttpGet("Remove")]
        public IActionResult Remove(string id, [FromQuery] string personId)
        {
            //if (string.IsNullOrWhiteSpace(id))
            //    return BadRequest("Invalid address id");

            long addressId;

            if (!long.TryParse(id, out addressId))
            {
                addressId = Convert.ToInt64(DecryptAES(id));
            }

            bool result = userAddressModel.Remove(addressId);
            return Ok(new { Success = result });
        }

        [HttpGet("GetList")]
        public IActionResult GetList()
        {
            var result = userAddressModel.GetList();
            return Ok(result);
        }

        [HttpPost]
        [Route("GetUserAddressByUserId")]
        public  IEnumerable<UserAddress> GetUserAddress([FromQuery] int userId)
        {
            var result =  this.Contract.GetByUserId((long)userId);
            return result;

        }
    }
}

