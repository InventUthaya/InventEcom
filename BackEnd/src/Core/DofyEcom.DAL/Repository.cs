namespace DofyEcom.DAL;

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Dapper;
using DofyEcom.DAL.Extensions;
using DofyEcom.Helper;
using DofyEcom.DAL.Helpers;
using DofyEcom.DAL.Interfaces;
using Microsoft.Extensions.Options;
using DofyEcom.Helper.Extensions;
using DofyEcom.DBO;

/// <summary>
/// Repository to interact with the database, took it from
/// http://www.content ed coder.com/2012/12/creating-data-repository-using-dapper.html
/// </summary>
/// <typeparam name="T">represents entity object</typeparam>
public abstract class Repository<T> : IRepository<T>
                                        where T : EntityBase
{
    private readonly string tableName;
    private readonly ClaimsPrincipal principal;
    private string name;
    private readonly IOptionsSnapshot<AppConfiguration> config;
    private string dbName;
    private readonly string connectionString;
    protected internal string ConnectionString { get; protected set; }

    public Repository(string tableName, IOptionsSnapshot<AppConfiguration> iConfig, string connectionString = null)
    {
        this.tableName = tableName;
        this.config = iConfig;
        this.connectionString = connectionString;
    }

    public virtual IEnumerable<T> GetAll()
    {
        IEnumerable<T> items = null;
        using (DbConnection cn = this.Connection)
        {
            cn.Open();
            items = cn.Query<T>(this.tableName.ConstructInlineQuery<T>()).ToList();
            items = items.Where(item => item != null && item.IsValid);
        }

        return items;
    }

    public virtual long Add(T item)
    {
        using (DbConnection cn = this.Connection)
        {
            var parameters = (object)this.Mapping(item);
            cn.Open();
            item.Id = cn.Insert<long>(this.tableName, parameters);
            return item.Id;

        }
    }





    public virtual IEnumerable<long> AddBulk(List<T> item)
    {
        using (DbConnection cn = this.Connection)
        {
            var parameters = (object)this.Mapping(item.First());
            cn.Open();
            var items = cn.InsertBulk<long>(this.tableName, parameters, item);

            return items;
        }
    }

    public virtual void Update(T item)
    {
        if (item.ValidateConcurrentViolation())
        {
            using (DbConnection cn = this.Connection)
            {

                item.Modified = DateTimeExtensions.GetCurrentIST();
                var parameters = (object)this.Mapping(item);
                cn.Open();
                cn.Update(this.tableName, parameters);
            }
        }
    }

    public virtual void UpdateBulk(List<T> item)
    {
        if (item.ValidateConcurrentViolationList())
        {
            var currentTime = DateTimeExtensions.GetCurrentIST();
            using (DbConnection cn = this.Connection)
            {
                item.Select(itm => itm.Modified = currentTime);
                var parameters = (object)this.Mapping(item.FirstOrDefault());
                cn.Open();
                cn.UpdateBulk(this.tableName, parameters, item);
            }
        }
    }

    public virtual void Remove(T item)
    {
        if (item.ValidateConcurrentViolation())
        {
            this.Delete(item.Id);
        }
    }

    public virtual void Delete(long id)
    {
        using (DbConnection cn = this.Connection)
        {
            cn.Open();
            cn.Execute("DELETE FROM dbo." + this.tableName + " WHERE Id=@ID", new { ID = id });
        }
    }

    public virtual void DeleteByColumn(long id, string columnName)
    {
        using (DbConnection cn = this.Connection)
        {
            cn.Open();
            var idsToDelete = cn.Query<T>(this.tableName.ConstructInlineQuery<T>(columnName) + "=@ID", new { ID = id }).Select(item => item.Id);
            cn.Execute("DELETE FROM dbo." + this.tableName + " WHERE " + columnName + "=@ID", new { ID = id });
        }
    }

    public virtual void DeleteByIds(long[] ids, string columnName = "Id")
    {
        using (DbConnection cn = this.Connection)
        {
            cn.Open();
            cn.Execute("DELETE FROM dbo." + this.tableName + " WHERE " + columnName + " IN @Ids", new { Ids = ids });
        }
    }

    public virtual T FindById(long id)
    {
        T item = default(T);

        using (DbConnection cn = this.Connection)
        {
            cn.Open();
            item = cn.Query<T>(this.tableName.ConstructInlineQuery<T>("Id") + "=@ID", new { ID = id }).SingleOrDefault();
        }

        return item;
    }

    public virtual IEnumerable<T> FindByQuery(string query)
    {
        IEnumerable<T> items = null;

        using (DbConnection cn = this.Connection)
        {
            cn.Open();
            items = cn.Query<T>(query).ToList();
        }

        return items;
    }

    public virtual IEnumerable<T> FindByIds(IEnumerable<long> ids, string columnName = "Id")
    {
        IEnumerable<T> items = null;

        using (DbConnection cn = this.Connection)
        {
            cn.Open();
            items = cn.Query<T>(this.tableName.ConstructInlineQuery<T>(columnName) + " IN @Ids", new { Ids = ids }).ToList();
        }

        if (items != null && items.Count() > 0 && columnName.Equals("Id"))
        {
            items = items.Where(item => ids.Contains(item.Id));
        }

        return items;
    }

    public virtual IEnumerable<T> Find(Expression<Func<T, bool>> predicate)
    {
        IEnumerable<T> items = null;

        if (items == null || items.Count() == 0)
        {
            // extract the dynamic sql query and parameters from predicate
            QueryResult result = DynamicQuery.GetDynamicQuery<T>(this.tableName, predicate);
            using (DbConnection cn = this.Connection)
            {
               // cn.Close();
                cn.Open();
                items = cn.Query<T>(result.Sql, (object)result.Param).ToList();
            }
        }

        if (items != null && items.Count() > 0)
        {
            items = items.Where(predicate.Compile());
        }

        return items;
    }

    public virtual PagedList<T> GetAll(
                                    Expression<Func<T, bool>> predicate,
                                    SortExpression<T>[] sortExpressions,
                                    IEnumerable<string> searchColumns,
                                    string searcValue,
                                    int startIndex = 1,
                                    int itemsCount = 10,
                                    bool paging = true)
    {
        IEnumerable<T> items = null;
        int pageCount = default(int);

        // extract the dynamic sql query and parameters from predicate
        QueryResult result = DynamicQuery.GetDynamicPagedQuery<T>(this.tableName, predicate, sortExpressions, searchColumns, searcValue, startIndex, itemsCount, paging);
        QueryResult countResult = DynamicQuery.GetDynamicQuery<T>(this.tableName, predicate, countQuery: true);
        using (DbConnection cn = this.Connection)
        {
            cn.Open();
            items = cn.Query<T>(result.Sql, (object)result.Param);
            pageCount = cn.Query<int>(countResult.Sql, (object)result.Param).SingleOrDefault();
        }

        return new PagedList<T>(items, startIndex, pageCount, itemsCount);
    }

    public virtual PagedList<TOut> ExecPagedViewResult<TOut>(
                                                string viewName,
                                                Expression<Func<TOut, bool>> predicate,
                                                SortExpression<TOut>[] sortExpressions,
                                                IEnumerable<string> searchColumns,
                                                string searcValue,
                                                int startIndex = 1,
                                                int itemsCount = 10,
                                                bool paging = true)
    {
        IEnumerable<TOut> items = null;
        int pageCount = default(int);

        // extract the dynamic sql query and parameters from predicate
        QueryResult result = DynamicQuery.GetDynamicPagedQuery<TOut>(viewName, predicate, sortExpressions, searchColumns, searcValue, startIndex, itemsCount, paging);
        QueryResult countResult = DynamicQuery.GetDynamicPagedQuery<TOut>(viewName, predicate, sortExpressions, searchColumns, searcValue, startIndex, itemsCount, paging, true);
        using (DbConnection cn = this.Connection)
        {
            cn.Open();
            items = cn.Query<TOut>(result.Sql, (object)result.Param);
            pageCount = cn.Query<int>(countResult.Sql, (object)result.Param).SingleOrDefault();
        }

        return new PagedList<TOut>(items, startIndex, pageCount, itemsCount);
    }

    public virtual PagedList<TOut> ExecPagedStoredProcedure<TOut>(string procedureName, dynamic item)
    {
        using (DbConnection cn = this.Connection)
        {
            var parameters = (object)item;
            cn.Open();
            var result = cn.Query<TOut>(procedureName, parameters, commandTimeout: cn.ConnectionTimeout, commandType: CommandType.StoredProcedure).ToList();
            var pageCount = result.FirstOrDefault()?.GetPropertyValue("TotalRowsCount");
            return new PagedList<TOut>(result, 0, Convert.ToInt32(pageCount)); // assigning default start Index as params have the index details.
        }
    }

    public virtual IEnumerable<TOut> ExecStoredProcedure<TOut>(string procedureName, dynamic item)
    {
        using (DbConnection cn = this.Connection)
        {
            var parameters = (object)item;
            cn.Open();
            var result = cn.Query<TOut>(procedureName, parameters, commandTimeout: cn.ConnectionTimeout, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public virtual IEnumerable<TOut> ExecViewResult<TOut>(string procedureName, Expression<Func<TOut, bool>> predicate)
    {
        IEnumerable<TOut> items = null;
        QueryResult result = DynamicQuery.GetDynamicQuery<TOut>(procedureName, predicate);
        using (DbConnection cn = this.Connection)
        {
            cn.Open();
            items = cn.Query<TOut>(result.Sql, (object)result.Param, commandTimeout: cn.ConnectionTimeout).ToList();
        }

        return items;
    }

    public virtual TEntity ExecStoredProcedureQueryMultiple<TEntity, TMapper>(string procedureName, dynamic item)
                                                                                                                where TMapper : IMapper<TEntity>
    {
        using (DbConnection cn = this.Connection)
        {
            var parameters = (object)item;
            cn.Open();
            var result = cn.QueryMultiple(procedureName, parameters, commandTimeout: cn.ConnectionTimeout, commandType: CommandType.StoredProcedure);
            var mappedResult = Activator.CreateInstance<TMapper>().Map(result);

            return mappedResult;
        }
    }

    public virtual async Task<IEnumerable<TOut>> ExecStoredProcedureAsync<TOut>(string procedureName)
    {
        return await this.ExecStoredProcedureAsync<TOut>(procedureName, null);
    }

    public virtual async Task<IEnumerable<TOut>> ExecStoredProcedureAsync<TOut>(string procedureName, dynamic item)
    {
        using (DbConnection cn = this.Connection)
        {
            var parameters = (object)item;
            cn.Open();
            var result = await cn.QueryAsync<TOut>(procedureName, parameters, commandTimeout: cn.ConnectionTimeout, commandType: CommandType.StoredProcedure);
            return result.ToList();
        }
    }

    public async virtual Task ExecuteNonQuery(string connectionString, string scripts)
    {
        string[] qsplit = null;
        Regex r = new Regex(@"^GO\s|\sGO\s|\sGO$", RegexOptions.Multiline | RegexOptions.IgnoreCase);
        qsplit = r.Split(scripts);

        using (SqlConnection cn = this.CustomeConnection(connectionString))
        {
            cn.Open();
            foreach (string s in r.Split(scripts))
            {
                if (string.IsNullOrEmpty(s.Trim()))
                {
                    continue;
                }

                using (var command = new SqlCommand(s.Trim(), cn))
                {
                    await command.ExecuteNonQueryAsync();
                }
            }
        }
    }

    public virtual async Task<IEnumerable<TOut>> ExecStoredProcedure<TOut>(string connectionstring, string procedureName, dynamic item)
    {
        using (DbConnection cn = this.CustomeConnection(connectionstring))
        {
            var parameters = (object)item;
            cn.Open();
            var result = await cn.QueryAsync<TOut>(procedureName, parameters, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public void UpdateCompanyLogo(string connectionstring, string emailId, byte[] logo, string mimeType)
    {
        using (DbConnection cn = this.CustomeConnection(connectionstring))
        {
            cn.Open();
            var attachmentId = cn.QuerySingle<int>("INSERT into dbo.Attachment(Data, MimeType, Active) OUTPUT INSERTED.[Id] VALUES (@Logo, @MimeType, @Active)", new { @Logo = logo, @MimeType = mimeType, @Active = true });
            cn.Execute("UPDATE dbo.COMPANY SET AttachmentId = @attachId, IsDefault = @default WHERE EmailId=@Id", new { @attachId = attachmentId, @default = true, @Id = emailId });
        }
    }

    internal DbConnection Connection
    {
        get
        {
            return new SqlConnection(this.connectionString);
        }
    }

    internal SqlConnection CustomeConnection(string customConnectionString)
    {
        return new SqlConnection(customConnectionString);
    }

    internal virtual dynamic Mapping(T item)
    {
        return item;
    }
}
