using Apee.Shared.Interfaces;
using Apee.Shared.Models;
using Azure.Identity;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using Microsoft.Graph.Users.Item.SendMail;

namespace Apee.Shared.Email;

public class GraphEmailService(IOptions<GraphConfiguration> options) : IEmailService
{
    private readonly GraphConfiguration _config = options.Value;

    public async Task SendContactEmailAsync(ContactRequest request, CancellationToken cancellationToken = default)
    {
        var credential = new ClientSecretCredential(
            _config.TenantId,
            _config.ClientId,
            _config.ClientSecret);

        var graphClient = new GraphServiceClient(credential, ["https://graph.microsoft.com/.default"]);

        var fullName = string.IsNullOrWhiteSpace(request.LastName)
            ? request.FirstName
            : $"{request.FirstName} {request.LastName}";

        var subject = string.IsNullOrWhiteSpace(request.Subject)
            ? $"[Contact] {fullName}"
            : $"[Contact] {request.Subject}";

        var body = $"""
            <p><strong>Name:</strong> {fullName}</p>
            <p><strong>Email:</strong> {request.Email}</p>
            <p><strong>Subject:</strong> {request.Subject ?? "(not specified)"}</p>
            <hr/>
            <p>{request.Message.Replace("\n", "<br/>")}</p>
            """;

        var message = new Message
        {
            Subject = subject,
            Body    = new ItemBody
            {
                ContentType = BodyType.Html,
                Content     = body,
            },
            ToRecipients =
            [
                new Recipient
                {
                    EmailAddress = new EmailAddress { Address = _config.RecipientEmail }
                }
            ],
            ReplyTo =
            [
                new Recipient
                {
                    EmailAddress = new EmailAddress
                    {
                        Address = request.Email,
                        Name    = fullName,
                    }
                }
            ],
        };

        await graphClient.Users[_config.SharedMailbox].SendMail.PostAsync(
            new SendMailPostRequestBody { Message = message, SaveToSentItems = false },
            cancellationToken: cancellationToken);
    }
}
