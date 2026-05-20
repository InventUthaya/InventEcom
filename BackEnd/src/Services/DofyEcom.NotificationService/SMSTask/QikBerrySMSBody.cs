namespace DofyEcom.NotificationService
{
    public class QikBerrySMSBody
    {
        public QikBerryRootBody root { get; set; } = new QikBerryRootBody();
        public List<QikBerryNodesBody> nodes { get; set; } = new List<QikBerryNodesBody>();
    }

    public class QikBerryRootBody
    {
        public string type { get; set; } = "A";

        public int flash { get; set; } = 0;

        public string sender { get; set; } = "QIKBRY";

        public string message { get; set; } = "Dofy Team";

        public string service { get; set; } = "T";

        public string webhook_id { get; set; }

        public string time { get; set; }

        public string entity_id { get; set; }

        public string template_id { get; set; }
    }

    public class QikBerryNodesBody
    {
        public string to { get; set; }

        public string custom { get; set; }

        public string sender { get; set; }

        public string message { get; set; }
    }

    public class QikBerryNewBody
    {
        public string to { get; set; }

        public string service { get; set; }

        public string sender { get; set; }

        public string message { get; set; }

        public string template_id { get; set; }
    }
}
