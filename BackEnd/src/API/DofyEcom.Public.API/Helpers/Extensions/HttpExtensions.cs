namespace DofyEcom.Public.API.Helpers
{
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using Helper.Extensions;

    public static class HttpExtensions
    {
        public static HttpResponseMessage SendByteArrayAsAttachment(this byte[] byteContent, string fileName)
        {
            if (byteContent == null || byteContent.Length == 0)
            {
                return new HttpResponseMessage(HttpStatusCode.NoContent);
            }

            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            response.Content = new ByteArrayContent(byteContent);
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            response.Content.Headers.ContentDisposition.FileName = fileName;
            response.Content.Headers.ContentType = new MediaTypeHeaderValue(fileName.GetMimeType());

            return response;
        }
    }
}
