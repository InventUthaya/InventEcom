namespace DofyEcom.Helper.Extensions
{
    using System;
	using System.Collections.Generic;
	using System.Linq;
    using System.Reflection;
    using System.Text.RegularExpressions;
    using Attributes;
    using Microsoft.AspNetCore.Http;
    using Serilog;

    public static class GenericExtensions
    {
        public static string ExtractTypeName(this PropertyInfo propInfo)
        {
            var propertyType = propInfo.PropertyType;
            if (propertyType.IsGenericParameter && propertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
            {
                return propertyType.GenericTypeArguments[0].FullName;
            }

            return propInfo.PropertyType.FullName;
        }

        public static string FirstCharToUpper(this string input)
        {
            if (string.IsNullOrEmpty(input))
            {
                throw new ArgumentException("ARGH!");
            }

            input = input.ToLower();
            if (input.Contains("_"))
            {
                var splitArray = input.Split('_');
                return string.Join("_", splitArray.Select(item => item.First().ToString().ToUpper() + string.Join(string.Empty, item.Skip(1))));
            }

            return input.First().ToString().ToUpper() + string.Join(string.Empty, input.Skip(1));
        }

        public static string FormatPropertyValue<TItem>(this PropertyInfo propInfo, TItem result, bool ignoreDollorFormat = false, string dateFormat = "MMM/dd/yyyy")
        {
            string output = string.Empty;
            if (result != null)
            {
                switch (propInfo.ExtractTypeName())
                {
                    case "System.Int32":
                        output = Convert.ToInt32(propInfo.GetValue(result)).ToString();
                        break;
                    case "System.Decimal":
                        output = string.Concat(!ignoreDollorFormat ? "$" : string.Empty, Convert.ToDecimal(propInfo.GetValue(result)).ToString("#.00#"));
                        break;
                    case "System.DateTime":
                        output = Convert.ToDateTime(propInfo.GetValue(result)).ConvertToCustomDate(dateFormat);
                        break;
                    default:
                        output = Convert.ToString(propInfo.GetValue(result));
                        break;
                }
            }

            return output;
        }

        public static string GetDisplayAttributeName(this string objectName)
        {
            var objType = Type.GetType("DOFY.ViewEntities." + objectName + ", DOFY.ViewEntities", false, true);
            var propertyInfo = objType?.GetTypeInfo()?.GetCustomAttribute<DisplayAttribute>(false);

            return propertyInfo?.Name ?? objectName;
        }

        public static string GenerateEnumName(this string name)
        {
            if (!string.IsNullOrEmpty(name))
            {
                var enumName = Regex.Replace(name, "[^0-9a-zA-Z]+", "_");
                return enumName;
            }

            return default(string);
        }

        public static bool IsNumber(this string text)
        {
            Regex regex = new Regex(@"^\d+$");

            return !string.IsNullOrEmpty(text) && regex.IsMatch(text);
        }

        public static int GetRandomNumber()
        {
            Random randomNumber = new Random();

            return randomNumber.Next(10000, 99999);
        }

        public static Dictionary<string, string> ParseParams(this string parameters)
        {
            var parms = new Dictionary<string, string>();
            string[] parmArray = parameters?.Split(',');
            if (!string.IsNullOrEmpty(parameters))
            {
                foreach (string parm in parmArray)
                {
                    // string should not be empty and string should not be in the form
                    // =4 (first char) or s= (last char)
                    // accepted s=5, thu=90 etc.
                    if (!string.IsNullOrWhiteSpace(parm) &&
                        (parm.IndexOf('=') > 0 && parm.IndexOf('=') < (parm.Length - 1)))
                    {
                        // first instance of the separator, in this case it is '='
                        int separatorIndex = parm.IndexOf('=');
                        string[] parmAndValue = parm.Split('=');

                        // extract text from 0th index to the separator, value is from the char next to separator to end of string. remember, there can be multiple instances of the separator, we are only interedted in the first instance
                        // example : http://localhost:59310?sendEmail=user@user.com
                        parms.Add(parm.Substring(0, separatorIndex).Trim(new char[] { ' ', '"' }), parm.Substring(separatorIndex + 1).Trim(new char[] { ' ', '"' }));
                    }
                }
            }

            return parms;
        }

        public static string FormatTemplate(this string template, IDictionary<string, string> param)
        {
            if (template != null)
            {
                foreach (KeyValuePair<string, string> keyValue in param)
                {
                    template = template.Replace("{" + keyValue.Key + "}", keyValue.Value);
                }
            }

            return template;
        }

        public static T RegisterForDispose<T>(this T disposable, HttpContext context)
           where T : IDisposable
        {
            context.Response.RegisterForDispose(disposable);
            return disposable;
        }

        public static string NewtonsoftHandleStringNull(this string input)
        {
            return input.Replace("\"null\"", "null");
        }

        /// <summary>
        /// Stream data convert into byte array.
        /// </summary>
        /// <param name="input"></param>
        /// <returns>bytes of array</returns>
        public static byte[] ReadStreamAsByteArray(this Stream input)
        {
            try
            {
                byte[] buffer = new byte[16 * 1024];
                using MemoryStream ms = new MemoryStream();
                int read;
                while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }

                return ms.ToArray();
            }
            catch (Exception ex)
            {
                Log.Error(ex, string.Concat("ReadStreamAsByteArray: ", ex.Message.ToString()));
            }

            return default;
        }
    }
}
