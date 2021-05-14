using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace Symposium.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args)
                .Build()
                .Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((hostingContext, config) =>
                {
                    var configRootPath = Environment.GetEnvironmentVariable("CONFIG_ROOT") ?? "/Configs";
                    config.AddJsonFile($"{configRootPath}/appsettings.json", false, true);
                    config.AddEnvironmentVariables();
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder
                        .UseUrls($"http://0.0.0.0:{(args.Length >= 1 ? args[0] : "80")}")
                        .UseStartup<Startup>();
                });
    }
}
