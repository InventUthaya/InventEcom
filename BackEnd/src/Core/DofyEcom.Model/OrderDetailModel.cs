namespace DofyEcom.Model
{
    using System.Security.Principal;
    using System.Text;
    using AutoMapper;
    using Dapper;
    using DataTables.AspNet.Core;
    using DofyEcom.Contracts;
    using DofyEcom.Contracts.Requests;
    using DofyEcom.Contracts.Responses;
    using DofyEcom.DAL.Mapper;
    using DofyEcom.DBO;
    using DofyEcom.Helper;
    using DofyEcom.UploadHelper;
    using DofyEcom.ViewEntities;
    using DofyEcom.ViewEntities.ViewModel;
    using iText.Html2pdf;
    using iText.Kernel.Pdf;
    using iText.Layout.Borders;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;
    using Org.BouncyCastle.Asn1.Ocsp;

    public class OrderDetailModel : BaseModel<DBO.OrderDetail>, IOrderDetailModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;


        public OrderDetailModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
            : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.iPrincipal = iPrincipal;
            this.context = requestContext;

        }

        public OrderCreateResponse CreateOrder(CreateOrderRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserID", request.UserID);
            parameters.Add("@AddressID", request.AddressID);
            parameters.Add("@PaymentMethod", request.PaymentMethod);
            parameters.Add("@SKUIds", request.SKUIds);
            parameters.Add("@PromoCode", request.PromoCode);
            parameters.Add("@CreatedBy", this.UserId.ToString());
            parameters.Add("@AddressLine1", request.OrderAddress.AddressLine1);
            parameters.Add("@AddressLine2", request.OrderAddress.AddressLine2);
            parameters.Add("@City", request.OrderAddress.City);
            parameters.Add("@State", request.OrderAddress.State);
            parameters.Add("@Country", request.OrderAddress.Country);
            parameters.Add("@Pincode", request.OrderAddress.Pincode);

            var result = this.ExecStoredProcedure<OrderCreateResponse>(Database.SP_CreateOrder, parameters);
            return result.FirstOrDefault();
        }
        //public List<OrderCreateResponse> CreateBulkOrder(List<CreateOrderRequest> requests)
        //{
        //    var responses = new List<OrderCreateResponse>();

        //    foreach (var request in requests)
        //    {
        //        var parameters = new DynamicParameters();
        //        parameters.Add("@UserID", request.UserID);
        //        parameters.Add("@AddressID", request.AddressID);
        //        parameters.Add("@PaymentMethod", request.PaymentMethod);
        //        parameters.Add("@SKUIds", request.SKUIds);
        //        parameters.Add("@PromoCode", request.PromoCode);
        //        parameters.Add("@CreatedBy", this.UserId.ToString());
        //        parameters.Add("@AddressLine1", request.OrderAddress?.AddressLine1);
        //        parameters.Add("@AddressLine2", request.OrderAddress?.AddressLine2);
        //        parameters.Add("@City", request.OrderAddress?.City);
        //        parameters.Add("@State", request.OrderAddress?.State);
        //        parameters.Add("@Country", request.OrderAddress?.Country);
        //        parameters.Add("@Pincode", request.OrderAddress?.Pincode);

        //        var result = this.ExecStoredProcedure<OrderCreateResponse>(
        //            Database.SP_CreateOrder,
        //            parameters
        //        ).FirstOrDefault();

        //        responses.Add(result);
        //    }

        //    return responses;
        //}

        public List<OrderCreateResponse> CreateBulkOrder(List<CreateOrderRequest> requests)
        {
            var responses = new List<OrderCreateResponse>();
            if (requests == null || !requests.Any()) return responses;

            var request = requests[0];
            var productQuantity = request.ProductQuantity;

            // Stock validation for all SKUs first
            foreach (var quant in productQuantity)
            {
                var skuModel = new SkuModel(this.config, this.mapper, this.principle, this.context);
                var data = skuModel.FindItem(x => x.Id == (long)quant.SkuId && x.StockQty >= quant.Quantity);
                if (data == null)
                {
                    responses.Add(new OrderCreateResponse
                    {
                        OrderNumber = null,
                        Message = $"Stock Not Available for SKU {quant.SkuId}!",
                        Success = false
                    });
                    return responses;
                }
            }

            // Join SKUs and Quantities into comma-separated strings for the SP
            var skuIds = string.Join(",", productQuantity.Select(pq => pq.SkuId));
            var quantities = string.Join(",", productQuantity.Select(pq => pq.Quantity));

            try
            {
                var parameters = new DynamicParameters();

                // ⚠ MUST match SP parameter names EXACTLY (aligned with CreateOrder)
                parameters.Add("@UserID", request.UserID);
                parameters.Add("@AddressID", request.AddressID);
                parameters.Add("@PaymentMethod", request.PaymentMethod);
                parameters.Add("@SKUIds", skuIds);
                parameters.Add("@Quantities", quantities); 
                parameters.Add("@PromoCode", request.PromoCode);
                parameters.Add("@CreatedBy", this.UserId > 0 ? this.UserId.ToString() : request.UserID.ToString());

                var addr = request.OrderAddress;
                parameters.Add("@AddressLine1", addr?.AddressLine1 ?? "");
                parameters.Add("@AddressLine2", addr?.AddressLine2 ?? "");
                parameters.Add("@City", addr?.City ?? "");
                parameters.Add("@State", addr?.State ?? "");
                parameters.Add("@Country", addr?.Country ?? "");
                parameters.Add("@Pincode", addr?.Pincode ?? "");

                var result = this.ExecStoredProcedure<OrderCreateResponse>(
                    Database.SP_CreateOrder,
                    parameters
                ).FirstOrDefault();

                if (result != null && result.CreatedOrderId > 0)
                {
                    result.Success = true;
                    // Fallback to ID if OrderNumber was not mapped (SP returns CreatedOrderId)
                    result.OrderNumber = result.OrderNumber ?? result.CreatedOrderId.ToString();
                    result.Message = result.Message ?? "Order created successfully";
                    responses.Add(result);
                }
                else if (result != null && !string.IsNullOrEmpty(result.OrderNumber))
                {
                    result.Success = true;
                    result.Message = result.Message ?? "Order created successfully";
                    responses.Add(result);
                }
                else
                {
                    responses.Add(new OrderCreateResponse
                    {
                        OrderNumber = null,
                        Success = false,
                        Message = result?.Message ?? "Order creation failed (No Order Number or ID returned from SP)"
                    });
                }
            }
            catch (Exception ex)
            {
                responses.Add(new OrderCreateResponse
                {
                    OrderNumber = null,
                    Success = false,
                    Message = ex.Message
                });
            }

            return responses;
        }

        //public List<OrderCreateResponse> CreateBulkOrder(List<CreateOrderRequest> requests)
        //{
        //    var responses = new List<OrderCreateResponse>();
        //    var productQuantity = requests[0].ProductQuantity;
        //    var response = new OrderCreateResponse();
        //    foreach (var quant in productQuantity)
        //    {
        //        var skuModel = new SkuModel(this.config, this.mapper, this.principle, this.context);
        //        var data = skuModel.FindItem(x => x.Id == (long) quant.SkuId && x.StockQty >= quant.Quantity);
        //        if (data == null)
        //        {
        //            response.CreatedOrderId = 0;
        //            response.Message = "Stock Not Available!";
        //            response.Success = false;
        //            responses.Add(response);
        //            return responses;
        //        }
        //    }

        //    var skuIds = string.Join(",", requests[0].ProductQuantity.Select(pq => pq.SkuId));
        //    var quantities = string.Join(",", requests[0].ProductQuantity.Select(pq => pq.Quantity));

        //    foreach (var request in requests)
        //    {
        //        try
        //        {
        //            var parameters = new DynamicParameters();


        //            // ⚠ MUST match SP parameter names EXACTLY
        //            parameters.Add("@UserId", request.UserID);
        //            parameters.Add("@AddressId", request.AddressID);
        //            parameters.Add("@PaymentMethod", request.PaymentMethod);
        //            parameters.Add("@SKUIds", skuIds);
        //            parameters.Add("@Quantities", quantities);
        //            parameters.Add("@PromoCode", request.PromoCode);
        //            parameters.Add("@CreatedBy", this.UserId.ToString());
        //            parameters.Add("@AddressLine1", request.OrderAddress?.AddressLine1);
        //            parameters.Add("@AddressLine2", request.OrderAddress?.AddressLine2);
        //            parameters.Add("@City", request.OrderAddress?.City);
        //            parameters.Add("@State", request.OrderAddress?.State);
        //            parameters.Add("@Country", request.OrderAddress?.Country);
        //            parameters.Add("@Pincode", request.OrderAddress?.Pincode);

        //            var result = this.ExecStoredProcedure<OrderCreateResponse>(
        //                Database.SP_CreateOrder,
        //                parameters
        //            ).FirstOrDefault();

        //            if (result != null && result.CreatedOrderId > 0)
        //            {
        //                result.Success = true;
        //                result.Message = "Order created successfully";
        //            }
        //            else
        //            {
        //                result = new OrderCreateResponse
        //                {
        //                    CreatedOrderId = 0,
        //                    Success = false,
        //                    Message = "Order creation failed"
        //                };
        //            }

        //            responses.Add(result);
        //        }
        //        catch (Exception ex)
        //        {
        //            // Prevent one failure from breaking the whole bulk order
        //            responses.Add(new OrderCreateResponse
        //            {
        //                CreatedOrderId = 0,
        //                Success = false,
        //                Message = ex.Message
        //            });
        //        }
        //    }

        //    return responses;
        //}


        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        public ViewEntities.OrderDetail Get(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ViewEntities.OrderDetail> GetList()
        {
            throw new NotImplementedException();
        }

        public long Post(DBO.OrderDetail item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(DBO.OrderDetail item)
        {
            throw new NotImplementedException();
        }

        public long Post(ViewEntities.OrderDetail item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(ViewEntities.OrderDetail item)
        {
            throw new NotImplementedException();
        }

        public long Put(DBO.OrderDetail item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(DBO.OrderDetail item)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.OrderDetail item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.OrderDetail item)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }

        public async Task<GetOrdersResponse> GetOrders(int userId, [FromQuery] int? statusId, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] int page, [FromQuery] int pageSize)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserID", userId);
            parameters.Add("@StatusID", statusId);
            parameters.Add("@FromDate", startDate);
            parameters.Add("@ToDate", endDate);
            parameters.Add("@pageIndex", page);
            parameters.Add("@pageSize", pageSize);

            var orders = this.ExecStoredProcedure<OrderResponse>(Database.SP_GetOrders, parameters);

            var response = new GetOrdersResponse
            {
                Orders = orders.ToList()
            };

            return response;
        }


        public IEnumerable<OrderResponseModel> GetOrders(GetOrdersCriteria item)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserID", item.UserId);
            parameters.Add("@StatusID", item.StatusId);
            parameters.Add("@FromDate", item.FromDate);
            parameters.Add("@ToDate", item.ToDate);

            int pageSize = item.RowsPerPage ?? 10;
            if (pageSize <= 0) pageSize = 10;

            int pageIndex = 1;
            if (item.OffsetStart.HasValue && item.OffsetStart.Value > 0)
            {
                pageIndex = (item.OffsetStart.Value - 1) / pageSize + 1;
            }

            parameters.Add("@pageIndex", pageIndex);
            parameters.Add("@pageSize", pageSize);

            var results = this.ExecStoredProcedure<OrderResponseModel>(Database.SP_GetOrders, parameters);

            return results;
        }
        public async Task<List<OrderResponseModel>> GetOrderByCustomerId(int CustomerId, string? filterType)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@CustomerId", CustomerId);
            parameters.Add("@FilterType", filterType);

            var result = await Task.Run(() =>
                this.ExecStoredProcedure<OrderResponseModel>(
                    Database.SP_GetOrderByCustomerId,
                    parameters)
            );
            foreach (var item in result)
            {
                item.EncryptedCustomerId = EncryptAES(item.Id.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");
            }
            return result.ToList();
        }

        public async Task<GetOrderDetailsViewModel> GetOrderDetails(int orderId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@OrderID", orderId);
            var result = this.ExecStoredProcedureQueryMultiple<GetOrderDetailsViewModel, GetOrdersDetailsMapper>(Database.SP_GetOrderDetails, parameters);
            return await Task.FromResult(result == null ? null : mapper.Map<GetOrderDetailsViewModel>(result));
        }


        public async Task<byte[]> GenerateInvoice(int orderId)
        {
            var invoice = new InvoiceTemplateModel(this.config, this.mapper, null, this.iPrincipal, this.context);
            var enumName = "OrderCompleteInvoice";
            var invoiceData = invoice.GetTypeByEnum(enumName);

            if (invoiceData?.Result?.Template == null) return null;

            var param = new { OrderID = orderId };
            var result = this.ExecStoredProcedureQueryMultiple<GetOrderDetailsViewModel, GetOrdersDetailsMapper>(Database.SP_GetOrderDetails, param);
            var mappedResult = mapper.Map<GetOrderDetailsViewModel>(result);

            if (mappedResult == null || mappedResult.OrderHeader == null) return null;

            var orderHeader = mappedResult.OrderHeader;
            var orderDetails = mappedResult.OrderDetails ?? new List<OrderDetailDto>();
            var productDetails = mappedResult.ProductDetails ?? new List<ProductDetailDto>();
            var charges = mappedResult.Charges ?? new List<OrderChargeDto>();
            var payments = mappedResult.Payments ?? new List<PaymentTransactionDto>();

            var html = invoiceData.Result.Template;

            // Dates
            html = html.Replace("{invoicedate}", DateTime.UtcNow.ToString("dd MMM yyyy"));
            html = html.Replace("{orderdate}", orderHeader.OrderDate.ToString("dd MMM yyyy"));

            // Basic Info
            html = html.Replace("{ordernumber}", orderHeader.OrderNumber ?? "N/A");
            html = html.Replace("{customer}", orderHeader.FullName ?? "Customer");

            // Address
            html = html.Replace("{addressline1}", orderHeader.AddressLine1 ?? "");
            html = html.Replace("{addressline2}", string.IsNullOrEmpty(orderHeader.AddressLine2)
                ? ""
                : orderHeader.AddressLine2 + "<br>");
            html = html.Replace("{city}", orderHeader.City ?? "");
            html = html.Replace("{state}", orderHeader.State ?? "");
            html = html.Replace("{pincode}", orderHeader.PinCode ?? "");
            html = html.Replace("{country}", orderHeader.Country ?? "");
            html = html.Replace("{email}", orderHeader.Email ?? "N/A");
            html = html.Replace("{phone}", orderHeader.Phone ?? "N/A");

            // Payment (No Ref No)
            var latestPayment = payments.OrderByDescending(p => p.PaidOn).FirstOrDefault();
            html = html.Replace("{paymentmethod}", latestPayment?.PaymentMethod ?? "N/A");
            html = html.Replace("{paymentstatus}", latestPayment?.PaymentStatus ?? "Pending");
            html = html.Replace("{paidon}", latestPayment?.PaidOn.ToString("dd MMM yyyy") ?? "N/A");

            // Items Rows
            var itemRows = new StringBuilder();
            foreach (var item in orderDetails)
            {
                var prod = productDetails.FirstOrDefault(p => p.ProductId == item.ProductId);
                var brand = string.IsNullOrEmpty(prod?.BrandName)
                    ? ""
                    : $"<div class='brand'>({prod.BrandName})</div>";

                itemRows.AppendLine($@"
            <tr>
                <td>
                    <div class='product-name'>{prod?.ProductName ?? "Item"}</div>
                    {brand}
                </td>
                <td class='text-center'>{item.Quantity}</td>
                <td class='text-right'>{item.UnitPrice:F2}</td>
                <td class='text-right'>{item.TaxAmount:F2}</td>
                <td class='text-right'>{(item.TotalPrice + item.TaxAmount):F2}</td>
            </tr>");
            }
            html = html.Replace("{itemrows}", itemRows.ToString());

            // Charges Section
            var chargesSection = new StringBuilder();
            if (charges.Any())
            {
                chargesSection.AppendLine("<h3 style='color:#0066cc; border-bottom:2px solid #0066cc; padding-bottom:6px; margin:30px 0 15px 0;'>Additional Charges</h3>");
                chargesSection.AppendLine("<table class='items-table'><thead><tr><th>Charge</th><th class='text-right'>Amount</th><th class='text-right'>Tax</th><th class='text-right'>Total</th></tr></thead><tbody>");
                foreach (var c in charges)
                {
                    chargesSection.AppendLine($"<tr><td>{c.ChargeName}</td><td class='text-right'>{c.Amount:F2}</td><td class='text-right'>{c.TaxAmount:F2}</td><td class='text-right'>{c.TotalAmount:F2}</td></tr>");
                }
                chargesSection.AppendLine("</tbody></table>");
            }
            html = html.Replace("{chargessection}", chargesSection.ToString());

            // Manual Grand Total Calculation
            decimal grandTotal = orderHeader.ProductTotal
                               + orderHeader.ProductTaxTotal
                               + orderHeader.ChargeTotal
                               + orderHeader.ChargeTaxTotal
                               - orderHeader.DiscountTotal;

            // Totals
            html = html.Replace("{producttotal}", orderHeader.ProductTotal.ToString("F2"));
            html = html.Replace("{producttaxtotal}", orderHeader.ProductTaxTotal.ToString("F2"));
            html = html.Replace("{chargetotalrow}", orderHeader.ChargeTotal > 0
                ? $"<tr><td class='label'>Charges</td><td class='amount'>{orderHeader.ChargeTotal:F2}</td></tr>"
                : "");
            html = html.Replace("{chargetaxtotalrow}", orderHeader.ChargeTaxTotal > 0
                ? $"<tr><td class='label'>Charges Tax</td><td class='amount'>{orderHeader.ChargeTaxTotal:F2}</td></tr>"
                : "");
            html = html.Replace("{discounttotal}", orderHeader.DiscountTotal > 0
                ? orderHeader.DiscountTotal.ToString("F2")
                : "0.00");
            html = html.Replace("{grandtotal}", grandTotal.ToString("F2"));

            // Generate PDF
            using var memoryStream = new MemoryStream();
            var writer = new PdfWriter(memoryStream);
            var pdf = new PdfDocument(writer);
            var properties = new ConverterProperties();
            HtmlConverter.ConvertToPdf(html, pdf, properties);
            pdf.Close();

            return memoryStream.ToArray();
        }


        public Task<bool> CancelOrder(int orderId, string reason)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@OrderID", orderId);
            parameters.Add("@Reason", reason);
            parameters.Add("@CancelledBy", this.UserId.ToString() ?? "System");

            var result = this.ExecStoredProcedure<int>(Database.SP_CancelOrder, parameters);

            if (result != null)
            {
                return Task.FromResult(result.FirstOrDefault() > 0);
            }
            else
            {
                return Task.FromResult(false);
            }
        }

        public Task<bool> UpdateOrderStatusById(UpdateOrderStatusRequest request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@OrderId", request.OrderId);
            parameters.Add("@StatusId", request.StatusId);

            var result = this.ExecStoredProcedure<int>(Database.UpdateOrderStatusById, parameters);

            if (result != null)
            {
                return Task.FromResult(result.FirstOrDefault() > 0);
            }
            else
            {
                return Task.FromResult(false);
            }
        }


        public Task<bool> BulkCancelOrder(List<int> orderIds, string reason)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@OrderIds", string.Join(",", orderIds));
            parameters.Add("@Reason", reason);
            parameters.Add("@CancelledBy", this.UserId.ToString() ?? "System");

            var result = this.ExecStoredProcedure<int>(
                Database.SP_BulkCancel,
                parameters
            );

            if (result != null)
            {
                return Task.FromResult(result.FirstOrDefault() > 0);
            }
            else
            {
                return Task.FromResult(false);
            }
        }

        public bool DeleteOrderById(string orderIds, int customerId)
        {
            bool allCancelled = true;

            var orderIdList = orderIds.Split(',').Select(id => Convert.ToInt32(id)).ToList();

            var orderHeader = new OrderHeaderModel(this.config, this.mapper, this.iPrincipal, this.context).FindItem(x => x.UserId == customerId);

            foreach (var orderId in orderIdList)
            {
                var mapperResult = this.FindItem(x => x.OrderId == orderId);

                if (mapperResult != null && mapperResult.OrderId == orderId)
                {
                    orderHeader.StatusId = DOFYEcomConstants.StatusId;
                    new OrderHeaderModel(this.config, this.mapper, this.iPrincipal, this.context).UpdateItem(orderHeader);
                }
                else
                {
                    allCancelled = false;
                }
            }

            return allCancelled;
        }

        public EnableReturnButton GetReturnDaysConfig()
        {
            var result = new EnableReturnButton();

            result.ReturnDays = this.config.Value.EnableReturnButton.ReturnDays ?? string.Empty;

            return result;
        }

        public async Task<List<long>> AddToCart(AddToCartItemViewModel item)
        {
            if (item == null || item.skuId == null || !item.skuId.Any())
            {
                return new List<long>();
            }

            var insertedIds = new List<long>();

            var cartModel = new CartMasterModel(this.config, this.mapper, this.iPrincipal, this.context);
            foreach(var skuId in item.skuId)
            {
                var existingData = cartModel.FindItem(x => x.UserId == item.userId && x.SkuId == skuId && x.IsActive == true);
                if(existingData != null)
                {
                    existingData.Quantity = existingData.Quantity + item.quantity;
                    cartModel.Update(existingData);
                    insertedIds.Add(existingData.Id);
                }
                else
                {
                    var cart = new DBO.Cart
                    {
                        SkuId = skuId,
                        UserId = item.userId,
                        Quantity = item.quantity,
                        IsActive = true,
                        DisplayInList = true
                    };

                    long id = cartModel.AddItem(cart);
                    insertedIds.Add(id);
                }
            }
            return insertedIds;
        }


        public UpdateOrderResponse UpdateOrder(UpdateOrderRequest request)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@OrderId", request.OrderId);
                parameters.Add("@StatusId", request.StatusId);
                parameters.Add("@AddressId", request.AddressId);
                parameters.Add("@AddressLine1", request.AddressLine1);
                parameters.Add("@AddressLine2", request.AddressLine2);
                parameters.Add("@City", request.City);
                parameters.Add("@State", request.State);
                parameters.Add("@Country", request.Country);
                parameters.Add("@Pincode", request.Pincode);
                parameters.Add("@ModifiedBy", this.UserId.ToString());

                var result = this.ExecStoredProcedure<UpdateOrderResponse>(
                    "SP_UpdateOrder",
                    parameters
                ).FirstOrDefault();

                return result ?? new UpdateOrderResponse
                {
                    OrderId = request.OrderId,
                    Status = "Success",
                    Message = "Order updated successfully"
                };
            }
            catch (Exception ex)
            {
                return new UpdateOrderResponse
                {
                    OrderId = request.OrderId,
                    Status = "Error",
                    Message = ex.Message
                };
            }
        }

        public long AddAddress(ViewEntities.UserAddress request)
        {
            var model = new UserAddressModel(
                this.config,
                this.mapper,
                this.iPrincipal,
                this.context
            );
            var response = 0L;
            if (request.Id > 0)
            {
                 response = model.Put(request);
            }
            else
            {
                response = model.Post(request);
            }

            return response;
        }



        //public PagedList<ShoppingCartItemViewModel> GetShoppingCartDetails(int customerId)
        //{
        //    var param = new
        //    {
        //        UserId = customerId,
        //    };

        //    var results = this.GetPagedSProcResult<ShoppingCartItemViewModel>(Database.SP_ShoppingCartDetails, param);

        //    foreach (var item in results)
        //    {
        //        item.EncryptedShoppingCartId = EncryptAES(item.CartId.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");
        //        item.EncryptProductId = EncryptAES(item.ProductId.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");
        //    }

        //    return results;
        //}

        public async Task<PagedList<ShoppingCartItemViewModel>> GetShoppingCartDetails(int customerId)
        {
            var param = new
            {
                UserId = customerId
            };

            var results = this.GetPagedSProcResult<ShoppingCartItemViewModel>(Database.SP_ShoppingCartDetails, param);

            foreach (var item in results)
            {
                item.EncryptedShoppingCartId = EncryptAES(item.CartId.ToString(),
                    this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");
                item.EncryptProductId = EncryptAES(item.ProductId.ToString(),
                    this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");

                // Get image as Base64 if ImagePath exists
                //if (!string.IsNullOrEmpty(item.ImagePath))
                //{
                //    item.ImageBase64 = await GetImageAsBase64Async(item.ImagePath);
                //}
            }

            return results;
        }

        //private async Task<string?> GetImageAsBase64Async(string imagePath)
        //{
        //    try
        //    {
        //        byte[] imageBytes;

        //        if (this.config?.Value.AWSConfiguration?.EnableS3 == true)
        //        {
        //            // Use your existing FileDownloadAsync method
        //            imageBytes = await new S3ClientHelperService(this.config,
        //                    this.GetS3FolderName(this.context.CountryCode))
        //                .FileDownloadAsync(imagePath);
        //        }
        //        else
        //        {
        //            // Get image from local file system
        //            string fullPath = Path.Combine(
        //                this.config.Value.ApplicationConfiguration.AttachmentFilePath,
        //                imagePath.TrimStart('/').Replace("\\", "/")
        //            );

        //            if (File.Exists(fullPath))
        //            {
        //                imageBytes = await File.ReadAllBytesAsync(fullPath);
        //            }
        //            else
        //            {
        //                return null;
        //            }
        //        }

        //        // Convert to Base64 string with MIME type prefix
        //        string base64String = Convert.ToBase64String(imageBytes);
        //        string mimeType = GetMimeType(imagePath);

        //        return $"data:{mimeType};base64,{base64String}";
        //    }
        //    catch (Exception ex)
        //    {
        //        // Log error but don't break the flow
        //        // Consider: _logger.LogError(ex, $"Failed to convert image to Base64: {imagePath}");
        //        return null;
        //    }
        //}

        // Helper method to get MIME type
        private string GetMimeType(string fileName)
        {
            string extension = Path.GetExtension(fileName).ToLowerInvariant();

            return extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".bmp" => "image/bmp",
                ".webp" => "image/webp",
                ".svg" => "image/svg+xml",
                _ => "application/octet-stream"
            };
        }

        public async Task<long> RemoveCartItem(int cartId)
        {
            try
            {
                if (cartId <= 0)
                {
                    throw new ArgumentException("Invalid cart ID.");
                }

                var cartModel = new CartMasterModel(this.config, this.mapper, this.iPrincipal, this.context);
                var existingCart = cartModel.FindItem(x => x.Id == cartId);
                if(existingCart == null)
                {
                    throw new KeyNotFoundException("Cart item not found.");
                }
                existingCart.IsActive = false;
                cartModel.Update(existingCart);
                return existingCart.Id;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error fetching cart.", ex);
            }
        }


        public async Task<List<ProductImageResponse>> GetImages(int productId, int categoryId)
        {
            var skuModel = new SkuModel(this.config, this.mapper, this.iPrincipal, this.context);

            // Assuming this returns List with ImagePath column
            var imageList = skuModel.GetProductImage(productId);

            var result = new List<ProductImageResponse>();

            foreach (var item in imageList)
            {
                if (string.IsNullOrEmpty(item.ImagePath))
                    continue;

                if (!File.Exists(item.ImagePath))
                    continue;

                byte[] imageBytes = await File.ReadAllBytesAsync(item.ImagePath);
                string base64Image = Convert.ToBase64String(imageBytes);

                result.Add(new ProductImageResponse
                {
                    ImagePath = item.ImagePath,
                    ImageBase64 = base64Image
                });
            }
            return result;
        }

        public async Task<long> AddReview(ReviewViewModel model)
        {
            if (model == null)
                throw new ArgumentNullException(nameof(model));

            string reviewImageFolder = $"ReviewImages/{model.SkuId}/images";
            var imagePaths = new List<string>();

            if (model.Images != null && model.Images.Any())
            {
                var reviewModel = new ProductReviewModel(this.config, this.mapper, this.iPrincipal, this.context);
                foreach (var image in model.Images)
                {
                    if (image != null && image.Length > 0)
                    {
                        string imagePath = await reviewModel.UploadReviewImage(image, model.SkuId, reviewImageFolder);
                        imagePaths.Add(imagePath);
                    }
                }
            }

            var reviewEntity = new ViewEntities.ProductReview
            {
                UserId = model.UserId,
                SkuId = model.SkuId,
                Rating = model.Rating,
                ReviewText = model.ReviewText,
                ReviewDescription = model.ReviewDescription,
                ReviewDate = DateTime.UtcNow,
                ImagePath = imagePaths.Any() ? string.Join(",", imagePaths) : null
            };

            var productReviewModelDb = new ProductReviewModel(this.config, this.mapper, this.iPrincipal, this.context);
            long reviewId = productReviewModelDb.Post(reviewEntity);

            return reviewId;
        }

    }
}