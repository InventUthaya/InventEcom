namespace DofyEcom.NotificationService
{
    using System.Collections.Generic;

    public interface ITaskChecker<TTask>
    {
        IEnumerable<TTask> FetchPendingTasks(string countryCode);

        void MarkTaskAsProcessed(TTask taskId, string countryCode);

        void UpdateRetryCount(TTask task, string countryCode);
    }
}
