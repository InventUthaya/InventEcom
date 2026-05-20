namespace DofyEcom.Public.API.Helpers
{
    using System.IO;
    using Microsoft.AspNetCore.Hosting;

    public class AppDataHelper
    {
        private const string AppDataFolder = "App_Data";
        private readonly IHostingEnvironment hostingEnvironment;

        public AppDataHelper(IHostingEnvironment environment)
        {
            this.hostingEnvironment = environment;
        }

        public byte[] DownloadFile(string fileName)
        {
            var path = Path.Combine(this.hostingEnvironment.ContentRootPath, AppDataFolder, fileName);

            return File.ReadAllBytes(path);
        }
    }
}