using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ASP.NET_sm.Models;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace ASP.NET_sm.Controllers
{
    public class AdminController : Controller
    {
        private readonly ContentService _dataBase;
        public AdminController ( ContentService dbcontext )
        {
            _dataBase = dbcontext;
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddContentElement(
            string name,
            IFormFile image,
            string reference,
            string description,
            string showForGuest,
            string showForUser
        ) {
            var thisElement = new ContentElementModel();

            thisElement.Name = name;
            thisElement.Description = description;
            thisElement.Reference = reference;
            thisElement.ShowForGuest = showForGuest == "true";
            thisElement.ShowForUser = showForUser == "true";

            var baseElements = await _dataBase.GetElements( name );

            if ( baseElements.Count() > 0 )
            {
                thisElement.Id = baseElements.ElementAt(0).Id;
                thisElement.Image = baseElements.ElementAt(0).Image;
                await _dataBase.Update( thisElement );
            }
            else
            {
                await _dataBase.Create( thisElement );
            }
            if ( image != null )
            {
                var id = await _dataBase.GetElements( name );
                await _dataBase.StoreImage( id.ElementAt(0).Id, image.OpenReadStream(), image.Name );
            }
            return new StatusCodeResult( 200 );
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteContentElement( string name )
        {
            var elements = await _dataBase.GetElements( name );
            
            if ( elements.Count() > 0 )
            {
                await _dataBase.Remove( elements.ElementAt(0).Id );
                return new StatusCodeResult( 200 );
            }
            else 
            {
                this.HttpContext.Response.StatusCode = 421;
                return Content( "*element with this name doesn't exist" );
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetImage( string id )
        {
            var image = await _dataBase.GetImage(id);
            if (image == null)
            {
                return NotFound();
            }
            return File(image, "image/png");
        }
    }
}