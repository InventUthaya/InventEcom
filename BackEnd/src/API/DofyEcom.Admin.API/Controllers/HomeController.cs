using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Admin.API.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        public string Index()
        {
            return "DOFY Ecommerce Admin API";
        }
    }
}
