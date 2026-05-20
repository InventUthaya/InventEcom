namespace DofyEcom.Helper.Extensions;

using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using Attributes;

public static class ExportExtensions
{
    private const string XMLDECLARATION = @"<?xml version=""1.0"" encoding=""UTF-8"" standalone=""yes"" ?>";

    public static string ExportXML<T>(this IEnumerable<T> items, string rootElementName = "contributions")
                                                                            where T : ExportResult
    {
        string result = string.Empty;
        if (items != null && items.Count() > 0)
        {
            result = string.Join(string.Empty, items.Select(item => item.ToXML()));
            return string.Format("{0}<{1}>{2}</{1}>", XMLDECLARATION, rootElementName, result);
        }

        return result;
    }

    public static string ExportCsv<T>(this IEnumerable<T> items, string reportname)
                                                                        where T : ExportResult
    {
        var sb = new StringBuilder();
        var headerElement = typeof(T).GetProperties().Select(item => (ColumnAttribute)item.GetCustomAttribute(typeof(ColumnAttribute), false))
                                    .Where(item => item != null)
                                    .OrderBy(item => item.Order);

        // sb.AppendLine(string.Join(",", reportname.Replace("_", " ")));
        sb.AppendLine(string.Join(",", headerElement.Select(item => item.Name)).TrimEnd(','));
        sb.AppendLine(string.Join("\r\n", items.Select(item => item.ToCsv())));

        return sb.ToString();
    }
}
