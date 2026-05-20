namespace DofyEcom.Helper.Extensions
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public static class DateTimeExtensions
    {
        public static string ConvertToCustomDate(this DateTime? date, string format = "MMM d, yyyy")
        {
            string result = string.Empty;

            if (date.IsValidDate())
            {
                result = date.Value.ToString(format);
            }

            return result;
        }

        public static string ConvertToCustomDate(this DateTime date, string format = "dd-MM-yyyy")
        {
            string result = string.Empty;

            if (date.IsValidDate())
            {
                result = date.ToString(format);
            }

            return result;
        }

        public static string ConvertToCustomTime(this DateTime date, string format = "h:mm tt")
        {
            string result = string.Empty;

            if (date.IsValidDate())
            {
                result = date.ToString(format);
            }

            return result;
        }

        public static string ConvertToCustomDateLowerCaseTime(this DateTime? date, string format = "MMM d, yyyy")
        {
            if (date != null)
            {
                return date.Value.ConvertToCustomDateLowerCaseTime(format);
            }

            return string.Empty;
        }

        public static string ConvertToCustomDateLowerCaseTime(this DateTime date, string format = "MMM d, yyyy")
        {
            string result = string.Empty;

            if (date.IsValidDate())
            {
                result = date.ToString(format) + date.ToString(" tt").ToLower();
            }

            return result;
        }

        public static bool IsValidDate(this DateTime date)
        {
            if (date.Equals(DateTime.MinValue))
            {
                return false;
            }

            return true;
        }

        public static bool IsValidDate(this DateTime? date)
        {
            if (date.Equals(DateTime.MinValue))
            {
                return false;
            }

            return true;
        }

        public static DateTime ClosestDate(this DateTime dateToCompare, IEnumerable<DateTime> avalableDates)
        {
            var closestDate = avalableDates.OrderBy(d => d).First(date => date >= dateToCompare);
            return closestDate;
        }

        public static DateTime ConcatDateAndTime(this string time, DateTime date)
        {
            if (date.IsValidDate() && !string.IsNullOrEmpty(time))
            {
                return date.Add(TimeSpan.Parse(time));
            }

            return default;
        }

        public static string ConvertToCustomDateTime(this DateTime? date, string format = "MMMM d, yyyy - h:mm")
        {
            if (date != null)
            {
                return date.Value.ConvertToCustomDateLowerCaseTime(format);
            }

            return string.Empty;
        }

        public static int GetLastDayOfTheMonth(this DateTime? date)
        {
            if (date != null)
            {
                return DateTime.DaysInMonth(date.Value.Year, date.Value.Month);
            }

            return default;
        }

        public static List<string> GetTimeSlots(this DateTime startTime, DateTime endTime, int duration)
        {
            var timeSlots = new List<string>();
            while (startTime != endTime)
            {
                timeSlots.Add(startTime.ToString("HH:mm"));
                startTime = startTime.AddMinutes(duration);
            }

            if (timeSlots?.Count >= 1)
            {
                timeSlots.RemoveAt(0);
            }

            return timeSlots;
        }

        public static DateTime GetCurrentIST()
        {
            var result = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));

            return result;
        }

        public static string GetCurrentISTDate()
        {
            var result = GetCurrentIST();

            return result.ConvertToCustomDate("yyyy-MM-dd");
        }
    }
}
