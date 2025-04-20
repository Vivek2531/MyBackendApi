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
    public class MedicalRecordController : ControllerBase
    {
        private readonly Data.AppDbContext dbContext;
        // private readonly IDatabase _redisDb;

        // public MedicalRecordController(IConnectionMultiplexer redis, Data.AppDbContext dbContext)
        public MedicalRecordController(Data.AppDbContext dbContext) // Redis removed from DI
        {
            // _redisDb = redis.GetDatabase();
            this.dbContext = dbContext;
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentMedicalRecords()
        {
            // string cacheKey = "medicalrecords:recent";
            // string cached = await _redisDb.StringGetAsync(cacheKey);
            // if (!string.IsNullOrEmpty(cached))
            // {
            //     var records = JsonConvert.DeserializeObject<List<MedicalRecord>>(cached);
            //     return Ok(records);
            // }

            var recordsFromDb = dbContext.MedicalRecords.OrderByDescending(r => r.DateCreated).Take(10).ToList();

            // await _redisDb.StringSetAsync(cacheKey, JsonConvert.SerializeObject(recordsFromDb), TimeSpan.FromMinutes(10));
            return Ok(recordsFromDb);
        }

        [HttpGet]
        public async Task<IActionResult> GetMedicalRecords()
        {
            // string cacheKey = "medicalrecords:all";
            // string cached = await _redisDb.StringGetAsync(cacheKey);
            // if (!string.IsNullOrEmpty(cached))
            // {
            //     var records = JsonConvert.DeserializeObject<List<MedicalRecord>>(cached);
            //     return Ok(records);
            // }

            var recordsFromDb = dbContext.MedicalRecords.OrderByDescending(r => r.DateCreated).ToList();

            // await _redisDb.StringSetAsync(cacheKey, JsonConvert.SerializeObject(recordsFromDb), TimeSpan.FromMinutes(10));
            return Ok(recordsFromDb);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetMedicalRecordById(int id)
        {
            // string cacheKey = $"medicalrecord:{id}";
            // string cached = await _redisDb.StringGetAsync(cacheKey);
            // if (!string.IsNullOrEmpty(cached))
            // {
            //     var record = JsonConvert.DeserializeObject<MedicalRecord>(cached);
            //     return Ok(record);
            // }

            var recordFromDb = dbContext.MedicalRecords.Find(id);
            if (recordFromDb == null) return NotFound(new { message = "Medical record not found" });

            // await _redisDb.StringSetAsync(cacheKey, JsonConvert.SerializeObject(recordFromDb), TimeSpan.FromMinutes(10));
            return Ok(recordFromDb);
        }

        [HttpGet("by-patient/{patientId:int}")]
        public async Task<IActionResult> GetMedicalRecordsByPatientId(int patientId)
        {
            // string cacheKey = $"medicalrecords:patient:{patientId}";
            // string cached = await _redisDb.StringGetAsync(cacheKey);
            // if (!string.IsNullOrEmpty(cached))
            // {
            //     var records = JsonConvert.DeserializeObject<List<MedicalRecord>>(cached);
            //     return Ok(records);
            // }

            var recordsFromDb = dbContext.MedicalRecords
                .Where(r => r.PatientId == patientId)
                .OrderByDescending(r => r.DateCreated)
                .ToList();

            if (!recordsFromDb.Any()) return NotFound(new { message = "No medical records found for the given patient ID" });

            // await _redisDb.StringSetAsync(cacheKey, JsonConvert.SerializeObject(recordsFromDb), TimeSpan.FromMinutes(10));
            return Ok(recordsFromDb);
        }

        [HttpPost]
        public async Task<IActionResult> AddMedicalRecord(AddMedicalRecordDto dto)
        {
            var record = new MedicalRecord
            {
                DateCreated = dto.DateCreated,
                LastUpdated = dto.LastUpdated,
                Diagnosis = dto.Diagnosis,
                Treatment = dto.Treatment,
                Prescription = dto.Prescription,
                IsEditable = dto.IsEditable,
                PatientId = dto.PatientId,
                DoctorId = dto.DoctorId
            };

            dbContext.MedicalRecords.Add(record);
            dbContext.SaveChanges();

            // await _redisDb.KeyDeleteAsync("medicalrecords:all");
            // await _redisDb.KeyDeleteAsync("medicalrecords:recent");
            // await _redisDb.KeyDeleteAsync($"medicalrecords:patient:{dto.PatientId}");

            return Ok(new { message = "Medical record added successfully" });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateMedicalRecord(int id, UpdateMedicalRecordDto dto)
        {
            var record = dbContext.MedicalRecords.Find(id);
            if (record == null) return NotFound(new { message = "Medical record not found" });

            record.DateCreated = dto.DateCreated;
            record.LastUpdated = dto.LastUpdated;
            record.Diagnosis = dto.Diagnosis;
            record.Treatment = dto.Treatment;
            record.Prescription = dto.Prescription;
            record.IsEditable = dto.IsEditable;
            record.PatientId = dto.PatientId;
            record.DoctorId = dto.DoctorId;

            dbContext.SaveChanges();

            // await _redisDb.KeyDeleteAsync($"medicalrecord:{id}");
            // await _redisDb.KeyDeleteAsync("medicalrecords:all");
            // await _redisDb.KeyDeleteAsync("medicalrecords:recent");
            // await _redisDb.KeyDeleteAsync($"medicalrecords:patient:{dto.PatientId}");

            return Ok(new { message = "Medical record updated successfully", record });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteMedicalRecord(int id)
        {
            var record = dbContext.MedicalRecords.Find(id);
            if (record == null) return NotFound(new { message = "Medical record not found" });

            int patientId = record.PatientId;

            dbContext.MedicalRecords.Remove(record);
            dbContext.SaveChanges();

            // await _redisDb.KeyDeleteAsync($"medicalrecord:{id}");
            // await _redisDb.KeyDeleteAsync("medicalrecords:all");
            // await _redisDb.KeyDeleteAsync("medicalrecords:recent");
            // await _redisDb.KeyDeleteAsync($"medicalrecords:patient:{patientId}");

            return Ok(new { message = "Medical record deleted successfully" });
        }
    }
}
