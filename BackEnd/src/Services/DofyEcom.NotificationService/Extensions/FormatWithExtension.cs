namespace DofyEcom.NotificationService.Extensions
{
    using System;
    using System.Collections.Generic;

    public static class FormatWithExtension
    {
        public static string FormatWith(this string template, IDictionary<string, string> format)
        {
            if (template == null)
            {
                throw new ArgumentNullException("template");
            }

            foreach (KeyValuePair<string, string> keyValue in format)
            {
                template = template.Replace("{" + keyValue.Key + "}", keyValue.Value).Replace("₹", "&#8377;");
            }

            return template;
        }

        public static string FormatBody(this string content)
        {
            if (content == null)
            {
                throw new ArgumentNullException("content");
            }

            //content = content.Replace(Environment.NewLine, "<br/>");
            //content = string.Concat("<p>", content, "</p>");

            return content;
        }
    }
}
