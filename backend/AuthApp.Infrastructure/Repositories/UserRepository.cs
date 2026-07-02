using AuthApp.Application.Interfaces;
using AuthApp.Domain.Entities;
using AuthApp.Infrastructure.Data;
using Dapper;

namespace AuthApp.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly DapperContext _context;

    public UserRepository(DapperContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        //var query = "SELECT * FROM Users WHERE Email = @Email";
        var query = @"
                    SELECT
                        id AS Id,
                        first_name AS FirstName,
                        last_name AS LastName,
                        email AS Email,
                        password_hash AS PasswordHash,
                        role AS Role,
                        is_active AS IsActive,
                        created_at AS CreatedAt
                    FROM users
                    WHERE email = @Email;
                    ";

        using var connection = _context.CreateConnection();
        return await connection.QueryFirstOrDefaultAsync<User>(query, new { Email = email });
    }

    public async Task<int> CreateUserAsync(User user)
    {
        //var query = @"
        //    INSERT INTO Users (FirstName, LastName, Email, PasswordHash, Role, IsActive, CreatedAt)
        //    VALUES (@FirstName, @LastName, @Email, @PasswordHash, @Role, @IsActive, @CreatedAt);
        //    SELECT CAST(SCOPE_IDENTITY() as int);
        //";

        var query = @"
                INSERT INTO users 
                (first_name, last_name, email, password_hash, role, is_active, created_at)
                VALUES 
                (@FirstName, @LastName, @Email, @PasswordHash, @Role, @IsActive, @CreatedAt);

                SELECT LAST_INSERT_ID();
         ";

        using var connection = _context.CreateConnection();
        return await connection.QuerySingleAsync<int>(query, user);
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        var query = "SELECT * FROM Users WHERE Id = @Id";

        using var connection = _context.CreateConnection();
        return await connection.QueryFirstOrDefaultAsync<User>(query, new { Id = id });
    }
}