using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using ProEventos.Application.Dtos;

namespace ProEventos.Application.Contratos
{
    public interface ITokenService
    {
        Task<string> CreateToken(UserUpdateDto userUpdateDto);
    }
}