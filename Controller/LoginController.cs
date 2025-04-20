using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using MyBackendApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace MyBackendApi.Controller
{
    [ApiController]
    [Route("login")]
    [AllowAnonymous]
    public class LoginController : ControllerBase
    {
        private readonly Data.AppDbContext dbContext;

        public LoginController(Data.AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // Check in Doctors table
            var doctor = await dbContext.Doctors.FirstOrDefaultAsync(u => u.Username == loginDto.Username);
            if (doctor != null && BCrypt.Net.BCrypt.Verify(loginDto.Password, doctor.PasswordHash))
            {
                var token = GenerateJwtToken(doctor.Username, doctor.Role);
                return Ok(new
                {
                    message = "Login successful",
                    token,
                    user = new
                    {
                        id = doctor.Id,
                        username = doctor.Username,
                        role = doctor.Role,
                        email = doctor.Email,
                        hospitalName = doctor.HospitalName
                    }
                });
            }

            // Check in Patients table
            var patient = await dbContext.Patients.FirstOrDefaultAsync(u => u.Username == loginDto.Username);
            if (patient != null && BCrypt.Net.BCrypt.Verify(loginDto.Password, patient.PasswordHash))
            {
                var token = GenerateJwtToken(patient.Username, "Patient");
                return Ok(new
                {
                    message = "Login successful",
                    token,
                    user = new
                    {
                        id = patient.Id,
                        username = patient.Username,
                        role = "Patient",
                        email = patient.Email,
                        gender = patient.Gender
                    }
                });
            }

            return Unauthorized(new { message = "Invalid username or password" });
        }

        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            var doctor = dbContext.Doctors.FirstOrDefault(d => d.Email == forgotPasswordDto.Email);
            if (doctor != null)
            {
                doctor.PasswordHash = BCrypt.Net.BCrypt.HashPassword(forgotPasswordDto.NewPassword);
                dbContext.SaveChanges();
                return Ok(new { message = "Password reset successfully for the doctor" });
            }

            var patient = dbContext.Patients.FirstOrDefault(p => p.Email == forgotPasswordDto.Email);
            if (patient != null)
            {
                patient.PasswordHash = BCrypt.Net.BCrypt.HashPassword(forgotPasswordDto.NewPassword);
                dbContext.SaveChanges();
                return Ok(new { message = "Password reset successfully for the patient" });
            }

            return NotFound(new { message = "Email not found" });
        }

        private string GenerateJwtToken(string username, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("Jwt__Key") ?? throw new Exception("JWT key not set"));
            var issuer = Environment.GetEnvironmentVariable("Jwt__Issuer") ?? "EHR-API-Backend";
            var audience = Environment.GetEnvironmentVariable("Jwt__Audience") ?? "ehr-frontend";

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, username),
                    new Claim(ClaimTypes.Role, role)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private void SendEmail(string toEmail, string subject, string body)
        {
            try
            {
                using var smtpClient = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new System.Net.NetworkCredential("your-email@gmail.com", "your-email-password"),
                    EnableSsl = true
                };

                var mailMessage = new System.Net.Mail.MailMessage
                {
                    From = new System.Net.Mail.MailAddress("your-email@gmail.com", "MyBackendApi"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(toEmail);
                smtpClient.Send(mailMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
            }
        }
    }
}
