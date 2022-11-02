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
    public class ContentService
    {
        IGridFSBucket gridFS;   // файловое хранилище
        IMongoCollection<ContentElementModel> Elements; // коллекция в базе данных
        public IConfiguration AppConfiguration { get; set; }
        public ContentService()
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
            Elements = database.GetCollection<ContentElementModel>("ContentElements");
        }
        // получаем все документы, используя критерии фальтрации
        public async Task<IEnumerable<ContentElementModel>> GetElements( string name )
        {
            // строитель фильтров
            var builder = new FilterDefinitionBuilder<ContentElementModel>();
            var filter = builder.Empty; // фильтр для выборки всех документов

            if (!String.IsNullOrWhiteSpace( name ))
            {
                filter = filter & builder.Regex("Name", new BsonRegularExpression( name ));
            }
 
            return await Elements.Find(filter).ToListAsync();
        }
        public async Task<ContentElementModel> GetElement(string id)
        {
            return await Elements.Find(new BsonDocument("_id", new ObjectId(id))).FirstOrDefaultAsync();
        }
        // добавление документа
        public async Task Create(ContentElementModel p)
        {
            await Elements.InsertOneAsync(p);
        }
        // обновление документа
        public async Task Update(ContentElementModel p)
        {
            await Elements.ReplaceOneAsync(new BsonDocument("_id", new ObjectId(p.Id)), p);
        }
         //удаление документа
        public async Task Remove(string id)
        {
            var element = await GetElement( id );
            if ( !string.IsNullOrEmpty( element.Image ) )
                await gridFS.DeleteAsync( new ObjectId( element.Image ) );

            await Elements.DeleteOneAsync(new BsonDocument("_id", new ObjectId(id)));
        }
        public async Task< byte[] > GetImage( string id )
        {
            return await gridFS.DownloadAsBytesAsync( new ObjectId( id ) );
        }
        public async Task StoreImage(string id, Stream imageStream, string imageName)
        {
            ContentElementModel p = await GetElement(id);
            if (p.HasImage())
            {
                // если ранее уже была прикреплена картинка, удаляем ее
                await gridFS.DeleteAsync(new ObjectId(p.Image));
            }
            // сохраняем изображение
            ObjectId imageId = await gridFS.UploadFromStreamAsync(imageName, imageStream);
            // обновляем данные по документу
            p.Image = imageId.ToString();
            var filter = Builders<ContentElementModel>.Filter.Eq("_id", new ObjectId(p.Id));
            var update = Builders<ContentElementModel>.Update.Set("Image", p.Image);
            await Elements.UpdateOneAsync(filter, update);
        }
    }
}