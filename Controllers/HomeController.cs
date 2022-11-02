using System;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ASP.NET_sm.Models;
using ASP.NET_sm.Services;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;

namespace ASP.NET_sm.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly RegistrationService _registrator;
        private readonly SignInService _signInService;
        private readonly ContentService _contentDB;
        private const string StaticSalt = "jo&?34$nO33l^Kn!43$45n_26/l4:5N'l6";

        public HomeController(ILogger<HomeController> logger, RegistrationService regContext, SignInService signinContext, ContentService contentDBContext)
        {
            _logger = logger;
            _registrator = regContext;
            _signInService = signinContext;
            _contentDB = contentDBContext;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Login( string login, string password )
        {
            Console.WriteLine( "login: " + login );

            var user = _signInService.Login( login, password );

            if ( user != null )
            {
                await Authentificate( user );

                return new StatusCodeResult( 200 );
            }

            this.HttpContext.Response.StatusCode = 419;

            return Content( "*incorrect email or password" );
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Main()
        {
            ViewBag.User = User;
            
            ViewBag.ContentElements = await _contentDB.GetElements( null );
            return View();
        }
        async Task Authentificate( UserModel user )
        {
            var claims = new List<Claim>
                {
                    new Claim( ClaimsIdentity.DefaultNameClaimType, user.Email ),
                    new Claim( ClaimsIdentity.DefaultRoleClaimType, user.Role )
                };
                // создаем объект ClaimsIdentity
                ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", 
                    ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
                // установка аутентификационных куки
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(id));
        }
        [HttpPost]
        public async Task< IActionResult > DeleteAccount( string email ) {
            await _registrator.DeleteAccount( email );
            return await Exit();
        }
        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Register( string login, string password )
        {
            bool lengthPass = password.Length > 8 && password.Length < 20,
                 letterPass = Regex.Matches( password, "[a-zA-z]" ).Count > 0,
                 numberPass = Regex.Matches( password, "[0-9]" ).Count > 0,
                 specialSymbolPass = Regex.Matches( password, "[!|$|%|&|*|#]" ).Count > 0;
            
            if ( !lengthPass ) {
                HttpContext.Response.StatusCode = 400;
                return Content( "*password must have length 8 - 20 symbols." );
            }
            if ( !letterPass ) {
                HttpContext.Response.StatusCode = 400;
                return Content( "*password must have at least 1 letter." );
            }
            if ( !numberPass ) {
                HttpContext.Response.StatusCode = 400;
                return Content( "*password must have at least 1 number." );
            }
            if ( !specialSymbolPass ) {
                HttpContext.Response.StatusCode = 400;
                return Content( "*password must have at least 1 special symbol." );
            }
            Console.WriteLine( $"register {login}" );
            return await _registrator.Register( login, password );
        }
        public async Task<IActionResult> Exit()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return new StatusCodeResult( 200 );
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
