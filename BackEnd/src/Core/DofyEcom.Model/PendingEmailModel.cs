namespace DofyEcom.Model;

using AutoMapper;
using DofyEcom.DBO;
using DofyEcom.Helper;
using Microsoft.Extensions.Options;
using System.Security.Principal;

public class PendingEmailModel : BaseModel<PendingEmail>
{
    private readonly IOptionsSnapshot<AppConfiguration> config;
    private readonly IMapper mapper;
    private readonly IPrincipal iPrincipal;
    private readonly CountryContext context;

    public PendingEmailModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal iPrincipal = null, CountryContext requestContext = null)
        : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
    {
        this.config = iConfig;
        this.mapper = iMapper;
        this.iPrincipal = iPrincipal;
        this.context = requestContext;
    }

    public override IEnumerable<PendingEmail> GetAll()
    {
        return base.GetAll().OrderByDescending(email => email.Id);
    }

    public override PendingEmail GetItem(long id)
    {
        return this.FindById(id);
    }

    public long AddItem(string emailTo, Guid emailGroupId, string emailFrom = null, string parms = null,  bool active = true, string attachment = "")
    {
        PendingEmail pendingEmail = new PendingEmail
        {
            EmailTo = emailTo,
            EmailTemplateGroupId = emailGroupId,
            EmailFrom = emailFrom,
            Parms = parms,
            Attachment = attachment,
            IsActive = active,
        };
        pendingEmail.Created = DateTime.Now;
        pendingEmail.ModifiedBy = this.UserId.ToString() ?? " ";
        pendingEmail.CreatedBy = this.UserId.ToString() ?? " ";
        pendingEmail.RowOrder = pendingEmail.RowOrder is null ? 100 : pendingEmail.RowOrder + 100;
        return this.Add(pendingEmail);
    }

    public override void UpdateItem(PendingEmail item)
    {
        if (item.Id > 0)
        {
            item.ModifiedBy = this.AddUpdateModifiedBy();
            this.Update(item);
        }
    }

    public override void DeleteItem(long id)
    {
        this.Delete(id);
    }
}
