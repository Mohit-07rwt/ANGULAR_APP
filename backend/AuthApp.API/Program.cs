//using AuthApp.Application.Interfaces;
//using AuthApp.Application.Services;
//using AuthApp.Infrastructure.Data;
//using AuthApp.Infrastructure.Repositories;


//using AuthApp.Infrastructure.Services;

//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.IdentityModel.Tokens;
//using System.Text;

//var builder = WebApplication.CreateBuilder(args);

//// =========================
//// SERVICES

//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();
//builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

//// OpenAPI (Swagger optional)
//builder.Services.AddOpenApi();

//// Controllers
//builder.Services.AddControllers();

//// Dapper Context
//builder.Services.AddSingleton<DapperContext>();

//// Repositories (Dapper)
//builder.Services.AddScoped<IUserRepository, UserRepository>();

//// Application Services
//builder.Services.AddScoped<IAuthService, AuthService>();

//// JWT Authentication
//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)


//// =========================




//.AddJwtBearer(options =>
//{
//    var jwt = builder.Configuration.GetSection("Jwt");

//    options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuer = true,
//        ValidateAudience = true,
//        ValidateLifetime = true,
//        ValidateIssuerSigningKey = true,

//        ValidIssuer = jwt["Issuer"],
//        ValidAudience = jwt["Audience"],
//        IssuerSigningKey = new SymmetricSecurityKey(
//            Encoding.UTF8.GetBytes(jwt["Key"]!)
//        )
//    };
//});


//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAngular",
//        policy =>
//        {
//            policy.WithOrigins("http://localhost:4200")
//                  .AllowAnyHeader()
//                  .AllowAnyMethod();
//        });
//});


//var app = builder.Build();

//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//// =========================
//// PIPELINE
//// =========================

//if (app.Environment.IsDevelopment())
//{
//    app.MapOpenApi();
//}

//app.UseHttpsRedirection();

//app.UseAuthentication();
//app.UseAuthorization();

//app.MapControllers();

//app.Run();








using AuthApp.Application.Interfaces;
using AuthApp.Application.Services;
using AuthApp.Infrastructure.Data;
using AuthApp.Infrastructure.Repositories;
using AuthApp.Infrastructure.Services;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

using System.Text;

var builder = WebApplication.CreateBuilder(args);

// =========================
// Services
// =========================

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();

// Dapper
builder.Services.AddSingleton<DapperContext>();

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

// =========================
// JWT Authentication
// =========================

var jwt = builder.Configuration.GetSection("Jwt");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwt["Key"]!)
            )
        };
    });

// =========================
// CORS
// =========================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// =========================
// Build
// =========================

var app = builder.Build();

// =========================
// Middleware
// =========================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// IMPORTANT: CORS must come before Authentication
app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();