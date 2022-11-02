using MongoDB.Driver.GridFS;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
 
namespace ASP.NET_sm.Models
{
    public class UserService
    {
        IGridFSBucket gridFS;   // файловое хранилище
        IMongoCollection<UserModel> Users; // коллекция в базе данных
        public IConfiguration AppConfiguration { get; set; }
        public UserService()
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json");
            AppConfiguration = builder.Build();

            IConfigurationSection databaseConf = AppConfiguration.GetSection("DataBase");
            // строка подключения
            string connectionString = databaseConf.GetSection("ConnectionString").Value.ToString();
            var connection = new MongoUrlBuilder(connectionString);
            // получаем клиента для взаимодействия с базой данных
            MongoClient client = new MongoClient(connectionString);
            // получаем доступ к самой базе данных
            IMongoDatabase database = client.GetDatabase(connection.DatabaseName);
            // получаем доступ к файловому хранилищу
            gridFS = new GridFSBucket(database);
            // обращаемся к коллекции Users
            Users = database.GetCollection<UserModel>("Users");
        }
        // получаем все документы, используя критерии фальтрации
        public async Task<IEnumerable<UserModel>> GetUsers( string email )
        {
            // строитель фильтров
            var builder = new FilterDefinitionBuilder<UserModel>();
            var filter = builder.Empty; // фильтр для выборки всех документов

            if (!String.IsNullOrWhiteSpace(email))
            {
                filter = filter & builder.Regex("Email", new BsonRegularExpression(email));
            }
 
            return await Users.Find(filter).ToListAsync();
        }
 
        // получаем один документ по id
        public async Task<UserModel> GetUser(string id)
        {
            return await Users.Find(new BsonDocument("_id", new ObjectId(id))).FirstOrDefaultAsync();
        }
        // добавление документа
        public async Task Create(UserModel p)
        {
            await Users.InsertOneAsync(p);
        }
        // обновление документа
        public async Task Update(UserModel p)
        {
            await Users.ReplaceOneAsync(new BsonDocument("_id", new ObjectId(p.Id)), p);
        }
         //удаление документа
        public async Task Remove(string id)
        {
            await Users.DeleteOneAsync(new BsonDocument("_id", new ObjectId(id)));
        }
    }
}