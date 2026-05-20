namespace DofyEcom.Contracts
{
    public interface IContactUsConfigModel : IBaseModel<ViewEntities.ContactUsConfig>
    {
        ViewEntities.ContactUsConfig GeAlltList();

        ViewEntities.ContactUsConfig GetContactUsConfig(int id);
    }
}
