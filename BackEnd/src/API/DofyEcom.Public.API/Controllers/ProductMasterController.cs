using AutoMapper;
using DofyEcom.Contracts;
using DofyEcom.Contracts.Requests;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using static iText.StyledXmlParser.Jsoup.Select.Evaluator;

namespace DofyEcom.Public.API.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductMasterController : BaseController<IProductMasterModel, ViewEntities.ProductMaster>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IProductMasterModel productMasterModel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public ProductMasterController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IProductMasterModel productMasterModel, CountryContext requestContext)
            : base(productMasterModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.productMasterModel = productMasterModel;
            this.requestContext = requestContext;
        }

        [HttpPost]
        [Route("CreateProduct")]
        public async Task<ActionResult<CreateProductResponse>> CreateProduct([FromForm] CreateProductRequest request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new { message = "Invalid product data." });

                var productId = await this.Contract.CreateProduct(request);

                return Ok(new CreateProductResponse
                {
                    ProductId = productId,
                    Message = "Product created successfully"
                });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred while creating the product.", details = ex.Message });
            }
        }

        public class CreateProductResponse
        {
            public int ProductId { get; set; }
            public string Message { get; set; }
        }

        [HttpPost]
        [Route("SearchProducts")]
        public ActionResult<SearchProductsResult> SearchProducts([FromBody] ProductSearchRequest request)
        {
            try
            {
                var result = this.Contract.GetAllProducts(request);
                return Ok(result);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost]
        [Route("GetProductById")]
        public async Task<ActionResult<ProductDetailsViewModel>> GetProductById(
            [FromQuery] int productId,
            [FromQuery] string? attribute = null
        )
        {
            try
            {
                var product = await this.Contract.GetProductDetails(productId);

                if (product == null)
                    return NotFound(new { message = "Product not found." });

                // Optional: handle attribute if needed
                // if (!string.IsNullOrEmpty(attribute)) { ... }

                return Ok(new
                {
                    Items = new[] { product }
                });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPost]
        [Route("UpdateProduct")]
        public async Task<ActionResult<int>> UpdateProduct([FromBody] CreateProductRequest request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new { message = "Invalid product data." });

                var updatedProductId = this.Contract.UpdateProduct(request);
                return Ok(new { ProductID = updatedProductId, Message = "Product updated successfully." });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("inventory-report")]
        public async Task<ActionResult<IEnumerable<GetProductByIdViewModel>>> GetInventoryReport()
        {
            try
            {
                var result = await productMasterModel.GetInventoryReportAsync();
                if (result == null || !result.Any())
                    return NotFound(new { message = "No products found in inventory report." });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching the inventory report.", details = ex.Message });
            }
        }

        [HttpGet]
        [Route("GetProductForEdit/{productId}")]
        public async Task<ActionResult<GetProductByIdViewModel>> GetProductForEdit(int productId)
        {
            try
            {
                Console.WriteLine($"Fetching product for edit with ID: {productId}"); // Debug log

                var result = await productMasterModel.GetProductByIdAsync(productId);
                if (result == null)
                    return NotFound(new { message = "Product not found." });

                Console.WriteLine($"Successfully fetched product: {result.ProductName}"); // Debug log
                return Ok(result);
            }
            catch (ApplicationException ex)
            {
                Console.WriteLine($"Application error in GetProductForEdit: {ex.Message}"); // Debug log
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetProductForEdit: {ex.Message}"); // Debug log
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching the product for editing.",
                    details = ex.Message
                });
            }
        }

        [HttpPost]
        [Route("UpdateProductForEdit/{productId}")]
        public async Task<ActionResult> UpdateProductForEdit(int productId, [FromBody] UpdateProductViewModel request)
        {
            try
            {
                //int productId = 1;
                Console.WriteLine($"Updating product with ID: {productId}"); // Debug log

                if (productId != request.ProductId)
                    return BadRequest(new { message = "Product ID mismatch." });

                // Validation
                if (string.IsNullOrWhiteSpace(request.ProductName))
                    return BadRequest(new { message = "Product name is required." });

                if (request.CategoryId <= 0)
                    return BadRequest(new { message = "Valid category is required." });

                if (request.BrandId <= 0)
                    return BadRequest(new { message = "Valid brand is required." });

                if (request.StatusId <= 0)
                    return BadRequest(new { message = "Valid status is required." });

                if (request.BasePrice <= 0)
                    return BadRequest(new { message = "Base price must be greater than 0." });

                await productMasterModel.UpdateProductAsync(request);

                Console.WriteLine($"Successfully updated product: {request.ProductName}"); // Debug log
                return Ok(new
                {
                    message = "Product updated successfully.",
                    productId = request.ProductId
                });
            }
            catch (ApplicationException ex)
            {
                Console.WriteLine($"Application error in UpdateProductForEdit: {ex.Message}"); // Debug log
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateProductForEdit: {ex.Message}"); // Debug log
                return StatusCode(500, new
                {
                    message = "An error occurred while updating the product.",
                    details = ex.Message
                });
            }
        }

        //[HttpGet("{id}")]
        //public async Task<ActionResult<ProductDetailsViewModel>> GetProductById(int id)
        //{
        //    try
        //    {
        //        var result = await productMasterModel.GetProductByIdAsync(id);
        //        if (result == null)
        //            return NotFound(new { message = $"Product with ID {id} not found." });
        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { message = "An error occurred while fetching product details.", details = ex.Message });
        //    }
        //}


        [HttpGet]
        [Route("GetProductsById")]
        public async Task<PagedList<ProductMaster>> GetByIds(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                return null;

            List<long> idList = new();

            try
            {
                foreach (var encryptedId in id.Split(',', StringSplitOptions.RemoveEmptyEntries))
                {
                    var decrypted = DecryptAES(encryptedId);
                    if (!long.TryParse(decrypted, out var longId))
                    {
                        continue;
                    }
                    idList.Add(longId);
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Failed to decrypt or parse product ID.", ex);
            }

            var results = await Task.Run(() => this.Contract.GetProducts(idList));

            return results;
        }

        [HttpGet]
        [Route("GetAllProducts")]
        public async Task<IEnumerable<ProductMaster>> GetAllProducts()
        {
            var result = await Task.Run(() =>
            {
                return this.Contract.GetList();
            });

            return result;
        }


        [HttpGet]
        [Route("GetAllProductBySearch")]
        public async Task<IEnumerable<ProductMaster>> GetAllProductBySearch(string searchText)
        {
            var result = await Task.Run(() =>
            {
                return this.Contract.GetListBysearch(searchText);
            });

            return result;
        }


        [HttpGet("GetProductById/{encryptedId}")]

        public async Task<ActionResult<GetProductByIdViewModel>> GetProductById(string encryptedId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(encryptedId))
                    return null;


                int productId = (int)Convert.ToInt64(DecryptAES(encryptedId.ToString()));
                var product = await this.Contract.GetProductDetails(productId);
                if (product == null)
                    return NotFound(new { message = "Product not found." });

                return Ok(product);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Route("GetRelatedProduct")]
        public async Task<PagedList<GetProductByIdViewModel>> GetRelatedProduct(string productName)
        {
            var result = await Task.Run(() =>
            {
                return this.Contract.GetRelatedProduct(productName);
            });

            return result;
        }


        [HttpGet]
        [Route("GetRelatedProductById")]
        public async Task<PagedList<ProductDetailsViewModel>> GetRelatedProductById(string productId)
        {
            var id = 0;
            if (!string.IsNullOrEmpty(productId))
            {
                id = (int)Convert.ToInt64(DecryptAES(productId.ToString()));
            }
            var result = await Task.Run(() =>
            {
                return this.Contract.GetRelatedProductById(id);
            });

            return result;
        }


        [HttpPost]
        [Route("GetSpecificationFilter")]
        public async Task<PagedList<FilterViewModel>> GetSpecificationFilter([FromQuery] string? Brand, string? Condition, string? Storage, string? ItemCategory, string? Price, string? Category, string? Ram, string? Color)
        {
            //int id = 0;
            //if (!string.IsNullOrWhiteSpace(CategoryId) &&
            //    CategoryId != "undefined" &&
            //    IsValidHex(CategoryId))
            //{
            //    id = Convert.ToInt32(DecryptAES(CategoryId));
            //}

            var result = await Task.Run(() =>   
            {
                return this.Contract.GetSpecificationFilter(Brand, Condition, Storage, ItemCategory, Price, Category, Ram, Color);
            });

            return result;
        }
        private bool IsValidHex(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return false;

            if (value.Length % 2 != 0)
                return false;

            return System.Text.RegularExpressions.Regex
                .IsMatch(value, @"\A\b[0-9a-fA-F]+\b\Z");
        }


        [HttpPost]
        [Route("GetSpecificationDetails")]
        public async Task<PagedList<FilterViewModel>> GetSpecificationDetails()
        {
            var result = await Task.Run(() =>
            {
                return this.Contract.GetSpecificationDetails();
            });

            return result;
        }

        [HttpPost]
        [Route("GetHomePageFilter")]
        public async Task<PagedList<FilterViewModel>> GetHomePageFilter([FromBody] DateTime clientTime)
        {
            var result = await Task.Run(() =>
            {
                return this.Contract.GetHomePageFilter(clientTime);
            });

            return result;
        }

        [HttpPost]
        [Route("GetProductByPrice")]
        public async Task<PagedList<GetProductByPriceViewModel>> GetProductByPrice(string? price, int? categoryId)
        {
            var result = await Task.Run(() =>
            {
                return this.Contract.GetProductByPrice(price, categoryId);
            });

            return result;
        }


        [HttpGet]
        [HttpPost]
        [Route("GetAllCategoryProducts")]
        public async Task<CategoryTreeResponseViewModel> GetAllCategoryProducts()
        {
            return await this.Contract.GetAllCategoryProducts();
        }

        [HttpPost]
        [Route("GetDiscountAppliedProducts")]
        public PagedList<FilterViewModel> GetDiscountAppliedProducts()
        {
            return this.Contract.GetDiscountAppliedProducts();
        }

    }
}
