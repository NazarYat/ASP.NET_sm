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
    public class RegistrationService
    {
        private const string StaticSalt = "jo&?34$nO33l^Kn!43$45n_26/l4:5N'l6";
        private readonly UserService database;

        public RegistrationService( UserService dbcontext )
        {
            database = dbcontext;
        }
        
        public async Task<IActionResult> Register( string email, string password )
        {
            var users = database.GetUsers( email );

            if ( users.Result.Count() > 0 ) return new StatusCodeResult(209);

            var user = new UserModel();

            user.Email = email;
            user.Salt = GetSalt();
            user.Password = Hash( GetPasswordString( user.Salt, password ) );
            user.Status = "activated";
            user.Role = "User";

            await database.Create( user );
            
            return new OkResult();
        }
        string GetPasswordString( string salt, string password )
        {
            return password.Insert( 3, salt ).Insert( password.Length - 2, StaticSalt );
        }
        public async Task<IActionResult> ActivateAsync( string id )
        {
            var user = database.GetUser( id ).Result;

            user.Status = "activated";

            await database.Update( user );

            return new StatusCodeResult( 200 );
        }
        string Hash( string value )
        {
            return BCrypt.Net.BCrypt.HashPassword( value );
        }
        string GetSalt()
        {
            var bytes = RandomNumberGenerator.GetBytes( 20 );
            var salt = System.Text.Encoding.UTF8.GetString( bytes );

            return salt;
        }
        public async Task< IActionResult > DeleteAccount( string email )
        {
            var users = await database.GetUsers( email );

            if ( users.Count() > 0 )
            {
                await database.Remove( users.ElementAt(0).Id.ToString() );
                return new StatusCodeResult( 200 );
            }
            else return new StatusCodeResult( 400 );
        }
    }
}