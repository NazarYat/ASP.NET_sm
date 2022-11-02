using System;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Threading;
using Microsoft.AspNetCore.Mvc;
using ASP.NET_sm.Models;
using Microsoft.AspNetCore.Http;
using System.Text;
using System.Security.Cryptography;
using Microsoft.Extensions.Configuration;

namespace ASP.NET_sm.Services
{
    public class ActivationService
    {
        private readonly UserActivationService database;

        public ActivationService( UserActivationService dbcontext )
        {
            database = dbcontext;
            Task.Factory.StartNew( Manage );
            Console.WriteLine("service constructor");
        }

        async Task Manage()
        {
            while ( true ) 
            {
                var users = await database.GetUsers( "" );
                var time = DateTime.Now;

                foreach ( var user in users )
                {
                    var userDateTime = user.Time + user.DeltaTime;
                    if ( time >= userDateTime )
                    {
                        await database.Remove( user.Id );
                    }
                }

                Thread.Sleep( 60000 * 30 );
            }
        }
        public async Task Add( UserActivationModel u )
        {
            await database.Create( u );
        }
    }
}