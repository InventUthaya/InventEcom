namespace DofyEcom.Cache
{
    using System.Collections.Generic;

    public abstract class CacheProvider<TCache> : ICacheProvider
    {
        private readonly int defaultCacheDurationInMinutes = 30;

        public CacheProvider()
        {
            this.CacheDuration = this.defaultCacheDurationInMinutes;
            this.Cache = this.InitCache();
        }

        public CacheProvider(int durationInMinutes)
        {
            this.CacheDuration = durationInMinutes;
            this.Cache = this.InitCache();
        }

        public int CacheDuration { get; set; }

        protected TCache Cache { get; set; }

        public abstract bool Get<T>(string key, out T value);

        public abstract void Set<T>(string key, T value);

        public abstract void Set<T>(string key, T value, int duration);

        public abstract void Clear(string key);

        public abstract bool Exists(string key);

        public abstract IEnumerable<KeyValuePair<string, object>> GetAll();

        public abstract void FlushAll();

        protected abstract TCache InitCache();
    }
}