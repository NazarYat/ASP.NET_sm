using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ASP.NET_sm.Models;
using ASP.NET_sm.Services;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace ASP.NET_sm
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddTransient< UserService >();
            services.AddTransient< RegistrationService >();
            services.AddTransient< SignInService >();
            services.AddTransient< UserActivationService >();
            services.AddTransient< MailService >();
            services.AddTransient< ContentService >();
            services.AddControllersWithViews();

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.LoginPath = new Microsoft.AspNetCore.Http.PathString("/Home/Login");
                    options.AccessDeniedPath = new Microsoft.AspNetCore.Http.PathString("/Home/Login");
                });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {   
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Login}");
                
                endpoints.MapControllerRoute(
                    name: "register",
                    pattern: "{controller=Home}/{action=Register}");

                endpoints.MapControllerRoute(
                    name: "main",
                    pattern: "{controller=Home}/{action=Main}");
                
                endpoints.MapControllerRoute(
                    name: "emailVerify",
                    pattern: "{controller=Email}/{action=Veryfy}");

                endpoints.MapControllerRoute(
                    name: "addContentElement",
                    pattern: "{controller=Admin}/{action=AddContentElement}");

                endpoints.MapControllerRoute(
                    name: "addContentElement",
                    pattern: "{controller=Admin}/{action=DeleteContentElement}");

                endpoints.MapControllerRoute(
                    name: "deleteAccount",
                    pattern: "{controller=Home}/{action=DeleteAccount}");

                endpoints.MapControllerRoute(
                    name: "deleteAccount",
                    pattern: "{controller=Home}/{action=Exit}");
            });
        }
    }
}
