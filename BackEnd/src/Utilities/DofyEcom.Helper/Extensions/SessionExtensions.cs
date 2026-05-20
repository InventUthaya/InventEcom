namespace DofyEcom.Helper.Extensions
{
    using Microsoft.AspNetCore.Http;

    public static class SessionExtensions
    {
        public static void SetObject(this ISession session, string key, object value)
        {
            session.SetString(key, Newtonsoft.Json.JsonConvert.SerializeObject(value));
        }

        public static T GetObject<T>(this ISession session, string key)
        {
            var value = session.GetString(key);
            return value == null ? default(T) : Newtonsoft.Json.JsonConvert.DeserializeObject<T>(value);
        }
    }
}
