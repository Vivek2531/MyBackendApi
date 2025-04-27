using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MyBackendApi.Data;

namespace MyBackendApi.Controller
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public UsersController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = dbContext.Doctors
                          .Select(d => new { d.Id, d.Username, d.Role })
                          .ToList();

            return Ok(users);
        }
        [HttpGet("Test")]

        public string Test()
        {
            return "Your application is running";
        }
    }
}
