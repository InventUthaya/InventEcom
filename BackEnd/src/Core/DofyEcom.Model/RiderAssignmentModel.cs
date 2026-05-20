using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.Contracts.Interfaces.Admin;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.Options;
using Org.BouncyCastle.Asn1.Ocsp;

namespace DofyEcom.Model
{
    public class RiderAssignmentModel : BaseModel<DBO.RiderAssignment>, IRiderAssignmentModel
    {

        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;
        private readonly IOrderHeaderModel _orderHeader;

        public RiderAssignmentModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IOrderHeaderModel orderHeaderModel, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
            : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.iPrincipal = iPrincipal;
            this._orderHeader = orderHeaderModel;
            this.context = requestContext;
        }

        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }


        public async Task<long> AssignOrderToRiderOrCourierAsync(RiderAssignment request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            request.IsActive = true;

            long insertedAssignment = Post(request);

            // Update OrderHeader.StatusID
            var order = this._orderHeader.UpdateOrderStatus(request.OrderId, "Assigned");

            return insertedAssignment;
        }

        public async Task<RiderDetailViewModel> GetAssignmentsByRiderIdAsync(long riderId)
        {
            try
            {
                if (riderId <= 0)
                    throw new ArgumentException("Invalid RiderID.", nameof(riderId));


                var userDetails = this.FindByQuery($"SELECT TOP 1 * FROM RiderAssignment WHERE RiderID = {riderId}")
                      .FirstOrDefault();

                var userLogin = new UserLoginModel(this.config, this.mapper, this.principle, this.context)
                                     .FindByQuery($"SELECT TOP 1 * FROM UserLogin WHERE UserID = {riderId}")
                                     .FirstOrDefault();

                var userMaster = new UserMasterModel(this.config, this.mapper, this.principle, this.context)
                                      .FindByQuery($"SELECT TOP 1 * FROM UserMaster WHERE UserID = {riderId}")
                                      .FirstOrDefault();

                RiderDetailViewModel riderDetailViewModel = new RiderDetailViewModel
                {
                    RiderID = riderId,
                    OrderID = userDetails?.OrderId ?? 0,
                    FullName = userMaster?.FullName,  // added null-check
                    Phone = userLogin?.Phone,
                };

                return await Task.FromResult(riderDetailViewModel);
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while fetching rider assignments.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while fetching rider assignments.", ex);
            }
        }





        public async Task<IEnumerable<GetAllRiderViewModel>> GetAssignmentsByAllRidersAsync()
        {
            try
            {
                // Step 1: Get all RiderIDs from UserRoleMapping where RoleID = 4 (Rider)
                var riderMappings = new UserRoleMappingModel(this.config, this.mapper, this.principle, this.context).FindItems(FindItem => FindItem.RoleId == 4 ).ToList();


                if (riderMappings == null || !riderMappings.Any())
                    return Enumerable.Empty<GetAllRiderViewModel>();

                List<GetAllRiderViewModel> riderDetails = new List<GetAllRiderViewModel>();

                foreach (var mapping in riderMappings)
                {
                    long riderId = mapping.UserId;

                    // Step 3: Fetch UserLogin (phone)
                    var userLogin = new UserLoginModel(this.config, this.mapper, this.principle, this.context)
                                        .FindByQuery($"SELECT TOP 1 * FROM UserLogin WHERE UserId = {(int)riderId}")
                                        .FirstOrDefault();

                    // Step 4: Fetch UserMaster (full name)
                    var userMaster = new UserMasterModel(this.config, this.mapper, this.principle, this.context)
                                        .FindByQuery($"SELECT TOP 1 * FROM UserMaster WHERE Id = {riderId}")
                                        .FirstOrDefault();

                    // Step 5: Build list of RiderDetailViewModel for all assignments
                    riderDetails.Add(new GetAllRiderViewModel
                    {
                        RiderID = riderId,
                        FullName = userMaster?.FullName,
                        Phone = userLogin?.Phone
                    });
                }

                return await Task.FromResult(riderDetails);
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while fetching rider assignments.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while fetching rider assignments.", ex);
            }
        }


        public async Task<bool> AssignRiderToOrderAsync(long riderId, long orderId)
        {
            try
            {
                var orderDetail = new OrderHeaderModel(this.config, this.mapper, this.iPrincipal, this.context).FindItemById(orderId);
                if (orderDetail == null)
                    return false;
                var existingAssignment = this.FindItem(item => item.OrderId == (int)orderId);
                if (existingAssignment != null)
                {
                    // Update existing assignment
                    existingAssignment.RiderId = (int?)riderId;
                    existingAssignment.Modified = DateTime.Now;
                    existingAssignment.ModifiedBy = "System"; // replace with current user
                    this.Update(existingAssignment);
                }
                else
                {
                    var newAssignment = new ViewEntities.RiderAssignment
                    {
                        RiderId = (int?)riderId,
                        OrderId = (int)orderId,
                        IsActive = true,
                        DisplayInList = true,
                        Created = DateTime.Now,
                        CreatedBy = "System"
                    };
                    this.Post(newAssignment);
                }

                return await Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error assigning rider to order", ex);
            }
        }







        public RiderAssignment Get(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<RiderAssignment> GetList()
        {
            throw new NotImplementedException();
        }

        public long Post(RiderAssignment item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(RiderAssignment item)
        {
            var mappeResult = this.mapper.Map<ViewEntities.RiderAssignment, DBO.RiderAssignment>(item);
            var result = this.AddItem(mappeResult);

            return mappeResult.Id;

        }

        public long Put(RiderAssignment item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(RiderAssignment item)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }
        public async Task<ManagementUserViewModel> GetAllManagementUsersAsync(UserPaginationRequestViewModel request)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@RoleType", request.RoleType);
                parameters.Add("@SearchText", request.SearchText);
                parameters.Add("@Page", request.Page);
                parameters.Add("@PageSize", request.PageSize);
                parameters.Add("@SortColumn", request.SortColumn);
                parameters.Add("@SortOrder", request.SortOrder);

                var results = await this.ExecStoredProcedureAsync<UserPaginationResponse>(
                    Database.SP_GetUsersByRole,
                    parameters
                );

                var users = results.ToList();
                int totalRecords = users.FirstOrDefault()?.TotalCount ?? 0;

                return new ManagementUserViewModel
                {
                    Users = users,
                    TotalRecords = totalRecords,
                    Page = request.Page,
                    PageSize = request.PageSize,
                    TotalPages = (int)Math.Ceiling((double)totalRecords / request.PageSize)
                };
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error while fetching users with pagination.", ex);
            }
        }



    }
}
