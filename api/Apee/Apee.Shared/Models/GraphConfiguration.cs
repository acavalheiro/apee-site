namespace Apee.Shared.Models;

public record GraphConfiguration
{
    public required string TenantId       { get; init; }
    public required string ClientId       { get; init; }
    public required string ClientSecret   { get; init; }
    /// <summary>UPN or object-id of the shared mailbox (e.g. contacto@school.pt)</summary>
    public required string SharedMailbox  { get; init; }
    /// <summary>Where the contact form emails land (e.g. admin@school.pt)</summary>
    public required string RecipientEmail { get; init; }
}
