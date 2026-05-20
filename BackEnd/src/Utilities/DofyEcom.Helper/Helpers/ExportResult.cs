namespace DofyEcom.Helper;

using System.Linq;
using System.Reflection;
using DofyEcom.Helper.Attributes;
using Helper.Extensions;

public class ExportResult
{
    public virtual string ToXML()
    {
        return string.Empty;
    }

    public virtual string ToCsv()
    {
        var properties = this.GetType().GetProperties().Where(prop => prop.IsDefined(typeof(ColumnAttribute), true))
                           .Select(x => new
                           {
                               Value = x.GetValue(this, null),
                               Name = x.Name,
                               PropertyInfo = x,
                               Attribute = (ColumnAttribute)x.GetCustomAttribute(typeof(ColumnAttribute), false)
                           })
                           .Where(item => item != null)
                           .OrderBy(item => item.Attribute.Order);

        string csvStr = string.Empty;
        foreach (var property in properties)
        {
            string value = property.PropertyInfo.FormatPropertyValue(this, false, "MM/dd/yyyy");
            csvStr += string.Format("{0},", @"""" + value.Replace(@"""", @"""""") + @"""");
        }

        // remove the last comma if it exists and return
        return csvStr.TrimEnd(',');
    }
}
