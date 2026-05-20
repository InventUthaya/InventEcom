namespace DofyEcom.UploadHelper;

using System.IO;
using System.Threading.Tasks;

public interface IS3ClientHelperService
{
    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    Task<bool> IsFileExistsAsync(string fileFullPath, string alternativeBucketName = null);


    /// <summary>
    /// 
    /// </summary>
    /// <param name="fileFullPath"></param>
    /// <returns></returns>
    Task<long> FileContentLengthAsync(string fileFullPath, string alternativeBucketName = null);

    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    Task<bool> PhysicalFileUploadAsync(string physicalFilePath, string bucketName, string fileName = null);


    /// <summary>
    /// 
    /// </summary>
    /// <param name="directoryPath"></param>
    /// <param name="s3FolderName"></param>
    /// <param name="wildCard"></param>
    /// <returns></returns>
    Task<bool> UploadDirectoryAsync(string directoryPath, string s3FolderName, string wildCard = "*.*");

    /// <summary>
    /// 
    /// </summary>
    /// <param name="fileFullPath"></param>
    /// <returns></returns>
    Task<byte[]> FileDownloadAsync(string fileFullPath, string alternativeBucketName = null);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="fileFullPath"></param>
    /// <returns></returns>
    Task<bool> DeleteFileAsync(string fileFullPath);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="fileStream"></param>
    /// <param name="fileFullPath"></param>
    /// <returns></returns>
    Task<bool> FileUploadAsync(Stream fileStream, string fileFullPath);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="fileStream"></param>
    /// <param name="fileFullPath"></param>
    /// <returns></returns>
    Task<bool> FileUploadAsync(Stream fileStream, string fileFullPath, string alternativeBucketName = null);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="requestId"></param>
    /// <param name="cloneRequestId"></param>
    /// <returns></returns>
    Task<bool> RequestFolderCloneAsync(long requestId, long cloneRequestId);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="fileFullPath"></param>
    /// <returns></returns>
    Task<string> GetLatestFileVersionIdAsync(string fileFullPath);
}
