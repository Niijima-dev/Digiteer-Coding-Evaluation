using System.ComponentModel.DataAnnotations;

namespace task_manager_api.Dtos;

public class TaskItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsDone { get; set; }
    public int UserId { get; set; }
}

public class CreateTaskDto
{
    [Required]
    public string Title { get; set; } 
}

public class UpdateTaskDto
{
    [Required]
    public string Title { get; set; }
    [Required]
    public bool IsDone { get; set; }
}