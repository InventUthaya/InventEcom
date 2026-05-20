namespace DofyEcom.UploadHelper;

using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using DofyEcom.Helper;
using DofyEcom.Helper.Extensions;
using DofyEcom.Logger;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

public class S3ClientHelperService : IS3ClientHelperService
{
    private readonly string awsRegion;
    private readonly string awsAccessKey;
    private readonly string awsSecretKey;
    private readonly string environment;
    private readonly string awsBucketName;

    private readonly IAmazonS3 awsClient;

    public S3ClientHelperService(IOptionsSnapshot<AppConfiguration> _AppConfiguration, string country)
    {
        awsRegion = _AppConfiguration.Value.AWSConfiguration.AWSRegion;
        environment = _AppConfiguration.Value.AWSConfiguration.Environment + country;
        awsAccessKey = _AppConfiguration.Value.AWSConfiguration.AWSAccessKey;
        awsSecretKey = _AppConfiguration.Value.AWSConfiguration.AWSSecretKey;
        awsBucketName = _AppConfiguration.Value.AWSConfiguration.AWSBucketName;
        awsClient = new AmazonS3Client(awsAccessKey, awsSecretKey, Amazon.RegionEndpoint.GetBySystemName(awsRegion));
    }

    public async Task<bool> PhysicalFileUploadAsync(string physicalFilePath, string bucketName, string fileName = null)
    {
        try
        {
            TransferUtility fileTransferUtility = new TransferUtility(awsClient);

            if (string.IsNullOrEmpty(fileName))
            {
                await fileTransferUtility.UploadAsync(physicalFilePath, string.Concat(awsBucketName, bucketName));
            }
            else
            {
                await fileTransferUtility.UploadAsync(physicalFilePath, string.Concat(awsBucketName, bucketName), fileName);
            }

            return true;
        }
        catch (Exception ex)
        {
            SeriLogger.Fatal(ex, "FileTransferAsync Exception in AWS. FileName: " + fileName);
            throw;
        }
    }

    public async Task<bool> UploadDirectoryAsync(string directoryPath, string s3FolderName, string wildCard = "*.*")
    {
        try
        {
            TransferUtility directoryTransferUtility = new TransferUtility(awsClient);
            await directoryTransferUtility.UploadDirectoryAsync(
                                           directoryPath,
                                           string.Concat(awsBucketName, "/", environment, "/", s3FolderName),
                                           wildCard,
                                           SearchOption.AllDirectories);
            return true;
        }
        catch (Exception ex)
        {
            SeriLogger.Fatal(ex, "UploadDirectoryAsync Exception in AWS.");
            throw;
        }
    }

    /// <summary>
    /// AWS S3 Bucket File Upload
    /// </summary>
    /// <param name="fileStream">ec pdf file stream</param>
    /// <param name="fileName">ec pdf file name</param>
    /// <returns>IsFile Upload or Not</returns>
    public async Task<bool> FileUploadAsync(Stream fileStream, string fileFullPath)
    {
        if (fileStream != null && !string.IsNullOrEmpty(fileFullPath))
        {
            try
            {
                TransferUtility fileTransferUtility = new TransferUtility(awsClient);
                TransferUtilityUploadRequest request = new TransferUtilityUploadRequest
                {
                    BucketName = awsBucketName,
                    Key = string.Concat(environment, "/", fileFullPath),
                    InputStream = fileStream
                };

                await fileTransferUtility.UploadAsync(request);
                return true;
            }
            catch (Exception ex)
            {
                SeriLogger.Fatal(ex, "File Upload Exception in AWS. FileName: " + fileFullPath);
                throw;
            }
        }

        return false;
    }

    public async Task<IList<string>> SaveAttachmentsToS3(IFormFileCollection fileColletion, string absoluteFilePath)
    {
        IList<string> filePathList = new List<string>();
        foreach (IFormFile file in fileColletion)
        {
            string fileFullPath = string.Concat(absoluteFilePath, '/', file.FileName);
            filePathList.Add(fileFullPath);
            using (Stream stream = file.OpenReadStream())
            {
                var result = await this.FileUploadAsync(stream, fileFullPath);
                await stream.FlushAsync();
            }
        }

        return filePathList;
    }

    /// <summary>
    /// AWS S3 Bucket File Upload
    /// </summary>
    /// <param name="fileStream">ec pdf file stream</param>
    /// <param name="fileName">ec pdf file name</param>
    /// <returns>IsFile Upload or Not</returns>
    public async Task<bool> FileUploadAsync(Stream fileStream, string fileFullPath, string alternativeBucketName = null)
    {
        if (fileStream != null && !string.IsNullOrEmpty(fileFullPath))
        {
            try
            {
                TransferUtility fileTransferUtility = new TransferUtility(awsClient);
                TransferUtilityUploadRequest request = new TransferUtilityUploadRequest
                {
                    BucketName = string.IsNullOrEmpty(alternativeBucketName) ? awsBucketName : alternativeBucketName,
                    Key = string.Concat(environment, "/", fileFullPath),
                    InputStream = fileStream
                };

                await fileTransferUtility.UploadAsync(request);
                return true;
            }
            catch (Exception ex)
            {
                SeriLogger.Fatal(ex, "File Upload Exception in AWS. FileName: " + fileFullPath);
                throw;
            }
        }

        return false;
    }

    /// <summary>
    /// File Download From AWS S3 Bucket
    /// </summary>
    /// <param name="requestId">Request Id Value</param>
    /// <param name="fileName">File Name</param>
    /// <returns>byte array value of file</returns>
    public async Task<byte[]> FileDownloadAsync(string fileFullPath, string alternativeBucketName = null)
    {
        try
        {
            GetObjectRequest request = new GetObjectRequest
            {
                BucketName = string.IsNullOrEmpty(alternativeBucketName) ? awsBucketName : alternativeBucketName,
                Key = string.Concat(environment, "/", fileFullPath)
            };

            using GetObjectResponse response = await awsClient.GetObjectAsync(request);
            using Stream responseStream = response.ResponseStream;
            return responseStream.ReadStreamAsByteArray();
        }
        catch (Exception ex)
        {
            SeriLogger.Fatal(ex, "File Download Exception in AWS." + fileFullPath);
            throw;
        }
    }

    /// <summary>
    /// File Delete From AWS S3 Bucket
    /// </summary>
    /// <param name="fileFullPath"></param>
    /// <returns></returns>
    public async Task<bool> DeleteFileAsync(string fileFullPath)
    {
        try
        {
            DeleteObjectRequest request = new DeleteObjectRequest
            {
                BucketName = awsBucketName,
                Key = string.Concat(environment, "/", fileFullPath)
            };

            DeleteObjectResponse response = await awsClient.DeleteObjectAsync(request);

            return true;
        }
        catch (AmazonS3Exception ex)
        {
            if (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                return false;

            throw;
        }
    }

    public async Task<bool> IsFileExistsAsync(string fileFullPath, string alternativeBucketName = null)
    {
        try
        {
            GetObjectMetadataRequest request = new GetObjectMetadataRequest
            {
                BucketName = string.IsNullOrEmpty(alternativeBucketName) ? awsBucketName : alternativeBucketName,
                Key = string.Concat(environment, "/", fileFullPath)
            };

            GetObjectMetadataResponse response = await awsClient.GetObjectMetadataAsync(request);

            return true;
        }
        catch (AmazonS3Exception ex)
        {
            if (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                return false;

            throw;
        }
    }

    public async Task<long> FileContentLengthAsync(string fileFullPath, string alternativeBucketName = null)
    {
        try
        {
            GetObjectMetadataRequest request = new GetObjectMetadataRequest
            {
                BucketName = string.IsNullOrEmpty(alternativeBucketName) ? awsBucketName : alternativeBucketName,
                Key = string.Concat(environment, "/", fileFullPath)
            };

            GetObjectMetadataResponse response = await awsClient.GetObjectMetadataAsync(request);

            return response?.ContentLength ?? 0;
        }
        catch (AmazonS3Exception ex)
        {
            if (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                return 0;

            throw;
        }
    }

    public async Task<string> GetLatestFileVersionIdAsync(string fileFullPath)
    {
        try
        {
            ListVersionsRequest request = new ListVersionsRequest
            {
                BucketName = awsBucketName,
                Prefix = string.Concat(environment, "/", fileFullPath),
                Delimiter = "/"
            };

            ListVersionsResponse response = await awsClient.ListVersionsAsync(request);
            return response.Versions?.FirstOrDefault(item => item.IsLatest == true)?.VersionId;
        }
        catch (AmazonS3Exception ex)
        {
            if (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                return default;

            throw;
        }
    }

    public async Task<bool> RequestFolderCloneAsync(long requestId, long cloneRequestId)
    {
        try
        {
            string previousRequestId = Convert.ToString(requestId);
            string currentRequestId = Convert.ToString(cloneRequestId);

            if (requestId > 0 && cloneRequestId > 0)
            {
                ListObjectsRequest request = new ListObjectsRequest
                {
                    BucketName = this.awsBucketName,
                    Prefix = string.Concat(this.environment, "/", previousRequestId),
                };
                ListObjectsResponse response = await awsClient.ListObjectsAsync(request);

                Parallel.ForEach(response?.S3Objects, async s3Object =>
                {
                    string sourceFolderPath = s3Object.Key;
                    string destinationFolderPath = sourceFolderPath?.Replace(previousRequestId, currentRequestId);

                    CopyObjectRequest copyObject = new CopyObjectRequest
                    {
                        SourceBucket = this.awsBucketName,
                        SourceKey = sourceFolderPath,
                        DestinationBucket = this.awsBucketName,
                        DestinationKey = destinationFolderPath
                    };
                    CopyObjectResponse copyObjectresponse = await awsClient.CopyObjectAsync(copyObject);
                });

                return true;
            }

            return false;
        }
        catch (Exception ex)
        {
            SeriLogger.Fatal(ex, "RequestFolderCloneAsync Exception in AWS.");
            throw;
        }
    }
}
