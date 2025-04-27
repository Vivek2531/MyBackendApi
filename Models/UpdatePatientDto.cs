using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyBackendApi.Models
{
    public class UpdatePatientDto
    {
         public string Username { get; set; }




        public string Role { get; set; } // "Patient", "Doctor", or "Admin"


        public string Password { get; set; } // Only for DTO binding


        public DateTime DateOfBirth { get; set; }


        public string Gender { get; set; } // "Male", "Female", "Other"


        public string Email { get; set; }


        public string PhoneNumber { get; set; }


        public string Address { get; set; }
    }
}