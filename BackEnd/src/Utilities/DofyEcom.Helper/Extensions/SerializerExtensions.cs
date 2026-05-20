namespace DofyEcom.Helper.Extensions
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Text;
    using Newtonsoft.Json;

    public static class SerializerExtensions
    {
        public static string Serialize<T>(this T objToSerialize)
        {
            return JsonConvert.SerializeObject(objToSerialize);
        }

        public static T Deserialize<T>(this string jsonContent)
        {
            return JsonConvert.DeserializeObject<T>(jsonContent);
        }

        public static byte[] SerializeAsByteArray<T>(this T objToSerialize)
        {
            var strOutput = objToSerialize.Serialize<T>();

            return Encoding.ASCII.GetBytes(strOutput);
        }

        public static T DeSerializeFromByteArray<T>(this byte[] objToDeSerialize)
        {
            var strOutput = Encoding.UTF8.GetString(objToDeSerialize, 0, objToDeSerialize.Length);
            return strOutput.Deserialize<T>();
        }

        public static string SerializeAsFormData<T>(this T objToSerialize)
        {
            var result = new Dictionary<string, string>();
            foreach (var item in objToSerialize.GetType().GetProperties())
            {
                result.Add(item.Name, item.GetValue(objToSerialize) as string);
            }

            return string.Join("&", result.Select(item => item.Key + "=" + item.Value));
        }
    }
}
