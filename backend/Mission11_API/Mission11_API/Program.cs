using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Mission11_API.Data;

var builder = WebApplication.CreateBuilder(args);

// ✅ Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowAll");

// Serve static files (like React build)
app.UseDefaultFiles();   // 👈 Add this line
app.UseStaticFiles();     // 👈 And this line

app.UseRouting();         // 👈 Add routing between static files and controllers
app.UseAuthorization();
app.MapControllers();

// Only show Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// If the route doesn't match an API route, fallback to React index.html
app.MapFallbackToFile("/index.html");  // 👈 Add this important line!

app.Run();

