using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyBackendApi.Models
{
    public class Doctor
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
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    public DateTime? LastUpdated { get; set; }

    [Required]
    [StringLength(500)]
    public string HospitalName { get; set; }

    [StringLength(1000)]
    public string Specailty { get; set; }

    [StringLength(500)]
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