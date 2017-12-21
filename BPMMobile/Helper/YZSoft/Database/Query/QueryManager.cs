using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Web.Configuration;
using BPM;
using BPM.Client;

/// <summary>
/// QueryManager 的摘要说明

/// </summary>
public class QueryManager
{
    static string _dbproviderName = null;

    public static string DBProviderName
    {
        get
        {
            if (QueryManager._dbproviderName == null)
            {
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpenAnonymous();
                    QueryManager._dbproviderName = cn.GetDBProviderName();
                }
            }

            return QueryManager._dbproviderName;
        }
    }

    public static IQueryProvider GetCurrentProvider(HttpContext context)
    {
        if (String.Compare(QueryManager.DBProviderName, "Oracle", true) == 0)
            throw new Exception(@"请注意这不是BUG！<br/>这是Oracle版本的BPM网站配置提示，请按以下步骤完成配置：<br/>1.进入目录：App_Code\YZSoft\Database\Query<br/>2.请释放QueryManager.cs line 43:return new OracleProvider(context);<br/>3.OracleProvider.cs.exclude改名为:OracleProvider.cs");
        //return new OracleProvider(context);
        else
            return new SqlServerProvider(context);
    }

    public static IQueryProvider CurrentProvider
    {
        get
        {
            return QueryManager.GetCurrentProvider(null);
        }
    }
}
