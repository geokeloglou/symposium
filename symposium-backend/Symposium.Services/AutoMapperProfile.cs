using AutoMapper;
using Symposium.Data.Models;
using Symposium.DTO.ProfileDto;

namespace Symposium.Services
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, GetProfileInfoDto>();
        }
    }
}
