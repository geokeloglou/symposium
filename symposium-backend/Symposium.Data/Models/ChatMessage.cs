using System;

namespace Symposium.Data.Models
{
    public class ChatMessage
    {
        public Guid Id { get; set; }
        public Guid SenderId { get; set; }
        public string ReceiverId { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset UpdatedDate { get; set; }
        public string Text { get; set; }
        // FK
        public Guid ConversationId { get; set; }
    }
}
