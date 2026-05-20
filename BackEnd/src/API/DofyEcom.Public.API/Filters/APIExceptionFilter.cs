using DofyEcom.Logger;
using Microsoft.AspNetCore.Mvc.Filters;

namespace DOFY.Public.API.Filters;

public class APIExceptionFilter : ExceptionFilterAttribute
{
    public APIExceptionFilter()
    {

    }

    public override void OnException(ExceptionContext context)
    {
        SeriLogger.Error(context.Exception, "Internal Server Error Occur.");
        base.OnException(context);
    }
}
