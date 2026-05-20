namespace DofyEcom.Helper.Extensions
{
    using System;
    using System.IO;
    using System.Linq;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;

    public static class FileExtensions
    {
        private static IHostingEnvironment m_env;

        public static string LocalExcelTemplateRoot
        {
            get
            {
                return Path.Combine(m_env.WebRootPath, @"~/App_Data/ExcelImportTemplate");
            }
        }

        public static byte[] ReadExcelTemplate(this string fileName)
        {
            string fullPath = Path.Combine(LocalExcelTemplateRoot, fileName);
            return fullPath.ReadFromFile();
        }

        public static byte[] ReadFromFile(this string fullPath)
        {
            if (File.Exists(fullPath))
            {
                try
                {
                    byte[] buffer;
                    using (FileStream fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read))
                    {
                        int length = (int)fileStream.Length;
                        buffer = new byte[length];
                        int count;
                        int sum = 0;

                        while ((count = fileStream.Read(buffer, sum, length - sum)) > 0)
                        {
                            sum += count;
                        }
                    }

                    return buffer;
                }
                catch (Exception ex)
                {
                    ////Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                    throw ex;
                }
            }

            return null;
        }

        public static byte[] ConvertToBytes(this string filePath)
        {
            if (!string.IsNullOrEmpty(filePath) && File.Exists(filePath))
            {
                using (var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
                {
                    // Fill th  e bytes[] array with the stream data
                    byte[] bytesInStream = new byte[fileStream.Length];
                    fileStream.Read(bytesInStream, 0, (int)bytesInStream.Length);
                    return bytesInStream;
                }
            }

            return default(byte[]);
        }

        public static byte[] ConvertToBytesWithCleanUp(this string filePath)
        {
            if (!string.IsNullOrEmpty(filePath) && File.Exists(filePath))
            {
                byte[] bytesInStream = default(byte[]);
                using (var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
                {
                    // Fill th  e bytes[] array with the stream data http://stackoverflow.com/questions/1497997/c-reliable-way-to-convert-a-file-to-a-byte
                    bytesInStream = File.ReadAllBytes(filePath);
                    fileStream.Read(bytesInStream, 0, (int)bytesInStream.Length);
                }

                // clean up the file before download.
                DeleteFile(filePath);

                return bytesInStream;
            }

            return default(byte[]);
        }

        public static string SaveAttachment(this IFormFileCollection fileColletion, string absoluteFilePath)
        {
            CreateDirectoryIfNotExist(absoluteFilePath);
            var file = fileColletion.FirstOrDefault();
            if (file != null)
            {
                FileInfo into = new FileInfo(file.Name);
                string filename = Guid.NewGuid().ToString() + "." + into.Extension.Replace(".", string.Empty);
                var fileFullPath = Path.Combine(absoluteFilePath, filename);
                using (Stream stream = file.OpenReadStream())
                {
                    // Fill the bytes[] array with the stream data
                    byte[] bytesInStream = new byte[stream.Length];
                    stream.Read(bytesInStream, 0, (int)bytesInStream.Length);

                    DeleteFile(fileFullPath);

                    // Use FileStream object to write to the specified file
                    File.WriteAllBytes(fileFullPath, bytesInStream);
                    stream.FlushAsync();
                }

                return fileFullPath;
            }

            return string.Empty;
        }

        public static async Task<IList<string>> SaveAttachments(this IFormFileCollection fileColletion, string absoluteFilePath)
        {
            CreateDirectoryIfNotExist(absoluteFilePath);
            IList<string> filePathList = new List<string>();
            foreach (IFormFile file in fileColletion)
            {
                string fileFullPath = Path.Combine(absoluteFilePath, file.FileName);
                filePathList.Add(fileFullPath);
                using (Stream stream = file.OpenReadStream())
                {
                    // Fill the bytes[] array with the stream data
                    byte[] bytesInStream = new byte[stream.Length];
                    stream.Read(bytesInStream, 0, (int)bytesInStream.Length);

                    await File.WriteAllBytesAsync(fileFullPath, bytesInStream);
                    await stream.FlushAsync();
                }
            }

            return filePathList;
        }

        public static void DeleteFile(string filePath)
        {
            try
            {
                if (File.Exists(filePath))
                {
                    GC.Collect();
                    GC.WaitForPendingFinalizers();
                    File.Delete(filePath);
                }
            }
            catch
            {
            }
        }

        public static void CreateDirectoryIfNotExist(this string directoryPath)
        {
            bool exists = Directory.Exists(directoryPath);
            if (!exists)
            {
                Directory.CreateDirectory(directoryPath);
            }
        }

        public static string GetMimeType(this string fileName)
        {
            string mimeType = "image/jpg";
            switch (Path.GetExtension(fileName)?.RemoveSymbol()?.ToLower())
            {
                case "png":
                    return "image/png";
                case "csv":
                    return "application/txt";
                case "pdf":
                    return "application/pdf";
                case "doc":
                    return "application/msword";
                case "docx":
                    return "application/vnd.openxmlformats-officedocument.word";
            }

            return mimeType;
        }
    }
}
