using System.Security.Cryptography;

namespace AuthApp.Application.Helpers;

public static class PasswordHasher
{
    public static string HashPassword(string password)
    {
        byte[] salt = RandomNumberGenerator.GetBytes(16);

        using var pbkdf2 = new Rfc2898DeriveBytes(
            password,
            salt,
            10000,
            HashAlgorithmName.SHA256
        );

        byte[] hash = pbkdf2.GetBytes(32);

        byte[] result = new byte[48];

        Buffer.BlockCopy(salt, 0, result, 0, 16);
        Buffer.BlockCopy(hash, 0, result, 16, 32);

        return Convert.ToBase64String(result);
    }

    public static bool VerifyPassword(string password, string hashedPassword)
    {
        byte[] fullHash;

        try
        {
            fullHash = Convert.FromBase64String(hashedPassword);
        }
        catch
        {
            return false;
        }

        if (fullHash.Length != 48)
            return false;

        byte[] salt = new byte[16];
        byte[] storedHash = new byte[32];

        Buffer.BlockCopy(fullHash, 0, salt, 0, 16);
        Buffer.BlockCopy(fullHash, 16, storedHash, 0, 32);

        using var pbkdf2 = new Rfc2898DeriveBytes(
            password,
            salt,
            10000,
            HashAlgorithmName.SHA256
        );

        byte[] computedHash = pbkdf2.GetBytes(32);

        return CryptographicOperations.FixedTimeEquals(storedHash, computedHash);
    }
}