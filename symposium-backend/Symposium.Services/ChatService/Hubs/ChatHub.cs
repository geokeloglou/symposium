using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Symposium.Services.ChatService.Hubs

{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message, string imageUrl)
        {
            await Clients.All.SendAsync("ReceiveOne", user, message, imageUrl);
        }
        
        // public async Task SendMessage(string user, string message)
        // {
        //     await Clients.All.SendAsync("ReceiveMessage", user, message);
        // }
        
        /*internal static ConcurrentDictionary<string, int> UserCount = new ConcurrentDictionary<string, int>();

        public async Task SendMessageToAll(ChatMessage message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }

        // change group to Conversation or Group model
        public async Task SendMessageToGroup(string group, ChatMessage message)
        {
            await Clients.Group(group).SendAsync("ReceiveMessage", message);
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("UserConnected", Context.ConnectionId);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await Clients.All.SendAsync("UserDisconnected", Context.ConnectionId);
            await base.OnDisconnectedAsync(ex);
        }

        public async Task JoinGroup(string group)
        {
            if (UserCount.ContainsKey(group))
                UserCount[group]++;
            else
                UserCount.TryAdd(group, 1);

            await Groups.AddToGroupAsync(Context.ConnectionId, group);
            await Clients.Group(group).SendAsync("UserCount", UserCount[group]);
        }

        public async Task LeaveGroup(string group)
        {
            UserCount[group]--;

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, group);
            await Clients.Group(group).SendAsync("UserCount", UserCount[group]);
        }*/
    }
}
