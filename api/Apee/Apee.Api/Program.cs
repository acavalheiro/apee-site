using Apee.Shared.Captcha;
using Apee.Shared.Email;
using Apee.Shared.Interfaces;
using Apee.Shared.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureAppConfiguration((ctx, config) =>
    {
        config.AddJsonFile("appsettings.json", optional: true, reloadOnChange: false);
        config.AddJsonFile($"appsettings.{ctx.HostingEnvironment.EnvironmentName}.json", optional: true, reloadOnChange: false);
        config.AddEnvironmentVariables();
    })
    .ConfigureServices((ctx, services) =>
    {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();

        services.AddHttpClient();

        services.Configure<TurnstileConfiguration>(ctx.Configuration.GetSection("Turnstile"));
        services.Configure<GraphConfiguration>(ctx.Configuration.GetSection("Graph"));

        services.AddSingleton<ICaptchaService, TurnstileService>();
        services.AddSingleton<IEmailService, GraphEmailService>();
    })
    .Build();

host.Run();
