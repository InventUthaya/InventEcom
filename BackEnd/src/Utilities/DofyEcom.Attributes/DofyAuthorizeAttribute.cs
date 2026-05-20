namespace DofyEcom.Attributes
{
    using DofyEcom.Attributes.Helpers;
    using DofyEcom.Helper;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Controllers;
    using Microsoft.AspNetCore.Mvc.Filters;

    [AttributeUsageAttribute(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class DOFYAuthorizeAttribute : AuthorizeAttribute, IAuthorizationFilter, IOrderedFilter
    {
        //private ROLES_ENUM[] rolesEnum;

        //public DOFYAuthorizeAttribute(params ROLES_ENUM[] userRoles)
        //{
        //    this.rolesEnum = userRoles;
        //}

        public int Order { get; set; }

        public bool IsMethodAttribute { get; set; }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var controllerActionDescriptor = context.ActionDescriptor as ControllerActionDescriptor;
            if (controllerActionDescriptor != null)
            {
                bool skipControllerAuthorization = controllerActionDescriptor.ControllerTypeInfo.GetCustomAttributes(typeof(AllowAnonymousAttribute), true)
                                                    .Any(item => item.GetType().Equals(typeof(AllowAnonymousAttribute)));
                bool skipMethodAuthorization = controllerActionDescriptor.MethodInfo.GetCustomAttributes(typeof(AllowAnonymousAttribute), true)
                                                   .Any(item => item.GetType().Equals(typeof(AllowAnonymousAttribute)));

                if (skipControllerAuthorization || skipMethodAuthorization)
                {
                    return;
                }

                if (!this.IsMethodAttribute)
                {
                    bool ignoreControllerAttribute = controllerActionDescriptor.MethodInfo.GetCustomAttributes(typeof(DOFYAuthorizeAttribute), true)
                                                   .Any(item => item.GetType().Equals(typeof(DOFYAuthorizeAttribute)));

                    if (ignoreControllerAttribute)
                    {
                        return;
                    }
                }
            }

            //var userRoleEnumName = Enum.GetName(typeof(ROLES_ENUM), new AppCurrentUser(context.HttpContext.User).RoleId);
            //if (!this.rolesEnum.Contains((ROLES_ENUM)Enum.Parse(typeof(ROLES_ENUM), userRoleEnumName)))
            //{
            //    context.Result = new ForbidResult();
            //}
        }
    }
}
