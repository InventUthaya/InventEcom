namespace DofyEcom.Helper.Extensions
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text.RegularExpressions;

    public static class StringExtensions
    {
        public static bool IsNotEmpty(this string content)
        {
            return !string.IsNullOrEmpty(content);
        }

        public static bool IsNotEmpty(this int value)
        {
            return value > 0;
        }

        public static string ToDelimitedString(this IEnumerable<string> objList, string delimtter = ",")
        {
            if (objList?.Count() > 0)
            {
                string lastIndex = objList.Select(item => item).Skip(objList.Count() - 1)?.Take(objList.Count())?.FirstOrDefault();
                string resultStr = string.Join(", ", objList.Select(intro => intro).Take(objList.Count() - 1));
                var result = string.Concat(resultStr, objList.Count() > 1 ? ", and " : string.Empty, lastIndex);

                return result;
            }

            return default(string);
        }

        public static string HTMLToPlainText(this string inputString)
        {
            if (!string.IsNullOrEmpty(inputString))
            {
                var result = Regex.Replace(System.Net.WebUtility.HtmlDecode(inputString), "<.*?>|&nbsp;|\n", string.Empty);
                result = result.Replace("’", "'").Replace("‘", "'").Replace("“", "\"").Replace("”", "\"").Replace("–", "-").Replace("—", "-").Replace("™", "Trademark").Replace("®", "Registered").Replace("©", "Copyright");
                byte[] utfData = System.Text.Encoding.UTF8.GetBytes(result);

                return System.Text.Encoding.UTF8.GetString(utfData);
            }

            return default(string);
        }

        public static string RemoveSymbol(this string inputString)
        {
            if (!string.IsNullOrEmpty(inputString))
            {
                return Regex.Replace(inputString, "[^A-Za-z0-9]", string.Empty);
            }

            return default(string);
        }

        public static string FormatPageHeader(this string committeeName, DateTime? meetingDate)
        {
            if (meetingDate != null)
            {
                return FormatPageHeader(committeeName, meetingDate.Value);
            }

            return string.Empty;
        }

        public static string FormatPageHeader(this string committeeName, DateTime meetingDate)
        {
            return committeeName + " Agenda " + string.Format("{0:g}", meetingDate) + " - City of Minneapolis";
        }

        public static string RemoveWhiteSpace(this string displayName)
        {
            if (!string.IsNullOrEmpty(displayName))
            {
                return displayName.Replace(" ", string.Empty);
            }

            return string.Empty;
        }

        public static string RemoveParagraphTag(this string inputString)
        {
            if (!string.IsNullOrEmpty(inputString))
            {
                return Regex.Replace(inputString, @"</?p.*?>", string.Empty, RegexOptions.IgnoreCase);
            }

            return default(string);
        }
    }
}
