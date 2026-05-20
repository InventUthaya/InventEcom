namespace DofyEcom.Cache
{
    using System.Collections.Generic;

    public interface ICacheProvider
    {
        /// <summary>
        /// Retrieve cached item
        /// </summary>
        /// <typeparam name="T">Type of cached item</typeparam>
        /// <param name="key">Name of cached item</param>
        /// <param name="value">Cached value. Default(T) if
        /// item doesn't exist.</param>
        /// <returns>Cached item as type</returns>
        bool Get<T>(string key, out T value);

        /// <summary>
        /// Insert value into the cache using
        /// appropriate name/value pairs.
        /// </summary>
        /// <typeparam name="T">Type of cached item</typeparam>
        /// <param name="key">Item to be cached</param>
        /// <param name="value">Name of item</param>
        void Set<T>(string key, T value);

        /// <summary>
        /// Insert value into the cache using
        /// appropriate name/value pairs WITH a cache duration set in minutes
        /// </summary>
        /// <typeparam name="T">Type of cached item</typeparam>
        /// <param name="key">Item to be cached</param>
        /// <param name="value">Name of item</param>
        /// <param name="duration">Cache duration in minutes</param>
        void Set<T>(string key, T value, int duration);

        /// <summary>
        /// Remove item from cache
        /// </summary>
        /// <param name="key">Name of cached item</param>
        void Clear(string key);

        /// <summary>
        /// Tells whether an item with a key exists in the cache.
        /// </summary>
        /// <param name="key">represents key value.</param>
        /// <returns>true if exists, else false.</returns>
        bool Exists(string key);

        /// <summary>
        /// get all cache entities from the cache.
        /// </summary>
        /// <returns>returns collection of cached entities.</returns>
        IEnumerable<KeyValuePair<string, object>> GetAll();

        /// <summary>
        /// clears all the entries from the cache.
        /// </summary>
        void FlushAll();
    }
}
