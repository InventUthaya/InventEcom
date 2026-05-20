using DofyEcom.Public.API;
using Microsoft.AspNetCore;

public class Program
{
    public static void Main(string[] args)
    {
        BuildWebHost(args).Run();
    }

    public static IWebHost BuildWebHost(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .UseContentRoot(Directory.GetCurrentDirectory())
            .UseUrls("http://localhost:5278")
            .UseIISIntegration()
            .UseStartup<Startup>()
            .Build();
}
