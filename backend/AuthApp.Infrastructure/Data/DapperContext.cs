//using Microsoft.Data.SqlClient;
//using Microsoft.Extensions.Configuration;
//using System.Data;

//namespace AuthApp.Infrastructure.Data;

//public class DapperContext
//{
//    private readonly IConfiguration _configuration;
//    private readonly string _connectionString;

//    public DapperContext(IConfiguration configuration)
//    {
//        _configuration = configuration;
//        _connectionString = _configuration.GetConnectionString("DefaultConnection")!;
//    }

//    public IDbConnection CreateConnection()
//        => new SqlConnection(_connectionString);
//}


using System.Data;
using MySqlConnector;
using Microsoft.Extensions.Configuration;

namespace AuthApp.Infrastructure.Data;

public class DapperContext
{
    private readonly IConfiguration _configuration;

    public DapperContext(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public IDbConnection CreateConnection()
    {
        var connectionString = _configuration.GetConnectionString("DefaultConnection");
        return new MySqlConnection(connectionString);
    }
}