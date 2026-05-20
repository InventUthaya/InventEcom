using DofyEcom.Contracts;
using DofyEcom.Contracts.Requests;
using DofyEcom.DAL;
using DofyEcom.Model;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using FirebaseAdmin.Messaging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Admin.API.Controllers
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


        [HttpGet]
        [Route("GetProductDetails/{productId}")]
        public async Task<ActionResult<ProductDetailsViewModel>> GetProductDetails(int productId)
        {
            try
            {
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

        [HttpGet]
        [Route("GetAllCommissionSlab")]
        public async Task<IActionResult> GetCommissionSlab()
        {
            try
            {
                var commissionSlabs = await this.Contract.GetCommissionDetails();

                if (commissionSlabs == null || !commissionSlabs.Any())
                {
                    return NotFound(new { message = "No commission slabs found." });
                }

                return Ok(commissionSlabs);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpGet]
        [Route("GetAllCommissionSlabDetails")]
        public async Task<IActionResult> GetAllCommissionSlabDetails()
        {
            try
            {
                var commissionSlabs = await this.Contract.GetAllCommissionSlabDetails();

                if (commissionSlabs == null || !commissionSlabs.Any())
                {
                    return NotFound(new { message = "No commission slabs found." });
                }

                return Ok(commissionSlabs);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPost]
        [Route("UpdateProduct")]
        public async Task<IActionResult> UpdateProduct([FromForm] CreateProductRequest request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new { message = "Invalid product data." });

                int updatedProductId = await this.Contract.UpdateProduct(request);

                return Ok(new
                {
                    ProductID = updatedProductId,
                    Message = "Product updated successfully."
                });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
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
        [Route("UpdateProductForEdit/{variantId}")]
        public async Task<ActionResult> UpdateProductForEdit(int variantId, [FromBody] UpdateProductViewModel request)
        {
            try
            {
                Console.WriteLine($"Updating variant with ID: {variantId}");


                if (request.ProductId <= 0)
                    return BadRequest(new { message = "Valid Product ID required." });

                // Other validations
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

                Console.WriteLine($"Successfully updated product: {request.ProductName}");

                return Ok(new
                {
                    message = "Variant updated successfully.",
                    productId = request.ProductId,
                    variantId = request.VariantId
                });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while updating the product.",
                    details = ex.Message
                });
            }
        }

        [HttpGet("inventory-report")]
        public async Task<IActionResult> GetInventoryFiltered([FromQuery] InventoryFilterRequest request)
        {
            try
            {
                var result = await productMasterModel.GetInventoryFilteredAsync(request);

                var list = (result ?? Enumerable.Empty<GetProductByIdViewModel>()).ToList();

                return Ok(new
                {
                    data = list,
                    total = list.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error fetching inventory report.",
                    details = ex.Message
                });
            }
        }

        [HttpGet]
        [Route("GetVariantForEdit/{variantId}")]
        public async Task<ActionResult<GetProductByIdViewModel>> GetVariantForEdit(int variantId)
        {
            try
            {
                var result = await productMasterModel.GetVariantForEditAsync(variantId);
                if (result == null)
                    return NotFound(new { message = "Variant not found." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error fetching variant for edit.",
                    details = ex.Message
                });
            }
        }



        [HttpPost]
        [Route("InActiveProduct")]
        public ActionResult<ActiveAndInActiveModelRequest> InActInActiveProductsiveProducts([FromBody] ActiveAndInActiveModelRequest request)
        {
            try
            {
                var result = this.Contract.InActiveProducts(request);
                return Ok(result);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Route("ActiveProduct")]
        public ActionResult<ActiveAndInActiveModelRequest> ActiveProducts([FromBody] ActiveAndInActiveModelRequest request)
        {
            try
            {
                var result = this.Contract.ActiveProducts(request);
                return Ok(result);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
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

    }
}
