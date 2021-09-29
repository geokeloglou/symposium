using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Symposium.DTO.ChatDto;
using Symposium.Services.ChatService.Hubs;

namespace Symposium.Web.Controllers.Api.ChatController
{
    [Route("api/chat")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IHubContext<ChatHub> _hubContext;
        
        public ChatController(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [Route("send")]
        [HttpPost]
        public async Task<IActionResult> SendRequest([FromBody] MessageDto message)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveOne", message.User, message.Text, message.ImageUrl);
            return Ok();
        }
    }
}
