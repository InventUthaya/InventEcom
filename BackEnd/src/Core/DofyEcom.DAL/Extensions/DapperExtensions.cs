namespace DofyEcom.DAL.Extensions;

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Reflection;
using Dapper;
using DOFY.DBO.Extensions;
using DofyEcom.DBO;
using DofyEcom.Helper.Attributes;

public static class DapperExtensions
{
    public static T Insert<T>(this DbConnection cnn, string tableName, dynamic param)
    {
        IEnumerable<T> result = SqlMapper.Query<T>(cnn, DynamicQuery.GetInsertQuery(tableName, param), param);
        return result.First();
    }

    public static dynamic InsertBulk<T>(this DbConnection cnn, string tableName, dynamic param, dynamic items)
    {
        var trans = cnn.BeginTransaction();
        cnn.Query("CREATE TABLE ##Inserted (Id BIGINT);", transaction: trans);
        SqlMapper.Execute(cnn, DynamicQuery.GetInsertBulkQuery(tableName, param), DynamicQuery.RemoveDefaultDateTimeValuesList(items), transaction: trans);
        var ids = cnn.Query<T>("SELECT Id FROM ##Inserted", transaction: trans);
        cnn.Query("DROP TABLE ##Inserted ", transaction: trans);
        trans.Commit();

        return ids;
    }

    public static void Update(this DbConnection cnn, string tableName, dynamic param)
    {
        SqlMapper.Execute(cnn, DynamicQuery.GetUpdateQuery(tableName, param), param);
    }

    public static void UpdateBulk(this DbConnection cnn, string tableName, dynamic param, dynamic items)
    {
        SqlMapper.Execute(cnn, DynamicQuery.GetUpdateQuery(tableName, param), DynamicQuery.RemoveDefaultDateTimeValuesList(items));
    }

    public static T ExecStoredProcedure<T>(this DbConnection cnn, string procedureName, dynamic param)
    {
        IEnumerable<T> result = SqlMapper.Query<T>(cnn, procedureName, param, commandType: CommandType.StoredProcedure);
        return result.First();
    }

    public static PropertyInfo[] GetValidTableColumns(this PropertyInfo[] props)
    {
        var validProps = props.Where(s => !s.Name.Equals("Id")
                        && s.CustomAttributes.Count(ca => ca.AttributeType.Equals(typeof(DBIgnoreAttribute))) == 0).ToArray();

        return validProps;
    }


    /// <summary>
    /// ReBuilding the entity object to ignore DBIgnore properties.
    /// </summary>
    /// <typeparam name="T">Object type</typeparam>
    /// <param name="item">object which contains all the properties</param>
    /// <returns>Returns valid item by ignoring DBIgnore properties</returns>
    public static T ReBuildEntity<T>(this T item)
    {
        var result = Activator.CreateInstance<T>();
        if (item != null)
        {
            var validProperties = result.GetType().GetProperties().Where(s => s.CustomAttributes.Count(ca => ca.AttributeType.Equals(typeof(DBIgnoreAttribute))) == 0);
            foreach (var property in validProperties)
            {
                var propertySource = item.GetType().GetProperty(property.Name);
                if (propertySource != null && propertySource.CanRead)
                {
                    property.SetValue(result, propertySource.GetValue(item));
                }
            }
        }

        return result;
    }

    public static string GetValidSelectColumns<T>(this string tableName)
    {
        var objectType = tableName.GetEntityType<T>();
        if (objectType != null)
        {
            var validProps = objectType.GetProperties().Where(s => s != null
                            && s.CustomAttributes.Count(ca => ca.AttributeType.Equals(typeof(DBIgnoreAttribute))) == 0).ToArray();

            if (validProps != null && validProps.Count() > 0)
            {
                return string.Concat("[", string.Join("], [", validProps.Select(prop => prop.Name)), "]");
            }
        }

        // when it has no entity present in the DBO object.
        return " * ";
    }

    public static string ConstructInlineQuery<T>(this string tableName, string conditions = "")
    {
        var query = string.Concat("SELECT ", tableName.GetValidSelectColumns<T>(), " FROM dbo.[", tableName, "] (NOLOCK)");
        query = string.Concat(query, string.IsNullOrEmpty(conditions) ? string.Empty : " WHERE " + conditions);

        return query;
    }

    public static object GetPropertyValue<T>(this T target, string propertyName)
    {
        PropertyInfo propertyInfo = target.GetType().GetProperty(propertyName);
        if (propertyInfo != null)
        {
            return propertyInfo.GetValue(target);
        }

        return default(object);
    }

    public static bool ValidateConcurrentViolation<T>(this T item)
                                                    where T : EntityBase
    {
        object sync = new object();

        lock (sync)
        {
            // Todo when actual concurrency validator implemented.
            if (item.IsValid && item.Id > 0)
            {
                return true;
            }
        }

        return false;

        // throw new DBConcurrencyException();
    }


    public static bool ValidateConcurrentViolationList<T>(this List<T> item)
    {
        object sync = new object();
        foreach (T itm in item)
        {
            if (!Convert.ToBoolean(itm.GetPropertyValue("IsValid")) || Convert.ToDouble(itm.GetPropertyValue("Id")) == 0)
            {
                return false;
            }
        }

        return true;
    }
}
