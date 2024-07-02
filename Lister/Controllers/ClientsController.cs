using Lister.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lister.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly SqlServerDatabaseContext _databaseContext;

        public ClientsController(SqlServerDatabaseContext sqlContext)
        {
            _databaseContext = sqlContext;
        }

        // GET: /clients/{clientId}
        [HttpGet("{clientId}")]
        public async Task<ActionResult<Client>> GetClient([FromRoute] Guid clientId)
        {
            var client = await _databaseContext.Clients.FindAsync(clientId);

            if (client is null)
            {
                return NotFound();
            }

            return Ok(client);
        }

        // GET: /clients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients()
        {
            var clients = await _databaseContext.Clients.ToListAsync();

            return Ok(clients);
        }

        // POST: /clients
        [HttpPost]
        public async Task<ActionResult<Client>> CreateClient([FromBody] Client client)
        {
            if (client == null)
            {
                return BadRequest("Client cannot be null.");
            }

            client.ClientId = Guid.NewGuid();

            _databaseContext.Clients.Add(client);
            await _databaseContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetClient), new { clientId = client.ClientId }, client);
        }

        // PUT: /clients/{clientId}
        [HttpPut("{clientId}")]
        public async Task<IActionResult> UpdateClient([FromRoute] Guid clientId, [FromBody] Client updatedClient)
        {
            if (clientId != updatedClient.ClientId)
            {
                return BadRequest("Client ID mismatch.");
            }

            var existingClient = await _databaseContext.Clients.FindAsync(clientId);

            if (existingClient is null)
            {
                return NotFound();
            }

            existingClient.Name = updatedClient.Name;
            existingClient.Role = updatedClient.Role;

            _databaseContext.Entry(existingClient).State = EntityState.Modified;
            await _databaseContext.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: /clients/{clientId}
        [HttpDelete("{clientId}")]
        public async Task<IActionResult> DeleteClient([FromRoute] Guid clientId)
        {
            var client = await _databaseContext.Clients.FindAsync(clientId);

            if (client is null)
            {
                return NotFound();
            }

            _databaseContext.Clients.Remove(client);
            await _databaseContext.SaveChangesAsync();

            return NoContent();
        }
    }
}