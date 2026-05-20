using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Public.API.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        public string Index()
        {
            return "DOFY Ecommerce Public API";
        }
    }
}
