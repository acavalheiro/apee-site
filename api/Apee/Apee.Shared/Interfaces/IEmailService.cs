using Apee.Shared.Models;

namespace Apee.Shared.Interfaces;

public interface IEmailService
{
    Task SendContactEmailAsync(ContactRequest request, CancellationToken cancellationToken = default);
}
