namespace DofyEcom.Model;

using AutoMapper;
using Cache;
using DAL;
using DataTables.AspNet.Core;
using DBO;
using DofyEcom.Helper.Extensions;
using DofyEcom.Helper.Extensions;
using Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;

public class BaseModel<T> : Repository<T>
                                      where T : EntityBase
{
    protected readonly IMapper mapper;
    private readonly IOptionsSnapshot<AppConfiguration> config;
    protected readonly IPrincipal? principle;
    private readonly CountryContext context;
    protected string ConnectionString { get; }


    public BaseModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? principle = null, string connectionString = null, CountryContext requestContext = null)
                            : base(typeof(T).Name, iConfig, connectionString)
    {
        this.mapper = iMapper;
        this.principle = principle;
        this.config = iConfig;
        this.context = requestContext;
        this.UserId = GetUserId(principle as ClaimsPrincipal);
        ConnectionString = connectionString;
    }
    public static long GetUserId(ClaimsPrincipal? claims)
    {
        var dict = new Dictionary<string, string>();
        long userId = 0;

        if (claims != null)
        {
            claims.Claims.ToList().ForEach(item => dict.Add(item.Type, item.Value));

            if (dict != null && dict.Count() > 0)
            {
                try
                {
                    userId = Convert.ToInt32(DecryptId(dict["PersonId"]));

                }
                catch (Exception ex)
                {
                    return userId;
                }
            }
        }
        return userId;
    }

    public static string GetConnectionString(CountryContext context, DatabaseConfiguration database)
    {
        var result = database.ConnectionStringIndia;

        if (context != null)
        {
            var countryCode = context.CountryCode;

            if (countryCode != null && countryCode == DOFYEcomConstants.UAE)
            {
                result = database.ConnectionStringUAE;
            }
        }

        return result;
    }

    public string GetS3FolderName(string countryCode)
    {
        var result = string.Empty;
        switch (countryCode)
        {
            case "ae":
                result = "UAE";
                break;
        }

        return result;
    }

    public bool ActiveStatus { get; set; }

    public bool LoadFromCache { get; set; }

    public long? UserId { get; set; }

    public virtual IEnumerable<T> GetAllItems()
    {
        IEnumerable<T> items = this.LoadFromCache ? DOFYCache<T>.GetAllEntities() : default(IEnumerable<T>);
        items = items?.Where(x => x.CountryCode == this.context.CountryCode);

        if (items == null || items.Count() == 0)
        {
            items = this.GetAll();
            if (this.LoadFromCache)
            {
                DOFYCache<T>.AddUpdateEntities(items);
            }
        }

        return items;
    }

    public virtual PagedList<T> GetAllItems(
                                            Expression<Func<T, bool>> predicate,
                                            SortExpression<T>[] sortExpressions,
                                            IEnumerable<string> searchColumns,
                                            string searchValue,
                                            int startIndex = 1,
                                            int itemsCount = 10,
                                            bool paging = true)
    {
        return this.GetAll(predicate, sortExpressions, searchColumns, searchValue, startIndex, itemsCount, paging);
    }

    public virtual T GetItem(long id)
    {
        T item = this.LoadFromCache ? DOFYCache<T>.GetEntity(id) : default(T);
        if (item == null)
        {
            item = this.FindById(id);
            if (this.LoadFromCache)
            {
                DOFYCache<T>.AddUpdateEntities(this.GetAllItems());
            }
        }

        return item;
    }

    public virtual T FindItemById(long id)
    {
        var item = this.LoadFromCache ? DOFYCache<T>.GetAllEntities()?.Where(x => x.CountryCode == this.context?.CountryCode).FirstOrDefault(entity => entity.Id == id) : default(T);
        if (item == null)
        {
            item = this.FindById(id);
            if (this.LoadFromCache)
            {
                DOFYCache<T>.AddUpdateEntities(this.GetAllItems());
            }
        }

        return item;
    }

    public virtual IEnumerable<T> FindItemsById(IEnumerable<long> ids)
    {
        var items = this.LoadFromCache ? DOFYCache<T>.GetAllEntities()?.Where(entity => ids.Contains(entity.Id)) : default(IEnumerable<T>);
        items = items?.Where(x => x.CountryCode == this.context?.CountryCode);
        if (items == null || items.Count() == 0)
        {
            items = this.FindByIds(ids);
            if (this.LoadFromCache)
            {
                DOFYCache<T>.AddUpdateEntities(this.GetAllItems());
            }
        }

        return items;
    }

    public virtual T FindItem(Expression<Func<T, bool>> predicate)
    {
        var items = this.LoadFromCache ? DOFYCache<T>.GetAllEntities()?.Where(predicate.Compile()) : default(IEnumerable<T>);
        items = items?.Where(x => x.CountryCode == this.context?.CountryCode);
        if (items == null || items?.Count() <= 0)
        {
            items = this.Find(predicate);
            if (this.LoadFromCache)
            {
                DOFYCache<T>.AddUpdateEntities(this.GetAllItems());
            }
        }

        return items?.FirstOrDefault();
    }

    public virtual IEnumerable<T> FindItems(Expression<Func<T, bool>> predicate)
    {
        var items = this.LoadFromCache ? DOFYCache<T>.GetAllEntities()?.Where(predicate.Compile()) : default(IEnumerable<T>);
        items = items?.Where(x => x.CountryCode == this.context?.CountryCode);
        if (items == null || items.Count() == 0)
        {
            var allItems = this.GetAllItems();
            items = this.LoadFromCache ? allItems?.Where(predicate.Compile()) : this.Find(predicate);
            if (this.LoadFromCache)
            {
                DOFYCache<T>.AddUpdateEntities(allItems);
            }
        }

        return items;
    }

    public virtual long AddItem(T item)
    {
        if (item.IsValid)
        {
            item.Created = DateTimeExtensions.GetCurrentIST();
            item.Modified = DateTimeExtensions.GetCurrentIST();
            item.CreatedBy = this.AddUpdateModifiedBy();
            item.ModifiedBy = this.AddUpdateModifiedBy();
            item.Id = this.Add(item);

            if (this.LoadFromCache)
            {
                DOFYCache<T>.AddUpdateEntity(this.FindById(item.Id));
            }
        }

        return item.Id;
    }

    private void SetPrimaryKeyValue(T item, long id)
    {
        string className = typeof(T).Name;
        string primaryKeyName = className + "Id"; // e.g., UserLogin → UserLoginId

        var prop = typeof(T).GetProperty(primaryKeyName);
        if (prop != null && prop.CanWrite && prop.PropertyType == typeof(long))
        {
            prop.SetValue(item, id);
        }
        else
        {
            // Fallback if "Id" exists and matches type
            var defaultIdProp = typeof(T).GetProperty("Id");
            if (defaultIdProp != null && defaultIdProp.CanWrite && defaultIdProp.PropertyType == typeof(long))
            {
                defaultIdProp.SetValue(item, id);
            }
        }
    }


    public virtual IEnumerable<long> AddItems(List<T> items)
    {
        var isValid = true;
        IEnumerable<long> result = new List<long>();
        if (items?.Count > 0)
        {
            foreach (T item in items)
            {
                item.Created = DateTimeExtensions.GetCurrentIST();
                item.Modified = DateTimeExtensions.GetCurrentIST();
                item.CreatedBy = this.AddUpdateModifiedBy();
                item.ModifiedBy = this.AddUpdateModifiedBy();
                if (!item.IsValid)
                {
                    isValid = false;
                }
            }

            if (isValid)
            {
                result = this.AddBulk(items);

                if (this.LoadFromCache)
                {
                    DOFYCache<T>.AddUpdateEntities(items);
                }
            }
        }

        return result;
    }

    public virtual void UpdateItem(T item)
    {
        if (item.IsValid)
        {
            item.Created = item?.Created is not null ? item.Created : DateTimeExtensions.GetCurrentIST();
            item.Modified = DateTimeExtensions.GetCurrentIST();
            item.ModifiedBy = this.AddUpdateModifiedBy();
            this.Update(item);
            if (this.LoadFromCache)
            {
                DOFYCache<T>.AddUpdateEntity(this.FindById(item.Id));
            }
        }
    }

    public virtual void UpdateItems(List<T> items)
    {
        var isValid = true;
        foreach (T item in items)
        {
            item.Created = item?.Created is not null ? item.Created : DateTimeExtensions.GetCurrentIST();
            item.Modified = DateTimeExtensions.GetCurrentIST();
            item.ModifiedBy = this.AddUpdateModifiedBy();
            if (!item.IsValid)
            {
                isValid = false;
            }
        }

        if (isValid)
        {
            this.UpdateBulk(items);
            if (this.LoadFromCache)
            {
                DOFYCache<T>.AddUpdateEntities(items);
            }
        }
    }

    public virtual void DeleteItem(long id)
    {
        this.Delete(id);

        if (this.LoadFromCache)
        {
            DOFYCache<T>.RemoveEntity(id);
        }
    }

    public virtual void RemoveItem(T item)
    {
        this.Remove(item);

        if (this.LoadFromCache)
        {
            DOFYCache<T>.RemoveEntity(item.Id);
        }
    }

    public string AddUpdateModifiedBy()
    {
        return this.UserId.ToString() ?? "0";
    }

    protected internal PagedList<TOut> GetPagedViewResult<TOut>(
                                                         IDataTablesRequest request,
                                                         Expression<Func<TOut, bool>> predicate,
                                                         string entityName,
                                                         bool paging = true)
                                                         where TOut : new()
    {
        var searchableColumns = request.Columns.Where(item => item.IsSearchable).Select(item => item.Field);
        var sortedColumns = request.Columns.GetSortedColumns();
        var sortExpressions = sortedColumns.ConstructSortExpressions<TOut>();

        var results = this.ExecPagedViewResult<TOut>(entityName, predicate, sortExpressions.ToArray(), searchableColumns, request.Search.Value, request.Start, request.Length, paging);

        return new PagedList<TOut>(results, request.Start, results.RecordsCount, results.Count);
    }

    protected internal PagedList<TOut> GetPagedSProcResult<TOut>(IDataTablesRequest request, string entityName, dynamic param, bool paging = true)
                                                                                                                                where TOut : new()
    {
        var results = this.ExecPagedStoredProcedure<TOut>(entityName, param);
        return new PagedList<TOut>(results, request?.Start ?? 0, results?.RecordsCount ?? 0, results?.Count ?? 0);
    }

    protected internal PagedList<TOut> GetPagedSProcResultWithCriteria<TOut>(ViewEntities.SearchBaseCriteria criteria, string entityName, dynamic param, bool paging = true)
                                                                                                                               where TOut : new()
    {
        var results = this.ExecPagedStoredProcedure<TOut>(entityName, param);
        return new PagedList<TOut>(results, criteria?.OffsetStart ?? 0, results?.RecordsCount ?? 0, results?.Count ?? 0);
    }

    protected internal List<TOut> GetListStoredProcResult<TOut>(string entityName, dynamic param, bool paging = true)
                                                                                                                where TOut : new()
    {
        var results = this.ExecStoredProcedure<TOut>(entityName, param);
        return results;
    }

    protected internal PagedList<TOut> GetPagedSProcResult<TOut>(string entityName, dynamic param, bool paging = true)
                                                                                                    where TOut : new()
    {
        var results = this.ExecPagedStoredProcedure<TOut>(entityName, param);
        return new PagedList<TOut>(results, 0, results?.RecordsCount ?? 0, results?.Count ?? 0);
    }

    public static string DecryptId(string cipherText)
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

    public static string EncryptId(string plainText)
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

    public string GenerateOtp()
    {
        Random random = new Random();
        return random.Next(100000, 999999).ToString();
    }


    [NonAction]
    public string EncryptAES(string plainText, string key)
    {
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
