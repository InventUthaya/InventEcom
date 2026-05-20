using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DofyEcom.Helper.Attributes;

namespace DofyEcom.DBO;

public class DofyGeo : EntityBase
{
    public int Identifier { get; set; }
    public string Name { get; set; }
    public string EnumName { get; set; }
    public string Code { get; set; }
    public int Level { get; set; }
    public string LevelName { get; set; }
    public int? Parent { get; set; }
    public int RowOrder { get; set; }
    public bool DisplayInList { get; set; }
    public string SecondLanguage { get; set; }
    public decimal DeliveryDelay { get; set; }
    public decimal Distance { get; set; }
    public int? ClusterId { get; set; }
    [DBIgnore]
    public TimeSpan? CutoffTime { get; set; }
    [DBIgnore]
    public string? DayCount { get; set; }
}
