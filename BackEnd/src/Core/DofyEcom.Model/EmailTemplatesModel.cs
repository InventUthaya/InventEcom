namespace DofyEcom.Model;

using AutoMapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.Helper;
using DofyEcom.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Security.Principal;

public class EmailTemplatesModel : BaseModel<DBO.EmailTemplates>, IEmailTemplatesModel
{
    private readonly IOptionsSnapshot<AppConfiguration> config;
    private new readonly IMapper mapper;
    private readonly IPrincipal iPrincipal;
    private readonly string emailImagePath = string.Empty;
    private readonly CountryContext context;

    public EmailTemplatesModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal iPrincipal = null, CountryContext requestContext = null)
        : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
    {
        this.config = iConfig;
        this.mapper = iMapper;
        this.iPrincipal = iPrincipal;
        this.LoadFromCache = iConfig?.Value?.ApplicationConfiguration?.MasterDataFromCache ?? false;
        this.emailImagePath = iConfig?.Value?.ApplicationConfiguration?.EmailImagePath ?? string.Empty;
        this.context = requestContext;
    }

    public ViewEntities.EmailTemplates Get(long id)
    {
        var result = this.FindItem(item => item.Id == id);
        if (result is not null)
        {
            var mapperResult = this.mapper.Map<DBO.EmailTemplates, ViewEntities.EmailTemplates>(result);

            return mapperResult;
        }

        return default;
    }

    public IEnumerable<ViewEntities.EmailTemplates> GetList()
    {
        var results = this.FindItems(item => item.IsActive == true);
        var mapperResults = this.mapper.Map<IEnumerable<DBO.EmailTemplates>, IEnumerable<ViewEntities.EmailTemplates>>(results);

        return mapperResults;
    }

    public long Post(ViewEntities.EmailTemplates item, IFormFileCollection postedFileCollection)
    {
        if (item is not null)
        {
            var mapperResult = this.mapper.Map<ViewEntities.EmailTemplates, DBO.EmailTemplates>(item);

            this.AddItem(mapperResult);

            return mapperResult.Id;
        }

        return default;
    }

    public long Post(ViewEntities.EmailTemplates item)
    {
        if (item is not null)
        {
            var mapperResult = this.mapper.Map<ViewEntities.EmailTemplates, DBO.EmailTemplates>(item);

            return mapperResult.Id;
        }

        return default;
    }

    public long Put(ViewEntities.EmailTemplates item, IFormFileCollection postedFileCollection)
    {
        if (item is not null)
        {
            var mapperResult = this.mapper.Map<ViewEntities.EmailTemplates, DBO.EmailTemplates>(item);
            mapperResult.Created = DateTime.Now;

            this.UpdateItem(mapperResult);

            return mapperResult.Id;
        }

        return default;
    }

    public long Put(ViewEntities.EmailTemplates item)
    {
        if (item is not null)
        {
            var mapperResult = this.mapper.Map<ViewEntities.EmailTemplates, DBO.EmailTemplates>(item);
            this.UpdateItem(mapperResult);

            return mapperResult.Id;
        }

        return default;
    }

    public bool Remove(long id)
    {
        var series = this.FindById(id);
        if (series is not null)
        {
            series.IsActive = false;
            this.UpdateItem(series);
            return true;
        }

        return false;
    }

    public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
    {
        throw new NotImplementedException();
    }


    public override IEnumerable<DBO.EmailTemplates> GetAll()
    {
        var results = base.GetAll().OrderBy(emailTemplate => emailTemplate.Modified).Where(e => e.IsActive == true);

        return results;
    }


    public long LogOTP(long loginId, string password)
    {
        string dofyContctNo = this.config.Value?.ApplicationConfiguration?.DofyContactNo ?? string.Empty;
        var userLogin = new UserLoginModel(this.config, this.mapper, this.iPrincipal, this.context).Get(loginId);
        var person = new UserMasterModel(this.config, this.mapper, this.iPrincipal, this.context).Get(userLogin.UserId);
        string customerName = person?.FullName;
        customerName = string.IsNullOrEmpty(customerName) ? "Customer" : customerName;
        IEnumerable<DBO.EmailTemplates> emailTemplates = this.FindItems(item => item.EnumName == DOFYEcomConstants.EmailTemplatesInfo.LOGIN_OTP);
        if (emailTemplates?.Count() > 0)
        {
            long emailTemplateId = default;
            foreach (var item in emailTemplates)
            {
                if (item.EntityTypeId == DOFYEcomConstants.EMAIL_ENTITY_TYPE)
                {
                    string parameters = string.Format(@"CustomerName=""{0}"", OTP=""{1}"",DOFYECOMContactNo=""{2}"", Imagepath=""{3}""", customerName, password, dofyContctNo, this.emailImagePath);
                    emailTemplateId = new PendingEmailModel(this.config, this.mapper, this.iPrincipal, this.context).AddItem(userLogin?.Email, item.EmailGroupId, null, parameters);
                }

                if (item.EntityTypeId == DOFYEcomConstants.SMS_ENTITY_TYPE)
                {
                    string parameters = string.Format(@"CustomerName=""{0}"", OTP=""{1}""", customerName, password);
                    emailTemplateId = new PendingEmailModel(this.config, this.mapper, this.iPrincipal, this.context).AddItem(userLogin.Phone, item.EmailGroupId, null, parameters);
                }
            }

            return emailTemplateId;
        }

        return default;
    }


    public long LogOrderOTP(long loginId, string password, long orderId)
    {
        string dofyContctNo = this.config.Value?.ApplicationConfiguration?.DofyContactNo ?? string.Empty;
        var userLogin = new UserLoginModel(this.config, this.mapper, this.iPrincipal, this.context).Get(loginId);
        var person = new UserMasterModel(this.config, this.mapper, this.iPrincipal, this.context).Get(userLogin.UserId);
        string customerName = person?.FullName;
        customerName = string.IsNullOrEmpty(customerName) ? "Customer" : customerName;
        IEnumerable<DBO.EmailTemplates> emailTemplates = this.FindItems(item => item.EnumName == DOFYEcomConstants.EmailTemplatesInfo.ORDER_COMPLETED_OTP);
        if (emailTemplates?.Count() > 0)
        {
            long emailTemplateId = default;
            foreach (var item in emailTemplates)
            {
                if (item.EntityTypeId == DOFYEcomConstants.EMAIL_ENTITY_TYPE)
                {
                    string parameters = string.Format(@"CustomerName=""{0}"", OTP=""{1}"",OrderId=""{2}"",DOFYECOMContactNo=""{3}"", Imagepath=""{4}""", customerName, password, orderId, dofyContctNo, this.emailImagePath);
                    emailTemplateId = new PendingEmailModel(this.config, this.mapper, this.iPrincipal, this.context).AddItem(userLogin?.Email, item.EmailGroupId, null, parameters);
                }

                if (item.EntityTypeId == DOFYEcomConstants.SMS_ENTITY_TYPE)
                {
                    string parameters = string.Format(@"CustomerName=""{0}"", OTP=""{1}"",OrderId=""{2}""", customerName, password, orderId);
                    emailTemplateId = new PendingEmailModel(this.config, this.mapper, this.iPrincipal, this.context).AddItem(userLogin.Phone, item.EmailGroupId, null, parameters);
                }
            }

            return emailTemplateId;
        }

        return default;
    }



    //public async Task<long> GetEmailTemplateId(string enumName)
    //{
    //    long emailTemplateId = this.FindItem(item => item.EnumName == enumName && item.EntityTypeId == (this.context.CountryCode == "in" ? DofEcomConstants.SMS_ENTITY_TYPE : DOFYConstants.EMAIL_ENTITY_TYPE) && item.Active == true)?.Id ?? 0;

    //    return await Task.FromResult(emailTemplateId);
    //}

    private string formatAmount(string amount)
    {
        var result = "Rs." + (amount?.EndsWith(".00") ?? false ? amount : string.Concat(amount, ".00"));

        return result ?? " ";
    }
}
