using System;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain.Enums;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace ProEventos.Domain.Identity
{
    public class User : IdentityUser<int>
    {
        public string Nome { get; set; }
        public string Sobrenome { get; set; }
        public Title Title { get; set; }
        public string Descricao { get; set; }
        public Function Function { get; set; }
        public string Imagem { get; set; }
        public IEnumerable<UserRole> UserRoles { get; set; }
    }
}