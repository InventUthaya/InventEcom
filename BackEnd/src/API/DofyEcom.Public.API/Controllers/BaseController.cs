using DofyEcom.Contracts;
using DofyEcom.Helper;
using DofyEcom.Helper.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace DofyEcom.Public.API.Controllers
{
    public class BaseController<TIContract, TItem> : Controller
         where TIContract : IBaseModel<TItem>
     where TItem : DofyEcom.ViewEntities.EntityBase
    {
        private readonly TIContract contract;
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IBaseContext baseContext;
        private CountryContext _requestContext;

        public BaseController(TIContract iContract, IOptionsSnapshot<AppConfiguration> iAppConfiguration, IBaseContext context = null, CountryContext requestContext = null)
        {
            this.contract = iContract;
            this.appConfiguration = iAppConfiguration;
            this.baseContext = context;
            this._requestContext = requestContext;
        }


        public TIContract Contract
        {
            get { return this.contract; }
        }

        public HttpClient Client
        {
            get { return this.baseContext.Client; }
        }

        public long LoggedInUserId
        {
            get { return Convert.ToInt64(this.User.Claims.Where(item => item.Type == ClaimTypes.PrimarySid)?.FirstOrDefault()?.Value); }
        }

        public long TrialUserAssetCount
        {
            get { return Convert.ToInt64(this.User.Claims.Where(item => item.Type == "SubscribedAssets")?.FirstOrDefault()?.Value); }
        }

        public DateTime PlanExpiredDate
        {
            get
            {
                if (!string.IsNullOrEmpty(this.User.Claims.Where(item => item.Type == "ToDate")?.FirstOrDefault()?.Value))
                {
                    return Convert.ToDateTime(this.User.Claims.Where(item => item.Type == "ToDate")?.FirstOrDefault()?.Value);
                }
                else
                {
                    return default(DateTime);
                }
            }
        }

        public int CompanyId
        {
            // Currently hard coded. We have to modify
            get { return 1; }
        }

        // GET: /<controller>/
        [NonAction]
        public virtual IActionResult Index()
        {
            var result = this.contract.GetList();

            return this.View(result);
        }

        [NonAction]
        [HttpGet]
        public virtual IActionResult Edit(int id)
        {
            var result = this.contract.Get(id);

            return this.View(result);
        }

        [NonAction]
        [HttpGet]
        public virtual IActionResult Create()
        {
            var result = Activator.CreateInstance<TItem>();

            return this.View(result);
        }

        protected virtual void SetTempData<T>(string key, T value)
        {
            this.TempData[key] = value.Serialize<T>();
        }

        protected virtual T GetTempData<T>(string key)
        {
            object o;
            this.TempData.TryGetValue(key, out o);
            return o == null ? default(T) : ((string)o).Deserialize<T>();
        }

        [NonAction]
        public IConfiguration RebuildConfiguration(IConfiguration configuration)
        {
            var dbCollection = new Dictionary<string, string>
            {
                { "HostingEnvironment:ContentRootPath", Convert.ToString(configuration["HostingEnvironment:ContentRootPath"]) },
                { "HostingEnvironment:EnvironmentName", Convert.ToString(configuration["HostingEnvironment:EnvironmentName"]) },
            };

            var builder = new ConfigurationBuilder()
                            .SetBasePath(Convert.ToString(configuration["HostingEnvironment:ContentRootPath"]))
                            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                            .AddJsonFile($"appsettings.{Convert.ToString(configuration["HostingEnvironment:EnvironmentName"])}.json", optional: true)
                            .AddEnvironmentVariables()
                            .AddEnvironmentVariables().AddInMemoryCollection(dbCollection);

            return builder.Build();
        }

        [NonAction]
        public override void OnActionExecuting(ActionExecutingContext ctx)
        {
            try
            {
                var dict = new Dictionary<string, string>();
                this.HttpContext.User.Claims.ToList().ForEach(item => dict.Add(item.Type, item.Value));
            }
            catch
            {
            }
        }

        protected TEntity PutAsync<TEntity, TMEntity>(string apiURL, TMEntity requestModel)
        {
            HttpResponseMessage responseMessage = new HttpResponseMessage();
            try
            {
                var restRequest = new HttpRequestMessage
                {
                    Method = HttpMethod.Put,
                    RequestUri = new Uri(apiURL, UriKind.Relative),
                    Content = new StringContent(requestModel.Serialize(), null, "application/json"),
                };

                responseMessage = this.Client.PutAsync(apiURL, restRequest.Content).Result;

                if (typeof(TEntity).Equals(typeof(HttpResponseMessage)))
                {
                    return (TEntity)(object)responseMessage;
                }

                if (typeof(TEntity).Equals(typeof(HttpResponseMessage)))
                {
                    return (TEntity)(object)responseMessage;
                }

                if (responseMessage.IsSuccessStatusCode)
                {
                    var resultString = responseMessage.Content.ReadAsStringAsync().Result;
                    var result = JsonConvert.DeserializeObject<TEntity>(resultString);
                    if (typeof(TEntity).Equals(typeof(bool)))
                    {
                        return (TEntity)(object)true;
                    }

                    return result;
                }

                throw new Exception(responseMessage.ReasonPhrase);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [NonAction]
        public string GetDBName(Microsoft.AspNetCore.Http.HttpRequest request)
        {
            StringValues headerValues;
            string dbName = string.Empty;

            if (request.Headers.TryGetValue("DBName", out headerValues))
            {
                dbName = headerValues.FirstOrDefault();
            }

            return dbName;
        }
        [NonAction]
        public string DecryptString(string cipherText)
        {

            cipherText = cipherText.Replace("-", "+").Replace("_", "/");

            byte[] iv = new byte[16];
            byte[] buffer = Convert.FromBase64String(cipherText);

            string key = DOFYEcomConstants.AES_ENCRYPTIONKEY;

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(key);
                aes.IV = Encoding.UTF8.GetBytes(key);
                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream(buffer))
                {
                    using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader streamReader = new StreamReader((Stream)cryptoStream))
                        {
                            return streamReader.ReadToEnd();
                        }
                    }
                }
            }
        }

        [NonAction]
        public string EncryptString(string plainText)
        {
            byte[] iv = new byte[16];
            byte[] array;

            string key = DOFYEcomConstants.AES_ENCRYPTIONKEY;

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(key);
                aes.IV = Encoding.UTF8.GetBytes(key);

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter streamWriter = new StreamWriter((Stream)cryptoStream))
                        {
                            streamWriter.Write(plainText);
                        }

                        array = memoryStream.ToArray();
                    }
                }
            }

            var encryptedArray = Convert.ToBase64String(array);
            var encryptedvalue = encryptedArray.Replace("+", "-").Replace("/", "_");

            return encryptedvalue;
        }

        [NonAction]
        public string DecryptAES(string hexCipherText)
        {
            var key = this.appConfiguration.Value?.AESEncryptionConfiguration?.EncryptionKey;

            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            if (keyBytes.Length != 16)
            {
                throw new CryptographicException("Encryption key must be exactly 16 bytes in length.");
            }

            byte[] encryptedBytes = HexToBytes(hexCipherText);

            using Aes aes = Aes.Create();
            aes.Key = keyBytes;
            aes.Mode = CipherMode.ECB;
            aes.Padding = PaddingMode.PKCS7;

            try
            {
                using ICryptoTransform decryptor = aes.CreateDecryptor();
                byte[] decryptedBytes = decryptor.TransformFinalBlock(encryptedBytes, 0, encryptedBytes.Length);
                return Encoding.UTF8.GetString(decryptedBytes);
            }
            catch (CryptographicException ex)
            {
                throw new CryptographicException("Decryption failed: " + ex.Message);
            }
        }

        public static byte[] HexToBytes(string hex)
        {
            if (hex.Length % 2 != 0)
            {
                throw new ArgumentException("Hex string length must be even.");
            }
            int length = hex.Length / 2;
            byte[] bytes = new byte[length];
            for (int i = 0; i < length; i++)
            {
                bytes[i] = Convert.ToByte(hex.Substring(i * 2, 2), 16);
            }
            return bytes;
        }

        [NonAction]
        public string EncryptAES(string plainText)
        {
            var key = this.appConfiguration?.Value?.AESEncryptionConfiguration?.EncryptionKey ?? string.Empty;
            byte[] keyBytes = Encoding.UTF8.GetBytes(key.PadRight(16, '0'));
            byte[] plainBytes = Encoding.UTF8.GetBytes(plainText);

            using Aes aes = Aes.Create();
            aes.Key = keyBytes;
            aes.Mode = CipherMode.ECB;
            aes.Padding = PaddingMode.PKCS7;

            using ICryptoTransform encryptor = aes.CreateEncryptor();
            byte[] encryptedBytes = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);

            return BytesToHex(encryptedBytes);
        }
        private string BytesToHex(byte[] bytes)
        {
            return BitConverter.ToString(bytes).Replace("-", string.Empty);
        }
    }
}
