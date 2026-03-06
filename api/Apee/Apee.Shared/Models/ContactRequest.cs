namespace Apee.Shared.Models;

public record ContactRequest
{
    public required string FirstName      { get; init; }
    public string?         LastName       { get; init; }
    public required string Email          { get; init; }
    public string?         Subject        { get; init; }
    public required string Message        { get; init; }
    public required string TurnstileToken { get; init; }
}
