using Apee.Shared.Models;

namespace Apee.Shared.Interfaces;

public interface ICaptchaService
{
    Task<bool> VerifyAsync(CaptchaValidationRequest request, CancellationToken cancellationToken = default);
}

