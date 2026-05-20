using DofyEcom.Contracts.Interfaces.Admin;
using DofyEcom.Contracts.Requests;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.SearchCriteria;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace DofyEcom.Admin.API.Controllers
{
    [Route("api/partnerpayment")]
    [ApiController]
    public class PartnerPaymentController : BaseController<IPartnerPaymentModel, ViewEntities.PartnerPayment>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IPartnerPaymentModel paymentModel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public PartnerPaymentController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IPartnerPaymentModel paymentModel, CountryContext requestContext)
            : base(paymentModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.paymentModel = paymentModel;
            this.requestContext = requestContext;
        }


        [HttpPost]
        [Route("GetPartnersData")]
        public async Task<ActionResult<IEnumerable<PartnerPaymentResponse>>> GetPartnersData([FromBody] PartnerpaymentSearch request)
        {
            try
            {
                var result = await this.Contract.GetPartnersData(request);

                return Ok(result ?? new List<PartnerPaymentResponse>());
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An unexpected error occurred while fetching partner payment data.",
                    details = ex.Message
                });
            }
        }


        [HttpPost]
        [Route("GetPartnerbyId")]
        public async Task<ActionResult<IEnumerable<PartnerByIdResponse>>> GetPartnerbyId([FromBody] PartnerpaymentSearch request)
        {
            try
            {
                var result = await this.Contract.GetPartnerbyId(request);

                return Ok(result ?? new List<PartnerByIdResponse>());
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An unexpected error occurred while fetching partner payment data.",
                    details = ex.Message
                });
            }
        }

        [HttpPost]
        [Route("create-payment-intent")]

        public async Task<IActionResult> CreatePaymentIntent([FromBody] CreatePaymentIntentRequest request)
        {
            var stripeSecretKey = appConfiguration.Value.ApplicationConfiguration.StripSecretKey;
            var stripePublicKey = appConfiguration.Value.ApplicationConfiguration.StripPublishableKey;
            StripeConfiguration.ApiKey = stripeSecretKey;
            try
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = request.Amount,
                    Currency = "inr",
                    PaymentMethodTypes = new List<string> { "card" },
                    Metadata = new Dictionary<string, string>
                {
                    { "partnerId", request.PartnerId?.ToString() ?? "" },
                    { "partnerName", request.PartnerName ?? "" },
                    { "purpose", "Partner Commission Payout" }
                },
                    Description = $"Commission payout for partner: {request.PartnerName} (ID: {request.PartnerId})"
                };

                var service = new PaymentIntentService();
                var paymentIntent = await service.CreateAsync(options);

                return Ok(new
                {
                    clientSecret = paymentIntent.ClientSecret
                });
            }
            catch (StripeException ex)
            {
                return StatusCode(400, new
                {
                    error = ex.StripeError.Message ?? "Payment intent creation failed."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = "An unexpected error occurred. Please try again later."
                });
            }
        }


        [HttpPost]
        [Route("updategrouppaymentstatus")]
        public async Task<ActionResult<long>> UpdateGroupPaymentStatus([FromBody] PaymentStatusUpdate request)
        {
            try
            {
                var result = await Task.Run(() => this.Contract.updategrouppaymentstatus(request));

                return Ok(result);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An unexpected error occurred while updating partner payment status.",
                    details = ex.Message
                });
            }
        }


        [HttpPost]
        [Route("updatepaymentstatus")]
        public async Task<ActionResult<long>> updatepaymentstatus([FromBody] PaymentStatusUpdate request)
        {
            try
            {
                var result = await Task.Run(() => this.Contract.updatepaymentstatus(request));

                return Ok(result);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An unexpected error occurred while updating partner payment status.",
                    details = ex.Message
                });
            }
        }


        [HttpPost]
        [Route("paymentStates")]
        public async Task<ActionResult<IEnumerable<PaymentStates>>> paymentStates([FromBody] PaymentStatusUpdate request)
        {
            try
            {
                var result = await this.Contract.paymentStates(request);

                return Ok(result ?? new List<PaymentStates>());
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An unexpected error occurred while fetching partner payment data.",
                    details = ex.Message
                });
            }
        }

    }

}

