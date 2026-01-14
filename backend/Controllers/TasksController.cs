using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using task_manager_api.Dtos;
using TaskManager.Models;
using TaskManager.Data;
namespace TaskManager.API
{
    [Route("tasks")]
    [ApiController]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (!int.TryParse(userIdClaim, out var userId))
                return -1;

            return userId;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItemDto>>> GetTask()
        {
            var userId = GetCurrentUserId();
            
            var tasks = await _context.Tasks
                .Where(t => t.UserId == userId)
                .Select(t => new TaskItemDto()
                {
                    Id = t.Id,
                    Title = t.Title,
                    IsDone = t.IsDone,
                    UserId = t.UserId
                }).ToListAsync();
            
            return Ok(tasks);
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItemDto>> GetTask(int id)
        {
            var userId = GetCurrentUserId();
            
            var task = await _context.Tasks
                .Where(t => t.Id == id && t.UserId == userId)  // Make sure task belongs to user
                .Select(t => new TaskItemDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    IsDone = t.IsDone,
                    UserId = t.UserId
                })
                .FirstOrDefaultAsync();

            if (task == null)
            {
                return NotFound(new { message = "Task not found" });
            }

            return Ok(task);
        }

        [HttpPost]
        public async Task<ActionResult<TaskItemDto>> CreateTask(CreateTaskDto dto)
        {
            var userId = GetCurrentUserId();

            var task = new TaskItem
            {
                Title = dto.Title,
                IsDone = false,
                UserId = userId
            };
            
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            var taskDto = new TaskItemDto
            {
                Id = task.Id,
                Title = task.Title,
                IsDone = task.IsDone,
                UserId = task.UserId
            };
            
            return CreatedAtAction(nameof(GetTask), new { id = taskDto.Id }, taskDto);
        }

        [HttpPut("{id}")] 
        public async Task<IActionResult> UpdateTask(int id, UpdateTaskDto dto)
        {
            var userId =  GetCurrentUserId();
            
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            
            if (task == null) return NotFound(new {Message = "Task not found"});
            
            task.Title = dto.Title;
            task.IsDone = dto.IsDone;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetCurrentUserId();
            
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            
            if (task == null) return NotFound(new  {Message = "Task not found"});

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
