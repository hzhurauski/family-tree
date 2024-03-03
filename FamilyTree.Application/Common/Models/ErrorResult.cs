namespace FamilyTree.Application.Common.Models
{
    public class ErrorResult
    {
        public int Code { get; set; }

        public string Message { get; set; }

        public string ExceptionType { get; set; }
    }
}
