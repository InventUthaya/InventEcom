using System.Linq.Expressions;
using Core = DataTables.AspNet.Core;

namespace DofyEcom.Helper
{
    public static class DataTableExtensions
    {
        public static IList<SortExpression<T>> ConstructSortExpressions<T>(this IOrderedEnumerable<Core.IColumn> columnsToSort)
                                                                    where T : new()
        {
            if (columnsToSort == null)
            {
                return default(IList<SortExpression<T>>);
            }

            var sortExpressions = new List<SortExpression<T>>();
            foreach (var item in columnsToSort)
            {
                sortExpressions.Add(ExtractExpression<T>(item.Field, item.Sort.Direction));
            }

            return sortExpressions;
        }

        /// <summary>
        /// Get sorted columns on client-side already on the same order as the client requested.
        /// The method checks if the column is bound and if it's ordered on client-side.
        /// </summary>
        /// <returns>The ordered enumeration of sorted columns.</returns>
        public static IOrderedEnumerable<Core.IColumn> GetSortedColumns(this IEnumerable<Core.IColumn> columns)
        {
            return columns
                .Where(column => !string.IsNullOrWhiteSpace(column.Field) && column.Sort != null)
                .OrderBy(c => c.Sort.Order);
        }

        ////public static IDataTablesResponse CreateDataTablesResponse<T>(this IDataTablesRequest request, PagedList<T> result)
        ////{
        ////    var response = DataTablesResponse.Create(request, result.RecordsCount, result.RecordsCount, result.Items);

        ////    return response;
        ////}

        private static SortExpression<T> ExtractExpression<T>(string propertyName, Core.SortDirection direction)
        {
            var param = Expression.Parameter(typeof(T));
            var sortExpression = Expression.Lambda<Func<T, object>>(Expression.Convert(Expression.Property(param, propertyName), typeof(object)), param);

            return new SortExpression<T>(sortExpression, direction.Equals(Core.SortDirection.Ascending) ? SortDirection.Ascending : SortDirection.Descending);
        }
    }
}
