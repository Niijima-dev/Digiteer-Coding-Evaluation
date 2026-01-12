using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using task_manager_api.Dtos;
using task_manager_api.Helper;
using TaskManager.Data;
using TaskManager.Models;

namespace TaskManager.API
{
    [Route("User")]
    [ApiController]
    public class UserController: ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        
        public UserController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("Register")]
        public async Task<ActionResult<AuthRespoDto>> Register(RegisterUserDto dto)
        {
            var hasher = new PasswordHasher();
            var generateToken = new JwtTokenGenerator(_configuration);
            
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest(new {Message = "Email is already taken"});
            }

            var passwordHash = hasher.HashPassword(dto.PasswordHash);

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = passwordHash
            };
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            
            var token = generateToken.GenerateJwtToken(user);
            return Ok(new AuthRespoDto
                {
                    Token = token,
                    User = new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email
                    }
                }
            );
        }

        [HttpPost("Login")]
        public async Task<ActionResult<AuthRespoDto>> Login(LoginDto dto)
        {
            var hasher = new PasswordHasher();
            var generateToken = new JwtTokenGenerator(_configuration);
            
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !hasher.VerifyPassword(dto.PasswordHash, user.PasswordHash))
            {
                return Unauthorized(new {Message = "Invalid credentials"});
            }
            
            var token = generateToken.GenerateJwtToken(user);

            return Ok(new AuthRespoDto
                {
                    Token = token,
                    User = new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email
                    }
                }
            );
        }
    }
}

