using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyBackendApi.Models
{
    public class UpdateDoctorDto
    {
        
        public string Username { get; set; }

        
        public string Password { get; set; } // For DTO binding only

       
        public string Role { get; set; } // "Patient", "Doctor", or "Admin"

      
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;

        public DateTime? LastUpdated { get; set; }

        
        public string HospitalName { get; set; }

        
        public string Specailty { get; set; }

        public int Age { get; set; }

        public string Gender { get; set; } // "Male", "Female", "Other"

        
        public string Email { get; set; }

       
        public string PhoneNumber { get; set; }

   
        public string Address { get; set; }
    }
}