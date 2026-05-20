namespace DOFY.Public.API.Helpers
{
    using Microsoft.AspNetCore.Authorization;

    public static class AuthorizationExtensions
    {
        public static void AddAuthorizationPolicies(this AuthorizationOptions options)
        {
            //options.AddPolicy(Helper.ROLES_ENUM.PUBLIC.ToString(), policy =>
            //{
            //    policy.RequireClaim(System.Security.Claims.ClaimTypes.GroupSid, ((int)Helper.ROLES_ENUM.PUBLIC).ToString());
            //});
        }
    }
}
