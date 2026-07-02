using AuthApp.Domain.Entities;

namespace AuthApp.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<int> CreateUserAsync(User user);
    Task<User?> GetByIdAsync(int id);
}