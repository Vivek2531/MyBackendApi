using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyBackendApi.Models;
using Microsoft.AspNetCore.Authorization;
// using StackExchange.Redis;
using Newtonsoft.Json;

namespace MyBackendApi.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PatientController : ControllerBase
    {
        private readonly Data.AppDbContext dbContext;
        // private readonly IDatabase _redisDb;

        // public PatientController(IConnectionMultiplexer redis, Data.AppDbContext dbContext)
        public PatientController(Data.AppDbContext dbContext) // Redis removed from DI
        {
            // _redisDb = redis.GetDatabase();
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetPatient()
        {
            // string cacheKey = "patients:all";
            // string cached = await _redisDb.StringGetAsync(cacheKey);

            // if (!string.IsNullOrEmpty(cached))
            // {
            //     var patients = JsonConvert.DeserializeObject<List<Patient>>(cached);
            //     return Ok(patients);
            // }

            var records = dbContext.Patients.ToList();

            // await _redisDb.StringSetAsync(cacheKey, JsonConvert.SerializeObject(records), TimeSpan.FromMinutes(10));
            return Ok(records);
        }

        [HttpGet("search")]
        public IActionResult GetPatientByName([FromQuery] string name)
        {
            var patients = dbContext.Patients.Where(p => p.Username.Contains(name)).ToList();
            if (!patients.Any()) return NotFound(new { message = "No patients found" });
            return Ok(patients);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetPatientById(int id)
        {
            // string cacheKey = $"patient:{id}";
            // string cached = await _redisDb.StringGetAsync(cacheKey);

            // if (!string.IsNullOrEmpty(cached))
            // {
            //     var patient = JsonConvert.DeserializeObject<Patient>(cached);
            //     return Ok(patient);
            // }

            var patientFromDb = dbContext.Patients.Find(id);
            if (patientFromDb == null) return NotFound(new { message = "Patient not found" });

            // await _redisDb.StringSetAsync(cacheKey, JsonConvert.SerializeObject(patientFromDb), TimeSpan.FromMinutes(10));
            return Ok(patientFromDb);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> AddPatient(AddPatientDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (dbContext.Patients.Any(p => p.Username == dto.Username))
                return BadRequest(new { message = "Username is already taken." });

            var patient = new Patient
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role,
                DateOfBirth = dto.DateOfBirth,
                Gender = dto.Gender,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                Address = dto.Address
            };

            dbContext.Patients.Add(patient);
            dbContext.SaveChanges();

            // await _redisDb.KeyDeleteAsync("patients:all");
            return Ok(new { message = "Patient added successfully" });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdatePatient(int id, UpdatePatientDto dto)
        {
            var patient = dbContext.Patients.Find(id);
            if (patient == null) return NotFound(new { message = "Patient not found" });

            patient.Username = dto.Username;
            if (!string.IsNullOrEmpty(dto.Password))
                patient.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            patient.Role = dto.Role;
            patient.DateOfBirth = dto.DateOfBirth;
            patient.Gender = dto.Gender;
            patient.Email = dto.Email;
            patient.PhoneNumber = dto.PhoneNumber;
            patient.Address = dto.Address;

            dbContext.SaveChanges();

            // await _redisDb.KeyDeleteAsync("patients:all");
            // await _redisDb.KeyDeleteAsync($"patient:{id}");

            return Ok(new { message = "Patient updated successfully", patient });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = dbContext.Patients.Find(id);
            if (patient == null) return NotFound(new { message = "Patient not found" });

            dbContext.Patients.Remove(patient);
            dbContext.SaveChanges();

            // await _redisDb.KeyDeleteAsync("patients:all");
            // await _redisDb.KeyDeleteAsync($"patient:{id}");

            return Ok(new { message = "Patient deleted successfully" });
        }

        [HttpGet]
        [Route("ids")]
        public IActionResult GetAllPatientIds()
        {
            var patientIds = dbContext.Patients.Select(p => p.Id).ToList();
            return Ok(patientIds);
        }
    }
}
