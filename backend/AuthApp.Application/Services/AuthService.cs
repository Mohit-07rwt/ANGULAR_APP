using AuthApp.Application.DTOs.Request;
using AuthApp.Application.DTOs.Response;
using AuthApp.Application.Helpers;
using AuthApp.Application.Interfaces;
using AuthApp.Domain.Entities;

namespace AuthApp.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthService(IUserRepository userRepository, IJwtTokenService jwtTokenService)
    {
        _userRepository = userRepository;
        _jwtTokenService = jwtTokenService;
    }

    // REGISTER
    public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);

        if (existingUser != null)
        {
            throw new Exception("User already exists");
        }

        var hashedPassword = PasswordHasher.HashPassword(request.Password);

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PasswordHash = hashedPassword,
            Role = "User",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var userId = await _userRepository.CreateUserAsync(user);

        return new RegisterResponse
        {
            Id = userId,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role,
            Token = "" // JWT will come next step
        };
    }

    // LOGIN (temporary stub for now)
    //public async Task<LoginResponse> LoginAsync(LoginRequest request)
    //{
    //    var user = await _userRepository.GetByEmailAsync(request.Email);

    //    if (user == null)
    //        throw new Exception("Invalid credentials");

    //    var isValidPassword = PasswordHasher.VerifyPassword(request.Password, user.PasswordHash);

    //    if (!isValidPassword)
    //        throw new Exception("Invalid credentials");

    //    return new LoginResponse
    //    {
    //        Id = user.Id,
    //        Email = user.Email,
    //        Role = user.Role,
    //        Token = "" // JWT will be added next step
    //    };
    //}


    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user == null)
            throw new Exception("USER NOT FOUND");
        Console.WriteLine("================================");
        Console.WriteLine($"Email: {request.Email}");
        Console.WriteLine($"Input Password: {request.Password}");
        Console.WriteLine($"PasswordHash From DB: {user.PasswordHash}");
        Console.WriteLine($"Hash Length: {user.PasswordHash.Length}");

        bool isValid= PasswordHasher.VerifyPassword(request.Password, user.PasswordHash);

        Console.WriteLine($"Password Valid: {isValid}");
        Console.WriteLine("================================");

        //var isValid = PasswordHasher.VerifyPassword(request.Password, user.PasswordHash);

        if (!isValid)
            throw new Exception("PASSWORD INVALID");

        return new LoginResponse
        {
            Id = user.Id,
            Email = user.Email,
            Role = user.Role,
            Token = _jwtTokenService.GenerateToken(user)
        };
    }


}