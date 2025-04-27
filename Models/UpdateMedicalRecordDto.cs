using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyBackendApi.Models
{
    public class UpdateMedicalRecordDto
    {
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