using Lister.Extensions;

namespace Lister.Models
{
    public class WorkItem
    {
        public Guid Id { get; set; }
        public string Title {  get; set; }
        public string Description { get; set; }
        public Guid AssignedClientId { get; set; }
        public WorkItemStatus Status { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
    }
}
