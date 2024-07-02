using System;
using Lister.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lister.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkItemsController : ControllerBase
    {
        private readonly SqlServerDatabaseContext _databaseContext;

        public WorkItemsController(SqlServerDatabaseContext sqlContext)
        {
            _databaseContext = sqlContext;
        }

        // GET: /workitems/{workItemId}
        [HttpGet("{workItemId}")]
        public async Task<ActionResult<WorkItem>> GetWorkItem([FromRoute] Guid workItemId)
        {
            var item = await _databaseContext.WorkItems.FindAsync(workItemId);

            if (item is null)
            {
                return NotFound();
            }

            return Ok(item);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkItem>>> GetWorkItems()
        {
            var workItems = await _databaseContext.WorkItems.ToListAsync();
            return Ok(workItems);
        }

        // POST: api/workitems
        [HttpPost]
        public async Task<ActionResult<WorkItem>> CreateWorkItem([FromBody] WorkItem workItem)
        {
            if (workItem == null)
            {
                return BadRequest("Work item cannot be null.");
            }

            workItem.Id = Guid.NewGuid();
            workItem.DateCreated = DateTime.UtcNow;
            workItem.DateUpdated = DateTime.UtcNow;

            _databaseContext.WorkItems.Add(workItem);
            await _databaseContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWorkItem), new { workItemId = workItem.Id }, workItem);
        }

        // PUT: /workitems/{workItemId}
        [HttpPut("{workItemId}")]
        public async Task<IActionResult> UpdateWorkItem([FromRoute] Guid workItemId, [FromBody] WorkItem updatedWorkItem)
        {
            if (workItemId != updatedWorkItem.Id)
            {
                return BadRequest("Work item ID mismatch.");
            }

            var existingWorkItem = await _databaseContext.WorkItems.FindAsync(workItemId);

            if (existingWorkItem is null)
            {
                return NotFound();
            }

            existingWorkItem.Title = updatedWorkItem.Title;
            existingWorkItem.Description = updatedWorkItem.Description;
            existingWorkItem.AssignedClientId = updatedWorkItem.AssignedClientId;
            existingWorkItem.Status = updatedWorkItem.Status;
            existingWorkItem.DateUpdated = DateTime.UtcNow;

            _databaseContext.Entry(existingWorkItem).State = EntityState.Modified;
            await _databaseContext.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: /workitems/{workItemId}
        [HttpDelete("{workItemId}")]
        public async Task<IActionResult> DeleteWorkItem([FromRoute] Guid workItemId)
        {
            var workItem = await _databaseContext.WorkItems.FindAsync(workItemId);

            if (workItem is null)
            {
                return NotFound();
            }

            _databaseContext.WorkItems.Remove(workItem);
            await _databaseContext.SaveChangesAsync();

            return NoContent();
        }
    }
}