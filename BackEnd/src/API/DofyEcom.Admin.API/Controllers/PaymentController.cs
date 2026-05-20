namespace Invent.Api.Controllers.Admin
{
    using System.Threading.Tasks;
    using AutoMapper;
    using DofyEcom.Admin.API.Controllers;
    using DofyEcom.Contracts;
    using DofyEcom.ViewEntities;
    using DofyEcom.Helper;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;
    using Stripe;

    [Authorize(Roles = "Admin,Finance")]
    [ApiController]
    [Route("api/admin/payments")]
    public class PaymentController : BaseController<IPaymentModel, PaymentTransaction>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IPaymentModel paymentModel;
        private readonly IMapper mapper;
        private readonly CountryContext requestContext;

        public PaymentController(
            IOptionsSnapshot<AppConfiguration> iAppConfiguration,
            IMapper iMapper,
            IPaymentModel iPaymentModel,
            CountryContext requestContext)
            : base(iPaymentModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.paymentModel = iPaymentModel;
            this.requestContext = requestContext;
        }

        /// <summary>
        /// Initiate a refund for an order payment.
        /// </summary>
        [HttpPost("{orderId}/refund")]
        public async Task<IActionResult> InitiateRefund([FromRoute] int orderId, [FromBody] PaymentTransaction request)
        {
            if (orderId != request.OrderId)
                return BadRequest("OrderId mismatch.");

            var refundResult = await this.paymentModel.InitiateRefundAsync(request);

            if (refundResult == null)
                return BadRequest("Refund could not be processed.");

            return Ok(refundResult);
        }

        [AllowAnonymous]
        [HttpPost("webhook/stripe")]
        public async Task<IActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    this.appConfiguration?.Value?.StripeConfig?.Stripe_Secret_Key
                );

                if (stripeEvent.Type == "checkout.session.completed")
                {
                    var session = stripeEvent.Data.Object as Stripe.Checkout.Session;
                    var orderId = session?.Metadata["orderId"];

                    await paymentModel.UpdatePaymentTransactionAsync(orderId, statusId: 1, paidOn: DateTime.UtcNow);
                }
                else if (stripeEvent.Type == "charge.refunded")
                {
                    var charge = stripeEvent.Data.Object as Stripe.Charge;
                    var orderId = charge?.Metadata["orderId"];

                    await paymentModel.UpdatePaymentTransactionAsync(orderId, statusId: 2, paidOn: null);
                }
                else if (stripeEvent.Type == "payment_intent.succeeded")
                {
                    var intent = stripeEvent.Data.Object as Stripe.PaymentIntent;
                    var orderId = intent?.Metadata["orderId"];

                    await paymentModel.UpdatePaymentTransactionAsync(orderId, statusId: 1, paidOn: DateTime.UtcNow);
                }
                else if (stripeEvent.Type == "payment_intent.payment_failed")
                {
                    var intent = stripeEvent.Data.Object as Stripe.PaymentIntent;
                    var orderId = intent?.Metadata["orderId"];

                    await paymentModel.UpdatePaymentTransactionAsync(orderId, statusId: -1, paidOn: null);
                }

                return Ok(new { received = true });
            }
            catch (StripeException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        //[HttpPost("RefundPayment/{encryptedPaymentId}")]
        //public async Task<PaymentTransaction> RefundPayment(string encryptedPaymentId)
        //{
        //    try
        //    {
        //        var paymentId = Convert.ToInt64(DecryptAES(encryptedPaymentId));

        //        // 1. Validate payment exists and is refundable
        //        var payment = this.Contract.GetPaymentByIdAsync(paymentId);

        //        // 2. Call Stripe refund API
        //        var refundOptions = new RefundCreateOptions
        //        {
        //            PaymentIntent = payment.Id.ToString(),
        //            Amount = (long)(payment.Amount * 100) // Stripe uses cents
        //        };
        //        var refundService = new RefundService();
        //        var refund = await refundService.CreateAsync(refundOptions);

        //        // 3. Record refund transaction
        //        await this.Contract.InsertRefundTransaction(paymentId, refund.Id, payment.Amount);

        //        // 4. Update related entities
        //        await this.Contract.UpdateOrderAfterRefund(payment.OrderId, payment.Amount);

        //        // (Optional) Notify user
        //        await this.Contract.NotifyUserRefunded(payment.UserId, payment.OrderId, payment.Amount);

        //        return Ok(new { RefundId = refund.Id , Message = "Refund successful"});
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { Message = "Refund failed.", Error = ex.Message });
        //    }
        //}


    }

}
