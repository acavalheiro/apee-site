namespace Apee.Shared.Models;

public record TurnstileConfiguration(string SecretKey, string Url);

public record CaptchaValidationRequest
{
    public required string Token { get; init; }
    public string? Ip { get; set; }
}


public record TurnstileValidationResponse(
    bool Success,
    string ChallengTs,
    string Hostname,
    List<string> ErrorCodes,
    string Action,
    string? Cdata = null,
    TurnstileMetadata? Metadata = null
);

public record TurnstileMetadata(string EphemeralId);
