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
    public class DoctorController : ControllerBase
    {
        private readonly Data.AppDbContext dbContext;
        // private readonly IDatabase _redisDb;

        // public DoctorController(IConnectionMultiplexer redis, Data.AppDbContext dbContext)
        public DoctorController(Data.AppDbContext dbContext) // Redis removed from DI
        {
            // _redisDb = redis.GetDatabase();
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetDoctor()
        {
            // string cacheKey = "doctors:all";
            // string cachedData = await _redisDb.StringGetAsync(cacheKey);

            // if (!string.IsNullOrEmpty(cachedData))
            // {
            //     var doctors = JsonConvert.DeserializeObject<List<Doctor>>(cachedData);
            //     return Ok(doctors);
            // }

            var records = dbContext.Doctors.ToList();

            // await _redisDb.StringSetAsync(cacheKey, JsonConvert.SerializeObject(records), TimeSpan.FromMinutes(10));
            return Ok(records);
        }

        [HttpGet("search")]
        public IActionResult SearchDoctorByName([FromQuery] string name)
        {
            var doctors = dbContext.Doctors.Where(d => d.Username.Contains(name)).ToList();
            if (!doctors.Any()) return NotFound(new { message = "No doctors found" });
            return Ok(doctors);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetDoctorById(int id)
        {
            // string cacheKey = $"doctor:{id}";
            // string cached = await _redisDb.StringGetAsync(cacheKey);

            // if (!string.IsNullOrEmpty(cached))
            //     return Ok(JsonConvert.DeserializeObject<Doctor>(cached));

            var doctor = dbContext.Doctors.Find(id);
            if (doctor == null) return NotFound(new { message = "Doctor not found" });

            // await _redisDb.StringSetAsync(cacheKey, JsonConvert.SerializeObject(doctor), TimeSpan.FromMinutes(10));
            return Ok(doctor);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> AddDoctor(AddDoctorDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (dbContext.Doctors.Any(d => d.Username == dto.Username))
                return BadRequest(new { message = "Username is already taken." });

            var doctor = new Doctor
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role,
                DateCreated = dto.DateCreated,
                LastUpdated = dto.LastUpdated,
                HospitalName = dto.HospitalName,
                Specailty = dto.Specailty,
                Age = dto.Age,
                Gender = dto.Gender,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                Address = dto.Address
            };
            dbContext.Doctors.Add(doctor);
            dbContext.SaveChanges();

            // await _redisDb.KeyDeleteAsync("doctors:all");
            return Ok(new { message = "Doctor added successfully" });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateDoctor(int id, UpdateDoctorDto dto)
        {
            var doctor = dbContext.Doctors.Find(id);
            if (doctor == null) return NotFound(new { message = "Doctor not found" });

            doctor.Username = dto.Username;
            if (!string.IsNullOrEmpty(dto.Password))
                doctor.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            doctor.Role = dto.Role;
            doctor.DateCreated = dto.DateCreated;
            doctor.LastUpdated = dto.LastUpdated;
            doctor.HospitalName = dto.HospitalName;
            doctor.Specailty = dto.Specailty;
            doctor.Age = dto.Age;
            doctor.Gender = dto.Gender;
            doctor.Email = dto.Email;
            doctor.PhoneNumber = dto.PhoneNumber;
            doctor.Address = dto.Address;

            dbContext.SaveChanges();

            // await _redisDb.KeyDeleteAsync($"doctor:{id}");
            // await _redisDb.KeyDeleteAsync("doctors:all");

            return Ok(new { message = "Doctor updated successfully", doctor });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = dbContext.Doctors.Find(id);
            if (doctor == null) return NotFound(new { message = "Doctor not found" });

            dbContext.Doctors.Remove(doctor);
            dbContext.SaveChanges();

            // await _redisDb.KeyDeleteAsync($"doctor:{id}");
            // await _redisDb.KeyDeleteAsync("doctors:all");

            return Ok(new { message = "Doctor deleted successfully" });
        }

        [HttpGet]
        [Route("ids")]
        public IActionResult GetAllDoctorIds()
        {
            var doctorIds = dbContext.Doctors.Select(d => d.Id).ToList();
            return Ok(doctorIds);
        }
    }
}
