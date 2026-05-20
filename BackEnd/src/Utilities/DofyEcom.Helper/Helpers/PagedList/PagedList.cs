namespace DofyEcom.Helper
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;
    using Newtonsoft.Json;

    [JsonObject]
    public class PagedList<T> : IEnumerable<T>, IPagedList
    {
        private readonly List<T> subset = new List<T>();

        public PagedList(IEnumerable<T> list, int pageNumber, int recordsCount, int? pageSize = 10)
        {
            this.subset.AddRange(list);

            this.PageNumber = pageNumber;
            this.PageSize = pageSize ?? 10;
            this.RecordsCount = recordsCount;
            this.Items = this.subset;
        }

        public PagedList()
        {
            this.subset = new List<T>();
        }

        public int RecordsCount { get; set; }

        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public int Count
        {
            get { return this.Items.Count(); }
        }

        public int PageCount
        {
            get
            {
                return this.RecordsCount > 0
                            ? (int)Math.Ceiling(this.RecordsCount / (double)this.PageSize)
                            : 0;
            }
        }

        public bool IsFirstPage
        {
            get { return this.PageNumber == 1; }
        }

        public bool HasPreviousPage
        {
            get { return this.PageNumber > 1; }
        }

        public bool HasNextPage
        {
            get { return this.PageNumber < this.PageCount; }
        }

        public bool IsLastPage
        {
            get { return this.PageCount == this.PageCount; }
        }

        public IEnumerable<T> Items { get; set; }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }

        public IEnumerator<T> GetEnumerator()
        {
            return this.subset.GetEnumerator();
        }
    }
}
