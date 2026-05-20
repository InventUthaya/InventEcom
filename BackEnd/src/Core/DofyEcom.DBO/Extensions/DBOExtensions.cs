using System;

namespace DOFY.DBO.Extensions
{
    public static class DBOExtensions
    {
        public static Type GetEntityType<T>(this string className)
        {
            string name_space = "DofyEcom.DBO.";
            var objectType = Type.GetType(name_space + className);
            if (objectType == null)
            {
                objectType = typeof(T);
            }

            return objectType;
        }
    }
}
