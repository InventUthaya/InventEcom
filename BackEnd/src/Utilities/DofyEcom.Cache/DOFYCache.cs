namespace DofyEcom.Cache
{
    using System.Collections.Generic;
    using System.Linq;
    using DBO;

    public static class DOFYCache<T>
                            where T : EntityBase
    {
        private const int MINUTESINDAY = 1440;
        private static readonly ICacheProvider Cache = new InMemoryCacheService();

        public static IEnumerable<T> GetAllEntities()
        {
            Dictionary<long, T> results = null;
            Cache.Get<Dictionary<long, T>>(typeof(T).Name, out results);

            if (results != null && results.Count() > 0)
            {
                return results.Select(item => item.Value);
            }

            return null;
        }

        public static T GetEntity(long id)
        {
            Dictionary<long, T> results = null;
            Cache.Get<Dictionary<long, T>>(typeof(T).Name, out results);

            if (results != null && results.Count > 0 && results.ContainsKey(id))
            {
                return results[id];
            }

            return null;
        }

        public static void AddUpdateEntities(IEnumerable<T> items)
        {
            Dictionary<long, T> lstItems = new Dictionary<long, T>(items.ToDictionary(item => item.Id, item => item));
            Cache.Clear(typeof(T).Name);
            Cache.Set<Dictionary<long, T>>(typeof(T).Name, lstItems, MINUTESINDAY);
        }

        public static void AddUpdateEntity(T item)
        {
            Dictionary<long, T> lstResults = null;
            Cache.Get<Dictionary<long, T>>(typeof(T).Name, out lstResults);

            if (lstResults == null)
            {
                lstResults = new Dictionary<long, T>();
            }

            lstResults[item.Id] = item;
            Cache.Set<Dictionary<long, T>>(typeof(T).Name, lstResults, MINUTESINDAY);
        }

        public static void RemoveEntity(T item)
        {
            RemoveEntity(item.Id);
        }

        public static void RemoveEntity(long id)
        {
            Dictionary<long, T> lstResults = new Dictionary<long, T>();
            Cache.Get<Dictionary<long, T>>(typeof(T).Name, out lstResults);

            if (lstResults != null && lstResults.Count > 0 && lstResults.ContainsKey(id))
            {
                lstResults.Remove(id);
            }
        }

        public static void FlushCache()
        {
            if (Cache != null)
            {
                Cache.FlushAll();
            }
        }
    }
}