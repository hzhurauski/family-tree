using Microsoft.AspNetCore.Mvc;

namespace FamilyTree.Controllers.Support
{
    public class SupportController : Controller
    {
        [HttpGet]
        public IActionResult About()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Reference()
        {
            return View();
        }
    }
}