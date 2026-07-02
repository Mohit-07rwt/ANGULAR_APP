using AuthApp.Domain.Entities;

namespace AuthApp.Application.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}