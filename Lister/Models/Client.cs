namespace Lister.Models
{
    public class Client
    {
        public Client(Guid clientId, string name, string role)
        {
            ClientId = clientId;
            Name = name;
            Role = role;
        }

        public Guid ClientId { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
    }
}
