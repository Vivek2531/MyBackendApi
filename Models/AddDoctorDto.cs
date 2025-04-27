using System;
using System.ComponentModel.DataAnnotations;

namespace MyBackendApi.Models
{
    public class AddDoctorDto
    {
        [Required]
        [StringLength(50)]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; } // For DTO binding only

        [Required]
        [StringLength(20)]
        public string Role { get; set; } // "Patient", "Doctor", or "Admin"

        [Required]
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;

        public DateTime? LastUpdated { get; set; }

        [Required]
        [StringLength(500)]
        public string HospitalName { get; set; }

        [StringLength(1000)]
        public string Specailty { get; set; }

        public int Age { get; set; }

        public string Gender { get; set; } // "Male", "Female", "Other"

        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }

        [Phone]
        [StringLength(20)]
        public string PhoneNumber { get; set; }

        [StringLength(200)]
        public string Address { get; set; }
    }
}