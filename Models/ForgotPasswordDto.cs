using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace MyBackendApi.Models
{
    public class ForgotPasswordDto
    {
        public string Email { get; set; }
        public string NewPassword { get; set; } // Added NewPassword property
    }
}