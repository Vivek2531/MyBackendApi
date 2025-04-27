using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Amazon.Lambda.AspNetCoreServer;

namespace MyBackendApi
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration config)
        {
            Configuration = config;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "MyBackendApi", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter 'Bearer' [space] and then your token."
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            // PostgreSQL via env vars
            var dbHost = Environment.GetEnvironmentVariable("DB_HOST");
            var dbPort = Environment.GetEnvironmentVariable("DB_PORT") ?? "5432";
            var dbName = Environment.GetEnvironmentVariable("DB_NAME");
            var dbUser = Environment.GetEnvironmentVariable("DB_USER");
            var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");

            // ✅ Debug log for each individual DB variable
            Console.WriteLine("🔍 Raw DB env values:");
            Console.WriteLine($"DB_HOST: {dbHost}");
            Console.WriteLine($"DB_PORT: {dbPort}");
            Console.WriteLine($"DB_NAME: {dbName}");
            Console.WriteLine($"DB_USER: {dbUser}");
            Console.WriteLine($"DB_PASSWORD: {dbPassword}");

            var postgresConn = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPassword}";

            // ✅ Log full connection string (safe if DB password is not sensitive in logs)
            Console.WriteLine($"📦 Final PostgreSQL connection string: {postgresConn}");

            services.AddDbContext<Data.AppDbContext>(options =>
                options.UseNpgsql(postgresConn));

            // JWT from environment variables
            var jwtKey = Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("Jwt__Key") ?? throw new Exception("JWT key not set"));
            var jwtIssuer = Environment.GetEnvironmentVariable("Jwt__Issuer") ?? "EHR-API-Backend";
            var jwtAudience = Environment.GetEnvironmentVariable("Jwt__Audience") ?? "ehr-frontend";

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtIssuer,
                        ValidAudience = jwtAudience,
                        IssuerSigningKey = new SymmetricSecurityKey(jwtKey)
                    };
                });

            // ❌ Redis temporarily disabled to debug deployment issues
            // var redisHost = Environment.GetEnvironmentVariable("REDIS_HOST") ?? "localhost";
            // var redisPort = Environment.GetEnvironmentVariable("REDIS_PORT") ?? "6379";

            // var redisConfig = new ConfigurationOptions
            // {
            //     EndPoints = { $"{redisHost}:{redisPort}" },
            //     Ssl = true,
            //     AbortOnConnectFail = false,
            //     ConnectRetry = 5,
            //     ConnectTimeout = 5000
            // };

            // Console.WriteLine("📡 Connecting to Redis at: " + redisConfig.EndPoints.FirstOrDefault());

            // services.AddSingleton<IConnectionMultiplexer>(sp =>
            // {
            //     var multiplexer = ConnectionMultiplexer.Connect(redisConfig);
            //     Console.WriteLine("✅ Redis connected successfully.");
            //     return multiplexer;
            // });

            services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors("AllowAll");

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "MyBackendApi v1"));
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
