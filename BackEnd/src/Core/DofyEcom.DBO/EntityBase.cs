using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using DofyEcom.Helper;
using DofyEcom.Helper.Attributes;
using DofyEcom.Helper.Validators;

namespace DofyEcom.DBO
{
    /// <summary>
    /// The base class for domain entities.
    /// </summary>
    public class EntityBase : KeywordSearcher, IValidatable
    {
        /// <summary>
        /// The validation errors
        /// </summary>
        private readonly ValidationErrors validationErrors;

        /// <summary>
        /// Initializes a new instance of the <see cref="EntityBase" /> class.
        /// </summary>
        protected EntityBase()
        {
            this.validationErrors = new ValidationErrors();
        }

        /// <summary>
        /// Gets or sets Entity Id that represents unique value.
        /// </summary>
        [DataMember]
        public long Id { get; set; }

        /// <summary>
        /// Gets or sets Represents entity created date.
        /// </summary>
        public DateTime? Created { get; set; }

        /// <summary>
        /// Gets or sets Represents who created the entity.
        /// </summary>
        public string CreatedBy { get; set; }

        /// <summary>
        /// Gets or sets Represents entity modified date.
        /// </summary>
        public DateTime? Modified { get; set; }

        /// <summary>
        /// Gets or sets Represents who modified the entity.
        /// </summary>
        public string ModifiedBy { get; set; }

        /// <summary>
        /// Gets or sets Represents is Active or Not .
        /// </summary>
        public bool IsActive { get; set; } = DOFYEcomConstants.ACTIVESTATUS;

        /// <summary>
        /// Gets or sets Pagged Records Count.
        /// </summary>
        [DBIgnore]
        public int TotalRecords { get; set; }

        /// <summary>
        /// Gets a value indicating whether this instance is valid.
        /// </summary>
        [DBIgnore]
        public virtual bool IsValid
        {
            get
            {
                this.validationErrors.Clear();
                this.Validate();
                return this.ValidationErrors.Items.Count == 0;
            }
        }

        /// <summary>
        /// Gets the validation errors.
        /// </summary>
        [DBIgnore]
        public virtual ValidationErrors ValidationErrors
        {
            get { return this.validationErrors; }
        }

        /// <summary>
        /// Gets the CountryCode based list.
        /// </summary>
        [DBIgnore]
        public string CountryCode { get; set; }

        /// <summary>
        /// Search the instance member based on the keyword.
        /// </summary>
        /// <param name="adminApproved">admin approved items search</param>
        /// <returns>Returns true if matches found.</returns>
        public virtual bool SearchByKeyword(bool? adminApproved)
        {
            return true;
        }

        /// <summary>
        /// Search keyword in collection of entities.
        /// </summary>
        /// <typeparam name="T">Entity base parameter</typeparam>
        /// <param name="items">Collection of entities to be searched.</param>
        /// <param name="keyword">Keyword to search throw entities.</param>
        /// <returns>returns true if keyword exist in the entity collection.</returns>
        public virtual bool SearchByKeywordCollection<T>(IEnumerable<T> items, string keyword)
                                                        where T : EntityBase
        {
            if (items != null)
            {
                foreach (var item in items)
                {
                    if (item.IsValid && item.SearchByKeyword(keyword))
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        /// <summary>
        /// Validates this instance.
        /// </summary>
        protected virtual void Validate()
        {
        }
    }
}
