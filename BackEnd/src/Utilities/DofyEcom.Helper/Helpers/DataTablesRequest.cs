namespace DofyEcom.Helper.Helpers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using DataTables.AspNet.Core;
    using Newtonsoft.Json;

    [JsonObject]
    public class DataTablesRequest : IDataTablesRequest
    {
        public DataTablesRequest()
        {
        }

        public DataTablesRequest(int draw, int start, int length, DataTableSearch search, IList<DataTableColumn> columns)
            : this(draw, start, length, search, columns, null)
        {
        }

        public DataTablesRequest(int draw, int start, int length, DataTableSearch search, IList<DataTableColumn> columns, IDictionary<string, object> additionalParameters)
        {
            this.Draw = draw;
            this.Start = start;
            this.Length = length;
            this.Search = search;
            this.Columns = columns;
            this.AdditionalParameters = additionalParameters;
        }

        public IDictionary<string, object> AdditionalParameters { get; set; }

        public IList<DataTableColumn> Columns { get; set; }

        public int Draw { get; set; }

        public int Length { get; set; }

        public DataTableSearch Search { get; set; }

        public int Start { get; set; }

        ISearch IDataTablesRequest.Search
        {
            get
            {
                return new DataTableSearch(this.Search);
            }
        }

        IEnumerable<IColumn> IDataTablesRequest.Columns
        {
            get
            {
                var columns = this.Columns.Select(item =>
                {
                    var search = item.Search != null ? new DataTableSearch(item.Search) : null;
                    var sort = item.Sort != null ? new DataTableSort(item.Sort) : null;
                    var column = new DataTableColumn()
                    {
                        Name = item.Name,
                        Field = item.Field,
                        IsSearchable = item.IsSearchable,
                        IsSortable = item.IsSortable,
                        Search = search,
                        Sort = sort,
                    };

                    return column;
                });

                return columns;
            }
        }

        public class DataTableSort : ISort
        {
            public DataTableSort(ISort sort)
            {
                if (sort != null)
                {
                    this.Order = sort.Order;
                    this.Direction = sort.Direction;
                }
            }

            public int Order { get; set; }

            public DataTables.AspNet.Core.SortDirection Direction { get; set; }
        }

        public class DataTableSearch : ISearch
        {
            public DataTableSearch(ISearch search)
            {
                if (search != null)
                {
                    this.Value = search.Value;
                    this.IsRegex = search.IsRegex;
                }
            }

            public string Value { get; set; }

            public bool IsRegex { get; set; }
        }

        public class DataTableColumn : IColumn
        {
            public string Field { get; set; }

            public string Name { get; set; }

            public bool IsSearchable { get; set; }

            public bool IsSortable { get; set; }

            public DataTableSearch Search { get; set; }

            public DataTableSort Sort { get; set; }

            ISearch IColumn.Search
            {
                get
                {
                    return this.Search;
                }
            }

            ISort IColumn.Sort
            {
                get
                {
                    return this.Sort;
                }
            }

            public bool SetSort(int order, string direction)
            {
                this.Sort.Order = order;
                this.Sort.Direction = direction.ToLower().Contains("asc") ? DataTables.AspNet.Core.SortDirection.Ascending : DataTables.AspNet.Core.SortDirection.Descending;

                return true;
            }
        }
    }
}
