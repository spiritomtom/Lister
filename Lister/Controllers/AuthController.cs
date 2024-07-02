using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Lister.Models;
using Microsoft.EntityFrameworkCore;
using Lister.DatabaseAccess;
using Microsoft.AspNetCore.Authorization;

namespace Lister.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SqlServerDatabaseContext _context;

        public AuthController(SqlServerDatabaseContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingClient = await _context.Clients.AnyAsync(c => c.Email == model.Email);
            if (existingClient)
            {
                ModelState.AddModelError(string.Empty, "Email already taken.");
                return BadRequest(ModelState);
            }

            var client = new Client
            {
                ClientId = Guid.NewGuid(),
                Name = model.Email, // or any other logic for name
                Email = model.Email,
                Password = model.Password,
                Role = "User"
            };

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var client = await _context.Clients.SingleOrDefaultAsync(c => c.Email == model.Email && c.Password == model.Password);
            if (client == null)
            {
                ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                return BadRequest(ModelState);
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, client.ClientId.ToString()),
                new Claim(ClaimTypes.Email, client.Email)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

            return Ok();
        }

        [HttpGet("currentuser")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _context.Clients.FindAsync(Guid.Parse(userId));
            if (user == null)
            {
                return NotFound();
            }

            return Ok(new { userId = user.ClientId, username = user.Name });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<Client>>> GetAllUsers()
        {
            var clients = await _context.Clients.ToListAsync();
            return Ok(clients);
        }
    }
}