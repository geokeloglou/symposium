using System.Threading.Tasks;
using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Symposium.Services.StorageService
{

    public interface IStorageService
    {
        public Task<Response<BlobContentInfo>> UploadAsync(IFormFile formFile);
    }
    
    public class StorageService : IStorageService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly IConfiguration _configuration;

        public StorageService(
            BlobServiceClient blobServiceClient,
            IConfiguration configuration)
        {
            _blobServiceClient = blobServiceClient;
            _configuration = configuration;
        }

        public async Task<Response<BlobContentInfo>> UploadAsync(IFormFile formFile)
        {
            var containerName = _configuration.GetSection("Storage:ContainerName").Value;
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(formFile.FileName);

            await using var stream = formFile.OpenReadStream();
            var response = await blobClient.UploadAsync(stream, true);

            return response;
        }
    }
}
