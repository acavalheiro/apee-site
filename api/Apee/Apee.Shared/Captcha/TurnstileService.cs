using System.Net.Http.Json;
using Apee.Shared.Interfaces;
using Apee.Shared.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Apee.Shared.Captcha;

public class TurnstileService(
        ILogger<TurnstileService> logger,
        IHttpClientFactory httpClientFactory,
        IOptions<TurnstileConfiguration> configuration)
        : ICaptchaService
    {
        private readonly ILogger<TurnstileService> _logger = logger;
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly TurnstileConfiguration _configuration = configuration.Value;

        public async Task<bool> VerifyAsync(CaptchaValidationRequest request, CancellationToken cancellationToken = default)
        {
            try
            {
                var parameters = new Dictionary<string, string>
                {
                    { "secret", _configuration.SecretKey },
                    { "response", request.Token }
                };

                if (!string.IsNullOrEmpty(request.Ip))
                    parameters.Add("remoteip", request.Ip);
                

                var postContent = new FormUrlEncodedContent(parameters);

                var httpClient = _httpClientFactory.CreateClient();
                var response = await httpClient.PostAsync(_configuration.Url, postContent, cancellationToken);
                response.EnsureSuccessStatusCode();
                
                var validationResponse = await response.Content.ReadFromJsonAsync<TurnstileValidationResponse>(cancellationToken: cancellationToken);

                return validationResponse?.Success ?? false;
               
            }
            catch (Exception e)
            {
                _logger.LogError(e,e.Message);
                
            }
            return false;  
        }
    }

