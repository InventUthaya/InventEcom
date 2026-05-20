

using System.Security.Principal;
using AutoMapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.Helper;
using DofyEcom.Logger;
using DofyEcom.UploadHelper;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Org.BouncyCastle.Asn1.Ocsp;

namespace DofyEcom.Model
{
    public class ProductReviewModel : BaseModel<DBO.ProductReview>, IProductReviewModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private new readonly IMapper mapper;
        private readonly IPrincipal? iPrincipal;
        private readonly CountryContext context;

        public ProductReviewModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
            : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.iPrincipal = iPrincipal;
            this.context = requestContext;
        }

        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        public ProductReview Get(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ProductReview> GetList()
        {
            throw new NotImplementedException();
        }

        public long Post(ProductReview item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(ViewEntities.ProductReview item)
        {
            var data = this.mapper.Map<ViewEntities.ProductReview, DBO.ProductReview>(item);

            data.UserId = item.UserId;
            data.SkuId = item.SkuId;
            data.Rating = item.Rating;
            data.ReviewText = item.ReviewText;
            data.ImagePath = item.ImagePath;
            data.ReviewDescription = item.ReviewDescription;
            data.ReviewDate = DateTime.Now;
            data.IsActive = true;
            this.AddItem(data);

            return data.Id;
        }


        public long Put(ProductReview item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(ProductReview item)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }


        public async Task<string> UploadReviewImage(IFormFile image, int skuId, string baseFolder)
        {
            string fileName = $"review_{skuId}_{Guid.NewGuid():N}{Path.GetExtension(image.FileName)}";
            string filePath = $"{baseFolder}/{fileName}";

            if (this.config?.Value.AWSConfiguration?.EnableS3 == true)
            {
                using var stream = image.OpenReadStream();
                await new S3ClientHelperService(this.config, this.GetS3FolderName(this.context.CountryCode))
                      .FileUploadAsync(stream, filePath);
            }
            else
            {
                string localPath = Path.Combine(this.config.Value.ApplicationConfiguration.AttachmentFilePath, baseFolder);
                Directory.CreateDirectory(localPath);
                string fileFullPath = Path.Combine(localPath, fileName);

                using var stream = image.OpenReadStream();
                using var fs = new FileStream(fileFullPath, FileMode.Create);
                await stream.CopyToAsync(fs);

                filePath = fileFullPath;
            }

            return filePath;
        }

        public IEnumerable<ProductReviewViewModel> GetProductReviews(int productId)
        {
            var reviews = this.FindItems(x =>
                x.IsActive == true &&
                x.SkuId == productId)
                .OrderByDescending(x => x.ReviewDate)
                .ToList();

            if (!reviews.Any())
                return Enumerable.Empty<ProductReviewViewModel>();

            var userMasterModel = new UserMasterModel(this.config, this.mapper, this.principle, this.context);


            var users = userMasterModel.FindItems(x => x.IsActive == true).ToList();

            var mappedReviews = new List<ProductReviewViewModel>();

            foreach (var review in reviews)
            {
                string userName = "";

                foreach (var user in users)
                {
                    if (user.Id == review.UserId)
                    {
                        userName = user.FullName;
                        break;
                    }
                }

                mappedReviews.Add(new ProductReviewViewModel
                {
                    username = userName,
                    SkuId = review.SkuId,
                    UserId = review.UserId,
                    Rating = review.Rating,
                    ReviewText = review.ReviewText ?? string.Empty,
                    ReviewDescription = review.ReviewDescription,
                    ReviewDate = review.ReviewDate,
                    ImageBase64 = null
                });
            }

            bool enableS3 = this.config?.Value?.AWSConfiguration?.EnableS3 == true;
            string countryCode = this.context?.CountryCode ?? string.Empty;

            string attachmentRoot =
                this.config?.Value?.ApplicationConfiguration?.AttachmentFilePath ?? string.Empty;

            S3ClientHelperService s3Helper = enableS3
                ? new S3ClientHelperService(this.config, countryCode)
                : null;

            for (int i = 0; i < reviews.Count; i++)
            {
                var dbReview = reviews[i];
                var vmReview = mappedReviews[i];

                if (string.IsNullOrWhiteSpace(dbReview.ImagePath))
                    continue;

                try
                {
                    byte[] imageBytes = null;

                    if (enableS3)
                    {
                        imageBytes = s3Helper
                            .FileDownloadAsync(dbReview.ImagePath)
                            .GetAwaiter()
                            .GetResult();
                    }
                    else
                    {
                        string fullPath = Path.Combine(
                            attachmentRoot,
                            dbReview.ImagePath.TrimStart('/', '\\')
                        );

                        if (File.Exists(fullPath))
                        {
                            imageBytes = File.ReadAllBytes(fullPath);
                        }
                    }

                    if (imageBytes == null || imageBytes.Length == 0)
                        continue;

                    string extension = Path.GetExtension(dbReview.ImagePath)?.ToLowerInvariant();
                    string mimeType = extension switch
                    {
                        ".png" => "image/png",
                        ".jpg" or ".jpeg" => "image/jpeg",
                        ".gif" => "image/gif",
                        ".webp" => "image/webp",
                        _ => "image/jpeg"
                    };

                    vmReview.ImageBase64 =
                        $"data:{mimeType};base64,{Convert.ToBase64String(imageBytes)}";
                }
                catch (Exception ex)
                {
                    SeriLogger.Error(ex,
                        $"Failed to load review image. Path: {dbReview.ImagePath}");
                }
            }

            return mappedReviews;
        }




    }
}
