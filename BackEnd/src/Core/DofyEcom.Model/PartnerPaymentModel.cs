
namespace DofyEcom.Model
{
    using System.Data.SqlClient;
    using System.Security.Principal;
    using AutoMapper;
    using Dapper;
    using DataTables.AspNet.Core;
    using DofyEcom.Contracts.Interfaces.Admin;
    using DofyEcom.Contracts.Requests;
    using DofyEcom.Contracts.Responses;
    using DofyEcom.Helper;
    using DofyEcom.ViewEntities;
    using DofyEcom.ViewEntities.SearchCriteria;
    using DofyEcom.ViewEntities.ViewModel;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Options;

    public class PartnerPaymentModel : BaseModel<DBO.PartnerPayment>, IPartnerPaymentModel
    {

        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;

        public PartnerPaymentModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
            : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.iPrincipal = iPrincipal;
            this.context = requestContext;
        }



        public async Task<IEnumerable<PartnerPaymentResponse>> GetPartnersData(PartnerpaymentSearch request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@SearchText", request.Search);
            parameters.Add("@SortColumn", request.SortColumn);
            parameters.Add("@OffsetStart", request.OffsetStart);
            parameters.Add("@RowsPerPage", request.RowsPerPage);

            var result = await this.ExecStoredProcedureAsync<PartnerPaymentResponse>(Database.sp_GetPartnerPaymentSummary, parameters);

            return result;
        }

        public async Task<IEnumerable<PartnerByIdResponse>> GetPartnerbyId(PartnerpaymentSearch request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@PartnerId", request.PartnerId);
            parameters.Add("@SearchText", request.Search);
            parameters.Add("@SortColumn", request.SortColumn);
            parameters.Add("@OffsetStart", request.OffsetStart);
            parameters.Add("@RowsPerPage", request.RowsPerPage);

            var result = await this.ExecStoredProcedureAsync<PartnerByIdResponse>(Database.sp_GetPartnerPaymentById, parameters);

            return result;
        }

        public async Task<IEnumerable<PaymentStates>> paymentStates(PaymentStatusUpdate request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@PartnerId", request.PartnerId);
            var result = await this.ExecStoredProcedureAsync<PaymentStates>(Database.sp_GetPartnerPaymentStats, parameters);

            return result;
        }


        public long updategrouppaymentstatus(PaymentStatusUpdate request)
        {
            var items = FindItems(x => x.PartnerId == (int) request.PartnerId && x.paymentDone == DOFYEcomConstants.PAYMENT_DONE_PENDING && x.StatusId == DOFYEcomConstants.PAYMENT_STATUS_PENDING).ToList();

            if (!items.Any())
                return 0;

            foreach (var item in items)
            {
                item.paymentDone = DOFYEcomConstants.PAYMENT_PAYMENT_DONE;
                item.StatusId = DOFYEcomConstants.PAYMENT_STATUS_COMPLETE;
                UpdateItem(item);
            }

            return items.Count;
        }


        public long updatepaymentstatus(PaymentStatusUpdate request)
        {
            var items = FindItem(x => x.PartnerId == (int) request.PartnerId && x.Id == (long)request.PartnerpaymentId);

            items.paymentDone = DOFYEcomConstants.PAYMENT_PAYMENT_DONE;
            items.StatusId = DOFYEcomConstants.PAYMENT_STATUS_COMPLETE;
            UpdateItem(items);

            return items.Id;
        }


        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        public ViewEntities.PartnerPayment Get(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ViewEntities.PartnerPayment> GetList()
        {
            throw new NotImplementedException();
        }

        public long Post(ViewEntities.PartnerPayment item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(ViewEntities.PartnerPayment item)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.PartnerPayment item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.PartnerPayment item)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }
    }
}
