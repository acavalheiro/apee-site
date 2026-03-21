using System.Net;
using Apee.Shared.Interfaces;
using Apee.Shared.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Apee.Api;

public class ContactFunction(
    ILogger<ContactFunction> logger,
    ICaptchaService captchaService,
    IEmailService emailService)
{
    [Function("contact")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "contact")] HttpRequest httpRequest,
        CancellationToken cancellationToken)
    {
        ContactRequest? contactRequest;

        try
        {
            contactRequest = await httpRequest.ReadFromJsonAsync<ContactRequest>(cancellationToken: cancellationToken);
        }
        catch
        {
            return BadRequest("Invalid request body.");
        }

        if (contactRequest is null
            || string.IsNullOrWhiteSpace(contactRequest.FirstName)
            || string.IsNullOrWhiteSpace(contactRequest.Email)
            || string.IsNullOrWhiteSpace(contactRequest.Message)
            || string.IsNullOrWhiteSpace(contactRequest.TurnstileToken))
        {
            return BadRequest("Missing required fields.");
        }

        var remoteIp = httpRequest.Headers["CF-Connecting-IP"].FirstOrDefault()
                    ?? httpRequest.HttpContext.Connection.RemoteIpAddress?.ToString();

        var captchaValid = await captchaService.VerifyAsync(
            new CaptchaValidationRequest { Token = contactRequest.TurnstileToken, Ip = remoteIp },
            cancellationToken);

        if (!captchaValid)
        {
            logger.LogWarning("Turnstile verification failed for {Email}", contactRequest.Email);
            return new ObjectResult(new { success = false, message = "CAPTCHA verification failed." })
            {
                StatusCode = (int)HttpStatusCode.BadRequest
            };
        }

        try
        {
            await emailService.SendContactEmailAsync(contactRequest, cancellationToken);
            logger.LogInformation("Contact email sent from {Email}", contactRequest.Email);
            return new OkObjectResult(new { success = true });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send contact email from {Email}", contactRequest.Email);
            return new ObjectResult(new { success = false, message = "Failed to send message. Please try again later." })
            {
                StatusCode = (int)HttpStatusCode.InternalServerError
            };
        }
    }

    private static BadRequestObjectResult BadRequest(string message) =>
        new(new { success = false, message });
}
