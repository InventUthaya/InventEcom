namespace DofyEcom.Helper.Attributes;

using System;

public class ColumnAttribute : Attribute
{
    public ColumnAttribute()
    {
        this.Export = true;
        this.Order = int.MaxValue;
    }

    public bool Export { get; set; }

    public int Order { get; set; }

    public string Name { get; set; }

    public string Type { get; set; }
}
