using Apee.Shared.Models;

namespace Apee.Shared.Interfaces;

interface ICaptchaService
{
    Task<bool> VerifyAsync(CaptchaValidationRequest request, CancellationToken cancellationToken = default);
}

