using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using ProEventos.Domain.Identity;
using Microsoft.EntityFrameworkCore;
using ProEventos.Persistence.Contexto;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Persistence
{
    public class UserPersist : GeralPersist, IUserPersist
    {

        private readonly EventosContext _context;
        public UserPersist(EventosContext context) : base(context)
        {
            _context = context;
        }
        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }
        public async Task<User> GetUserByIdAsync(int id)
        {
            return await   _context.Users.FindAsync(id);
        }

        public async Task<User> GetUserByUserNameAsync(string userName)
        {
            return await _context.Users.SingleOrDefaultAsync(user => user.UserName == userName.ToLower());
        }
    }
}