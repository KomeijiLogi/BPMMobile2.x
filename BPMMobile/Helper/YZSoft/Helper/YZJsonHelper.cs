using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Text;
using System.Globalization;

/// <summary>
/// SOAPHelper 的摘要说明

/// </summary>
public class YZJsonHelper
{
    public static IFormatProvider JavaScriptFormat = new CultureInfo(1033);

    public static string EncodeAttribute(string s)
    {
        if (String.IsNullOrEmpty(s))
            return String.Empty;

        StringBuilder sb = new StringBuilder();
        foreach (char c in s)
        {
            switch (c)
            {
                case '\"':
                    sb.Append("\\\"");
                    break;
                case '\'':
                    sb.Append("\\\'");
                    break;
                case '\\':
                    sb.Append("\\\\");
                    break;
                case '\b':
                    sb.Append("\\b");
                    break;
                case '\f':
                    sb.Append("\\f");
                    break;
                case '\n':
                    sb.Append("\\n");
                    break;
                case '\r':
                    sb.Append("\\r");
                    break;
                case '\t':
                    sb.Append("\\t");
                    break;
                default:
                    int i = (int)c;
                    if (i < 32 || i > 127)
                    {
                        sb.AppendFormat("\\u{0:X04}", i);
                    }
                    else
                    {
                        sb.Append(c);
                    }
                    break;
            }
        }

        return sb.ToString();
    }

    public static string ConvertToJsonValue(object value)
    {
        if (value == null || Convert.IsDBNull(value))
            return "\"\"";

        if (value is string)
            return "\"" + YZJsonHelper.EncodeAttribute(Convert.ToString(value)) + "\"";

        if (value is DateTime)
        {
            DateTime date = (DateTime)value;
            if (date == DateTime.MinValue)
                return "\"\"";
            return String.Format("{{\"year\":{0},\"month\":{1},\"day\":{2}}}",
                date.Year,
                date.Month,
                date.Day,
                date.Hour,
                date.Minute,
                date.Second);
        }
        
        if (value is byte[])
            return "\"\"";
        //return "\"" + Convert.ToBase64String((byte[])value) + "\"";目前还不支持绑定2进制数据

        //欧洲、印度等国家，小数点会转换为","，这在JavaScript中不会识别，JS识别的是"."
        string rv = Convert.ToString(value, YZJsonHelper.JavaScriptFormat);

        if (value is bool)
            rv = rv.ToLower();

        return rv;
    }
}
