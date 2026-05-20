namespace DofyEcom.Logger
{
    using Microsoft.Extensions.Configuration;
    using Serilog;
    using Serilog.Core;
    using Serilog.Events;

    public static class SeriLogger
    {
        public static IConfiguration Configuration { get; set; }
        public static string HostingEnvironment = "Hosting:Environment";
        public enum HostingEnvironment_ENUM
        {
            Development,
            Staging,
            Production
        }

        /// <summary>
        /// Serilog Configuration, Startup Method Call
        /// </summary>
        /// <param name="configuration">Application Configuration</param>
        /// <param name="serviceName">Windows Service Name</param>
        public static void LoggingConfiguration(IConfiguration configuration, string serviceName)
        {
            Configuration = configuration;

            // creating logging Configuration.
            if (!string.IsNullOrEmpty(Convert.ToString(configuration["Logging:LogsWriteToSeqURL"])))
            {
                string loggingURL = Convert.ToString(configuration["Logging:LogsWriteToSeqURL"]);
                LoggingLevelSwitch levelSwitch = new LoggingLevelSwitch();

                Log.Logger = new LoggerConfiguration()
                                .MinimumLevel.ControlledBy(levelSwitch)
                                .MinimumLevel.Is(LogEventLevel.Information)
                                .MinimumLevel.Override("Marvin.Cache.Headers", LogEventLevel.Warning)
                                .MinimumLevel.Override("Default", LogEventLevel.Warning)
                                .MinimumLevel.Override("System", LogEventLevel.Warning)
                                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                                .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
                                .Enrich.FromLogContext()
                                .Enrich.WithProperty("ApplicationName", serviceName)
                                .Enrich.WithProperty("ServiceName", serviceName)
                                 .WriteTo.Seq(loggingURL, controlLevelSwitch: levelSwitch)
                        .CreateLogger();
            }
            else if (Convert.ToBoolean(configuration["Logging:LogsWriteToFile"]))
            {
                string loggingPath = Convert.ToString(configuration["Logging:LogFilePath"]);
                Log.Logger = new LoggerConfiguration()
                                .MinimumLevel.Is(LogEventLevel.Information)
                                .MinimumLevel.Override("Marvin.Cache.Headers", LogEventLevel.Warning)
                                .MinimumLevel.Override("Default", LogEventLevel.Warning)
                                .MinimumLevel.Override("System", LogEventLevel.Warning)
                                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                                .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
                                .Enrich.FromLogContext()
                                .WriteTo.File(Path.Combine(loggingPath, string.Concat(serviceName, "_.txt")), LogEventLevel.Debug, rollingInterval: RollingInterval.Day,
                                    outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level}] [TraceId:{TraceId}]- {Message}{NewLine}{Exception}")
                                .WriteTo.Console(LogEventLevel.Information)
                                .CreateLogger();
            }
        }

        /// <summary>
        /// Custom Serilog Dubug Implementation
        /// </summary>
        /// <param name="message">Log Message Text</param>
        /// <param name="traceId">TraceId</param>
        public static void Debug(string message, string traceId = null)
        {
            Log.ForContext("TraceId", traceId).Debug(message);
        }

        /// <summary>
        /// Custom Serilog Information Implementation
        /// </summary>
        /// <param name="message">Log Message Text</param>
        /// <param name="traceId">TraceId</param>
        public static void Information(string message, string traceId = null)
        {
            Log.ForContext("TraceId", traceId).Information(message);
        }

        /// <summary>
        /// Custom Serilog Warning Implementation
        /// </summary>
        /// <param name="message">Log Message Text</param>
        /// <param name="traceId">TraceId</param>
        public static void Warning(string message, string traceId = null)
        {
            Log.ForContext("TraceId", traceId).Warning(message);
        }

        /// <summary>
        /// Custom Serilog Error Implementation
        /// </summary>
        /// <param name="exception">Exception</param>
        /// <param name="message">Log Message Text</param>
        /// <param name="traceId">TraceId</param>
        public static void Error(Exception exception, string message, string traceId = null)
        {
            Log.ForContext("TraceId", traceId).Error(exception, message);
        }

        /// <summary>
        /// Custom Serilog Fatal Implementation
        /// </summary>
        /// <param name="exception">Exception</param>
        /// <param name="message">Log Message Text</param>
        /// <param name="traceId">TraceId</param>
        public static void Fatal(Exception exception, string message, string traceId = null)
        {
            Log.ForContext("TraceId", traceId).Fatal(exception, message);
        }
    }
}