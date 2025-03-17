namespace Mission11_API.Models // This must match your project namespace
{
    public class Book
    {
        public int BookID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Publisher { get; set; } = string.Empty;
        public string ISBN { get; set; } = string.Empty;
        public string Classification { get; set; } = string.Empty;
        public int PageCount { get; set; }
        public decimal Price { get; set; }
    }
}
