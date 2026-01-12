using System.ComponentModel.DataAnnotations;

namespace task_manager_api.Dtos;

public class UserDto
{
    public int  Id { get; set; }
    public string Email { get; set; }
}

public class RegisterUserDto
{
    [Required]
    public string Email { get; set; }
    [Required]
    [MinLength(8)]
    public string PasswordHash { get; set; }
}

public class LoginDto
{
    public string Email { get; set; }
    public string PasswordHash { get; set; }
}

public class AuthRespoDto
{
    public string Token { get; set; }
    public UserDto User { get; set; }
}