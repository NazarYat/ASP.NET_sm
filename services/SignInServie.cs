using System;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ASP.NET_sm.Models;
using Microsoft.AspNetCore.Http;
using System.Text;
using System.Security.Cryptography;

namespace ASP.NET_sm.Services
{
    public class SignInService
    {
        private const string StaticSalt = "jo&?34$nO33l^Kn!43$45n_26/l4:5N'l6";
        private readonly UserService database;

        public SignInService( UserService dbcontext )
        {
            database = dbcontext;
        }
        
        public UserModel Login( string email, string password )
        {
            var user = database.GetUsers( email ).Result;
            if ( user.Count() == 0 )
            {
                return null;
            }
            if ( user.ElementAt(0).Email != "guest@guest" ) {
                if ( !VerifyHash( 
                        GetPasswordString( user.ElementAt(0).Salt, password ),
                        user.ElementAt(0).Password 
                    )
                ) {
                    return null;
                }
            }
            return user.ElementAt(0);
        }
        string GetPasswordString( string salt, string password )
        {
            return password.Insert( 3, salt ).Insert( password.Length - 2, StaticSalt );
        }
        string Hash( string value )
        {
            return BCrypt.Net.BCrypt.HashPassword( value );
        }
        public bool VerifyHash(string password, string hashedPassword) 
        {
            return BCrypt.Net.BCrypt.Verify( password, hashedPassword );
        }
    }
}