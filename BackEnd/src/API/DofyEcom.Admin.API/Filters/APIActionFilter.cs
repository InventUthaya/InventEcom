namespace DofyEcom.Public.API.Filters;

using DofyEcom.Logger;
using Microsoft.AspNetCore.Mvc.Filters;

public class APIActionFilter : ActionFilterAttribute
{
    public APIActionFilter()
    {
    }

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        SeriLogger.Information(string.Concat("Action Executing EndPoint ", context.ActionDescriptor.DisplayName));
        base.OnActionExecuting(context);
    }
}
