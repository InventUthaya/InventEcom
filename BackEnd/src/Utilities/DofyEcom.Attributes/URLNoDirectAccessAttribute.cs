namespace DofyEcom.Attributes
{
    using System;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Filters;

    [AttributeUsageAttribute(AttributeTargets.Method, Inherited = true)]
    public class URLNoDirectAccessAttribute : AuthorizeAttribute, IAuthorizationFilter, IOrderedFilter
    {
        public int Order { get; set; }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var urlReferer = Convert.ToString(context.HttpContext.Request.Headers["Referer"]);
            var urlActionMethod = Convert.ToString(context.RouteData.Values["action"]);

            if (string.IsNullOrEmpty(urlReferer))
            {
                if (!string.IsNullOrEmpty(urlActionMethod))
                {
                    urlActionMethod = urlActionMethod.ToLower();
                    if (urlActionMethod.Equals("edit") || urlActionMethod.Equals("view"))
                    {
                        context.Result = new ForbidResult();
                    }
                }
            }
        }
    }
}
