namespace DofyEcom.Helper.Helpers
{
    using Microsoft.AspNetCore.Http;
    using Newtonsoft.Json;

    [JsonObject]
    public class PostedFileEntity<T>
    {
        public PostedFileEntity()
        {
        }

        public T Entity { get; set; }

        public IFormFileCollection PostedItem { get; set; }
    }
}
