using FamilyTree.Application.Common.Exceptions;
using FamilyTree.Application.Common.Models;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace FamilyTree.WebUI.Controllers.Errors
{
    public class ErrorController : Controller
    {
        public ActionResult<ErrorResult> Index()
        {
            var context = HttpContext.Features.Get<IExceptionHandlerFeature>();
            var exception = context.Error;

            ErrorResult result = new ErrorResult();

            if (exception is NotFoundException)
            {
                result.Code = (int)HttpStatusCode.NotFound;
                result.ExceptionType = nameof(NotFoundException);
                result.Message = exception.Message;
            }
            else
            {
                result.Code = (int)HttpStatusCode.InternalServerError;
                result.ExceptionType = exception.GetType().FullName;
                result.Message = exception.Message;
            }

            Response.StatusCode = result.Code;            

            return result;
        }
    }
}
