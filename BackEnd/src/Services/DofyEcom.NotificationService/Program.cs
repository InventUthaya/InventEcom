namespace DofyEcom.NotificationService
{
    using DOFY.NotificationService;
    using DofyEcom.Helper;
    using DofyEcom.Logger;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.PlatformAbstractions;
    using Serilog;

    public class Program
    {
        public static IConfigurationRoot Configuration { get; set; }

        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseWindowsService()
                .ConfigureServices((hostContext, services) =>
                {
                    string applicationBasePath = PlatformServices.Default.Application.ApplicationBasePath;
                    IConfigurationBuilder builder = new ConfigurationBuilder()
                                                .SetBasePath(applicationBasePath)
                                                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                                                .AddEnvironmentVariables();

                    Configuration = builder.Build();

                    services.AddOptions()
                       .Configure<AppConfiguration>(Configuration)
                       .AddTransient<IConfiguration>(item => Configuration);
                    services.AddLogging();

                    ServiceProvider serviceProvider = services.BuildServiceProvider();
                    ILoggerFactory loggerFactory = serviceProvider.GetRequiredService<ILoggerFactory>();
                    loggerFactory.AddSerilog();

                    SeriLogger.LoggingConfiguration(Configuration, typeof(Program).Namespace);
                    services.AddHostedService<NotificationSenderService>();
                });
    }
}
