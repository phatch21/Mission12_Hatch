using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission11_API.Data;
using Mission11_API.Models;

namespace Mission11_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntertainersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EntertainersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/entertainers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Entertainer>>> GetEntertainers()
        {
            return await _context.Entertainers.ToListAsync();
        }

        // GET: api/entertainers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Entertainer>> GetEntertainer(int id)
        {
            var entertainer = await _context.Entertainers.FindAsync(id);
            if (entertainer == null) return NotFound();
            return entertainer;
        }

        // POST: api/entertainers
        [HttpPost]
        public async Task<ActionResult<Entertainer>> PostEntertainer(Entertainer entertainer)
        {
            _context.Entertainers.Add(entertainer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEntertainer), new { id = entertainer.EntertainerID }, entertainer);
        }

        // PUT: api/entertainers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEntertainer(int id, Entertainer entertainer)
        {
            if (id != entertainer.EntertainerID)
                return BadRequest("ID mismatch");

            _context.Entry(entertainer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Entertainers.Any(e => e.EntertainerID == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/entertainers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEntertainer(int id)
        {
            var entertainer = await _context.Entertainers.FindAsync(id);
            if (entertainer == null) return NotFound();

            _context.Entertainers.Remove(entertainer);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
