using System;
using Microsoft.AspNetCore.Mvc;
using ASP.NET_sm.Services;


namespace ASP.NET_sm.Controllers
{
    public class EmailController : Controller
    {
        private readonly MailService _mailService;

        public EmailController( MailService mailContext )
        {
            _mailService = mailContext;
        }
        [HttpPost]
        public IActionResult Verify( string email )
        {
            Console.WriteLine( "email veryfi" );
            return new StatusCodeResult(
                _mailService.IsValidEmail( email ) ? 200 : 400
            );
        }
    }
}