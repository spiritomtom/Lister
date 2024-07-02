namespace Lister.Models
{
    public class Client
    {
        public Guid ClientId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }
}