using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBackendApi.Models
{
    public class Patient
    { [Key]
        public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Username { get; set; }

  public string PasswordHash { get; set; }

    [Required]
    [StringLength(20)]
    public string Role { get; set; } // "Patient", "Doctor", or "Admin"

    [NotMapped] // Not stored in DB
    public string Password { get; set; } // Only for DTO binding
        
        [Required]
    [DataType(DataType.Date)]
    public DateTime DateOfBirth { get; set; }

    [StringLength(10)]
    public string Gender { get; set; } // "Male", "Female", "Other"

    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; }

    [Phone]
    [StringLength(20)]
    public string PhoneNumber { get; set; }

    [StringLength(200)]
    public string Address { get; set; }

    // Navigation property
    public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
    }
}