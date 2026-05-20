namespace DofyEcom.Attributes
{
    using System;
    using DofyEcom.Logger;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Filters;
    using Microsoft.Extensions.Configuration;

    public class GlobalExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private readonly IConfiguration configuration;

        public GlobalExceptionFilterAttribute(IConfiguration iConfiguration)
        {
            this.configuration = iConfiguration;
        }

        public override void OnException(ExceptionContext context)
        {
            SeriLogger.Error(context.Exception, "Internal Server Error Occur.");

            if (context.Exception is UnauthorizedAccessException)
            {
                context.Result = new RedirectToActionResult("Unauthorized", "Auth", null);
            }

            if (context.Exception is Exception)
            {
                context.Result = new RedirectToActionResult("ExceptionPage", "Home", null);
            }

            base.OnException(context);
        }
    }
}
