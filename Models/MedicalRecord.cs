using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MyBackendApi.Models
{
    public class MedicalRecord
    {
        [Key]  // Correct attribute for defining the primary key
        public int RecordId { get; set; }

        public DateTime DateCreated { get; set; } = DateTime.UtcNow;

        public DateTime? LastUpdated { get; set; }

        public string Diagnosis { get; set; }

        public string Treatment { get; set; }

        public string Prescription { get; set; }

        public bool IsEditable { get; set; } = true;

        public int PatientId { get; set; }

        public int DoctorId { get; set; }


    }
}
