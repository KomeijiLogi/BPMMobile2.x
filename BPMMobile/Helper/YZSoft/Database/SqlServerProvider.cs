using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.IO;
using System.Data.SqlClient;
using System.Drawing;
using System.Threading;
using System.Collections.Generic;
using System.Text;
using BPM;
using YZSoft.Web.Communication;
using YZSoft.Web;

/// <summary>
/// SqlServerProvider 的摘要说明
/// </summary>
namespace YZSoft.Web.Database
{
    public class SqlServerProvider : DBProviderBase, IYZDBProvider
    {
        public SqlServerProvider(HttpContext context)
            : base(context)
        {
        }

        public IDbConnection OpenConnection()
        {
            SqlConnection cn = new SqlConnection();

            cn.ConnectionString = System.Web.Configuration.WebConfigurationManager.ConnectionStrings["BPMDB"].ConnectionString;
            cn.Open();
            return cn;
        }

        protected object ExecuteScalar(SqlCommand cmd)
        {
            int tickFrom = System.Environment.TickCount;
            String err = String.Empty;
            try
            {
                return cmd.ExecuteScalar();
            }
            catch (Exception e)
            {
                err = e.Message;
                throw e;
            }
            finally
            {
                //if (Server.SQLTrace)
                //    TraceSql(cmd, err, tickFrom);
            }
        }

        public JsonItemCollection GetFactorys(IDbConnection cn)
        {
            JsonItemCollection factorys = new JsonItemCollection();

            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "SELECT * FROM iSYSFactory";

                using (YZReader reader = new YZReader(cmd.ExecuteReader()))
                {
                    while (reader.Read())
                    {
                        JsonItem factory = new JsonItem();
                        factorys.Add(factory);

                        factory.Attributes["ID"] = reader.ReadInt32("ID");
                        factory.Attributes["Name"] = reader.ReadString("Name");
                        factory.Attributes["MapX"] = reader.ReadInt32("MapX");
                        factory.Attributes["MapY"] = reader.ReadInt32("MapY");
                    }
                }
            }
            return factorys;
        }

        public DataTable Query2Table(string datasourceName, string query, string resultTableName)
        {
            using (SqlConnection cn = new SqlConnection())
            {
                cn.ConnectionString = System.Web.Configuration.WebConfigurationManager.ConnectionStrings[datasourceName].ConnectionString;
                cn.Open();

                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = cn;
                    cmd.CommandText = query;

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        DataTable table = new DataTable(resultTableName);
                        table.Load(reader);
                        return table;
                    }
                }
            }
        }

        public IDataReader GetAttachmentsInfo(IDbConnection cn, string[] fileids)
        {
            List<string> ids = new List<string>();
            for (int i = 0; i < fileids.Length; i++)
                ids.Add("N'" + fileids[i] + "'");

            string filter = ids.Count == 0 ? "1=0" : String.Format("WHERE FileID IN({0})", String.Join(",", ids.ToArray()));
            string query = String.Format("SELECT * FROM YZAppAttachment {0}", filter);

            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = query;

                return cmd.ExecuteReader();
            }
        }

        public void InsertAttachmentInfo(IDbConnection cn, AttachmentInfo attInfo)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = "INSERT INTO YZAppAttachment(FileID,Name,Ext,Size,LastUpdate,OwnerAccount) values(@FileID,@Name,@Ext,@Size,@LastUpdate,@OwnerAccount)";
                cmd.Parameters.Add("@FileID", SqlDbType.NVarChar).Value = attInfo.FileID;
                cmd.Parameters.Add("@Name", SqlDbType.NVarChar).Value = attInfo.Name;
                cmd.Parameters.Add("@Ext", SqlDbType.NVarChar).Value = attInfo.Ext;
                cmd.Parameters.Add("@Size", SqlDbType.Int).Value = attInfo.Size;
                cmd.Parameters.Add("@LastUpdate", SqlDbType.DateTime).Value = attInfo.LastUpdate;
                cmd.Parameters.Add("@OwnerAccount", SqlDbType.NVarChar).Value = attInfo.OwnerAccount;

                cmd.ExecuteNonQuery();
            }
        }

        public byte[] Excel2Image(MemoryStream stream, int timeout, out Size size, out string error)
        {
            error = null;
            size = new Size(0, 0);
            string itemGuid = Guid.NewGuid().ToString();

            try
            {
                byte[] bytes = null;
                using (SqlConnection cn = new SqlConnection())
                {
                    cn.ConnectionString = System.Web.Configuration.WebConfigurationManager.ConnectionStrings["BPMDB"].ConnectionString;
                    cn.Open();

                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = cn;
                        cmd.CommandText = "INSERT INTO YZAppFileConvert(ItemGuid,FileBody,CreateDate,Processed) VALUES(@ItemGuid,@FileBody,@now,0)";
                        cmd.Parameters.Add("@ItemGuid", SqlDbType.NVarChar).Value = itemGuid;
                        cmd.Parameters.Add("@FileBody", SqlDbType.Binary).Value = stream.ToArray();
                        cmd.Parameters.Add("@now", SqlDbType.DateTime).Value = DateTime.Now;

                        cmd.ExecuteNonQuery();
                    }

                    bool readed = false;
                    int tickFrom = Environment.TickCount;
                    while (!readed)
                    {
                        if (Environment.TickCount - tickFrom >= timeout)
                            throw new Exception("超时");

                        Thread.Sleep(50);

                        using (SqlCommand cmd = new SqlCommand())
                        {
                            cmd.Connection = cn;
                            cmd.CommandText = "SELECT ErrorMsg,Image,Width,Height FROM YZAppFileConvert WHERE ItemGuid=@ItemGuid AND Processed=1";
                            cmd.Parameters.Add("@ItemGuid", SqlDbType.NVarChar).Value = itemGuid;

                            using (YZReader reader = new YZReader(cmd.ExecuteReader()))
                            {
                                if (reader.Read())
                                {
                                    readed = true;
                                    error = reader.ReadString(0);
                                    bytes = (byte[])(Convert.IsDBNull(reader.Reader[1]) ? null : reader.Reader[1]);
                                    size.Width = reader.ReadInt32(2);
                                    size.Height = reader.ReadInt32(3);
                                }
                            }
                        }
                    }

                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = cn;
                        cmd.CommandText = "DELETE FROM YZAppFileConvert WHERE ItemGuid=@ItemGuid";
                        cmd.Parameters.Add("@ItemGuid", SqlDbType.NVarChar).Value = itemGuid;

                        cmd.ExecuteNonQuery();
                    }
                }

                return bytes;
            }
            catch (Exception exp)
            {
                error = exp.Message;
                return null;
            }
        }

        public virtual IDbCommand HandlingTimeStepCommand
        {
            get
            {
                GridPageInfo gridPageInfo = new GridPageInfo(this.Context);
                SqlCommand cmd = new SqlCommand();

                //获得查询条件 每一年的的执行计划不一样例如：2012,2013
                string filter = String.Format("ExtStepYear={0} AND HumanStep=1 AND Posted=0 AND AutoProcess=0 AND FinishAt IS NOT NULL AND NodeName!='sysTaskOpt'", Convert.ToInt32(this.GetParam("Year")));

                if (!NameCompare.EquName(this.GetParam("PeriodType"), "year"))
                {
                    filter = this.CombinCond(filter, "ReceiveAt>=@Date1 AND ReceiveAt<@Date2");
                    cmd.Parameters.Add("@Date1", SqlDbType.DateTime).Value = Convert.ToDateTime(this.GetParam("Date1"));
                    cmd.Parameters.Add("@Date2", SqlDbType.DateTime).Value = Convert.ToDateTime(this.GetParam("Date2"));
                }

                string processName = this.GetParam("ProcessName");
                if (!String.IsNullOrEmpty(processName))
                {
                    filter = this.CombinCond(filter, "ProcessName=@ProcessName");
                    cmd.Parameters.Add("@ProcessName", SqlDbType.NVarChar).Value = processName;
                }

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                string filterGrouped = null;
                string processCount = this.GetParam("ProcessCount");
                if (!String.IsNullOrEmpty(processCount))
                {
                    filterGrouped = this.CombinCond(filterGrouped, "Counts>=@ProcessCount");
                    cmd.Parameters.Add("@ProcessCount", SqlDbType.Int).Value = Convert.ToInt32(processCount);
                }

                string hours = this.GetParam("Hours");
                if (!String.IsNullOrEmpty(hours))
                {
                    filterGrouped = this.CombinCond(filterGrouped, "UsedMinutesWork>=@Minutes");
                    cmd.Parameters.Add("@Minutes", SqlDbType.Int).Value = Convert.ToInt32(hours) * 60;
                }

                if (!String.IsNullOrEmpty(filterGrouped))
                    filterGrouped = " WHERE " + filterGrouped;

                //获得排序子句
                string sort = this.GetSortString("UsedMinutesWork DESC");//77177

                //输出列
                StringBuilder fields = new StringBuilder();
                fields.Append("ProcessName,");
                fields.Append("NodeName,");
                fields.Append("round(Avg(UsedMinutesWork),0) UsedMinutesWork,");
                fields.Append("max(UsedMinutesWork) UsedMinutesWorkMax,");
                fields.Append("round(Avg(UsedMinutes),0) UsedMinutes,");
                fields.Append("max(UsedMinutes) UsedMinutesMax,");
                fields.Append("Count(*) Counts");

                //查询语句
                string query = "WITH A AS(SELECT {0} FROM {1} {2} GROUP BY ProcessName,NodeName)," +
                    "X AS(SELECT *,ROW_NUMBER() OVER(ORDER BY {3}) AS RowNum FROM A {4})," +
                    "Y AS(SELECT count(*) AS TotalRows FROM X)," +
                    "Z AS(SELECT X.*,Y.TotalRows FROM Y,X)" +
                    "SELECT * FROM Z WHERE RowNum BETWEEN @StartRowIndex AND @EndRowIndex";

                cmd.CommandText = String.Format(query, fields.ToString(), "BPMInstProcSteps WITH(INDEX(YZIX_BPMInstProcSteps))", filter, sort, filterGrouped);
                cmd.Parameters.Add("@StartRowIndex", SqlDbType.Int).Value = gridPageInfo.RowNumStart;
                cmd.Parameters.Add("@EndRowIndex", SqlDbType.Int).Value = gridPageInfo.RowNumEnd;

                return cmd;
            }
        }

        public virtual IDbCommand HandlingTimeUserCommand
        {
            get
            {
                GridPageInfo gridPageInfo = new GridPageInfo(this.Context);
                SqlCommand cmd = new SqlCommand();
                string searctType = this.GetParam("SearchType");

                //获得查询条件 每一年的的执行计划不一样例如：2012,2013
                string filter = String.Format("ExtStepYear={0} AND HumanStep=1 AND Posted=0 AND AutoProcess=0 AND FinishAt IS NOT NULL AND NodeName!='sysTaskOpt'", Convert.ToInt32(this.GetParam("Year")));

                if (!NameCompare.EquName(this.GetParam("PeriodType"), "year"))
                {
                    filter = this.CombinCond(filter, "ReceiveAt>=@Date1 AND ReceiveAt<@Date2");
                    cmd.Parameters.Add("@Date1", SqlDbType.DateTime).Value = Convert.ToDateTime(this.GetParam("Date1"));
                    cmd.Parameters.Add("@Date2", SqlDbType.DateTime).Value = Convert.ToDateTime(this.GetParam("Date2"));
                }

                if (searctType == "AdvancedSearch")
                {
                    string processName = this.GetParam("ProcessName");
                    if (!String.IsNullOrEmpty(processName))
                    {
                        filter = this.CombinCond(filter, "ProcessName=@ProcessName");
                        cmd.Parameters.Add("@ProcessName", SqlDbType.NVarChar).Value = processName;
                    }

                    string nodeName = this.GetParam("NodeName");
                    if (!String.IsNullOrEmpty(nodeName))
                    {
                        filter = this.CombinCond(filter, "NodeName=@NodeName");
                        cmd.Parameters.Add("@NodeName", SqlDbType.NVarChar).Value = nodeName;
                    }
                }

                string account = this.GetParam("Account");
                if (!String.IsNullOrEmpty(account))
                {
                    filter = this.CombinCond(filter, "OwnerAccount=@Account");
                    cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = account;
                }

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //获得排序子句
                string sort = this.GetSortString("UsedMinutesWork DESC");//77177

                //输出列
                StringBuilder fields = new StringBuilder();
                fields.Append("OwnerAccount,");
                fields.Append("ProcessName,");
                fields.Append("NodeName,");
                fields.Append("round(Avg(UsedMinutesWork),0) UsedMinutesWork,");
                fields.Append("max(UsedMinutesWork) UsedMinutesWorkMax,");
                fields.Append("round(Avg(UsedMinutes),0) UsedMinutes,");
                fields.Append("max(UsedMinutes) UsedMinutesMax,");
                fields.Append("Count(*) Counts");

                //查询语句
                string query = "WITH A AS(SELECT {0} FROM {1} {2} GROUP BY OwnerAccount,ProcessName,NodeName)," +
                    "X AS(SELECT *,ROW_NUMBER() OVER(ORDER BY {3}) AS RowNum FROM A)," +
                    "Y AS(SELECT count(*) AS TotalRows FROM X)," +
                    "Z AS(SELECT X.*,Y.TotalRows FROM Y,X)" +
                    "SELECT * FROM Z WHERE RowNum BETWEEN @StartRowIndex AND @EndRowIndex";

                cmd.CommandText = String.Format(query, fields.ToString(), "BPMInstProcSteps WITH(INDEX(YZIX_BPMInstProcSteps))", filter, sort);
                cmd.Parameters.Add("@StartRowIndex", SqlDbType.Int).Value = gridPageInfo.RowNumStart;
                cmd.Parameters.Add("@EndRowIndex", SqlDbType.Int).Value = gridPageInfo.RowNumEnd;

                return cmd;
            }
        }

        public virtual IDbCommand HandlingTimeDetailCommand
        {
            get
            {
                GridPageInfo gridPageInfo = new GridPageInfo(this.Context);
                SqlCommand cmd = new SqlCommand();
                string searctType = this.GetParam("SearchType");

                //获得查询条件 每一年的的执行计划不一样例如：2012,2013
                string filter = String.Format("ExtStepYear={0} AND HumanStep=1 AND Posted=0 AND AutoProcess=0 AND FinishAt IS NOT NULL AND NodeName!='sysTaskOpt'", Convert.ToInt32(this.GetParam("Year")));

                if (!NameCompare.EquName(this.GetParam("PeriodType"), "year"))
                {
                    filter = this.CombinCond(filter, "ReceiveAt>=@Date1 AND ReceiveAt<@Date2");
                    cmd.Parameters.Add("@Date1", SqlDbType.DateTime).Value = Convert.ToDateTime(this.GetParam("Date1"));
                    cmd.Parameters.Add("@Date2", SqlDbType.DateTime).Value = Convert.ToDateTime(this.GetParam("Date2"));
                }

                if (searctType == "AdvancedSearch")
                {
                    string processName = this.GetParam("ProcessName");
                    if (!String.IsNullOrEmpty(processName))
                    {
                        filter = this.CombinCond(filter, "ProcessName=@ProcessName");
                        cmd.Parameters.Add("@ProcessName", SqlDbType.NVarChar).Value = processName;
                    }

                    string nodeName = this.GetParam("NodeName");
                    if (!String.IsNullOrEmpty(nodeName))
                    {
                        filter = this.CombinCond(filter, "NodeName=@NodeName");
                        cmd.Parameters.Add("@NodeName", SqlDbType.NVarChar).Value = nodeName;
                    }

                    string account = this.GetParam("Account");
                    if (!String.IsNullOrEmpty(account))
                    {
                        filter = this.CombinCond(filter, "OwnerAccount=@Account");
                        cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = account;
                    }
                }

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //获得排序子句
                string sort = this.GetSortString("UsedMinutesWork DESC");//77177

                //输出列
                StringBuilder fields = new StringBuilder();
                fields.Append("TaskID,");
                fields.Append("StepID,");
                fields.Append("ProcessName,");
                fields.Append("NodeName,");
                fields.Append("OwnerAccount,");
                fields.Append("HandlerAccount,");
                fields.Append("ReceiveAt,");
                fields.Append("FinishAt,");
                fields.Append("TimeoutNotifyCount,");
                fields.Append("TimeoutDeadline,");
                fields.Append("(case when FinishAt>TimeoutDeadline then 1 else 0 end) Timeouted,");
                fields.Append("UsedMinutesWork,");
                fields.Append("UsedMinutes");

                //查询语句
                string query = "WITH A AS(SELECT {0} FROM {1} {2})," +
                    "X AS(SELECT *,ROW_NUMBER() OVER(ORDER BY {3}) AS RowNum FROM A)," +
                    "Y AS(SELECT count(*) AS TotalRows FROM X)," +
                    "Z AS(SELECT X.*,Y.TotalRows FROM Y,X)" +
                    "SELECT * FROM Z WHERE RowNum BETWEEN @StartRowIndex AND @EndRowIndex";

                cmd.CommandText = String.Format(query, fields.ToString(), "BPMInstProcSteps WITH(INDEX(YZIX_BPMInstProcSteps))", filter, sort);
                cmd.Parameters.Add("@StartRowIndex", SqlDbType.Int).Value = gridPageInfo.RowNumStart;
                cmd.Parameters.Add("@EndRowIndex", SqlDbType.Int).Value = gridPageInfo.RowNumEnd;

                return cmd;
            }
        }

        public virtual IDbCommand TimeoutStepCommand
        {
            get
            {
                GridPageInfo gridPageInfo = new GridPageInfo(this.Context);
                SqlCommand cmd = new SqlCommand();

                //获得查询条件 每一年的的执行计划不一样例如：2012,2013
                string filter = String.Format("ExtStepYear={0} AND HumanStep=1 AND Posted=0 AND AutoProcess=0 AND FinishAt IS NOT NULL AND NodeName!='sysTaskOpt'", Convert.ToInt32(this.GetParam("Year")));

                if (!NameCompare.EquName(this.GetParam("PeriodType"), "year"))
                {
                    filter = this.CombinCond(filter, "ReceiveAt>=@Date1 AND ReceiveAt<@Date2");
                    cmd.Parameters.Add("@Date1", SqlDbType.DateTime).Value = Convert.ToDateTime(this.GetParam("Date1"));
                    cmd.Parameters.Add("@Date2", SqlDbType.DateTime).Value = Convert.ToDateTime(this.GetParam("Date2"));
                }

                string processName = this.GetParam("ProcessName");
                if (!String.IsNullOrEmpty(processName))
                {
                    filter = this.CombinCond(filter, "ProcessName=@ProcessName");
                    cmd.Parameters.Add("@ProcessName", SqlDbType.NVarChar).Value = processName;
                }

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                string filterGrouped = null;
                string processCount = this.GetParam("ProcessCount");
                if (!String.IsNullOrEmpty(processCount))
                {
                    filterGrouped = this.CombinCond(filterGrouped, "Counts>=@ProcessCount");
                    cmd.Parameters.Add("@ProcessCount", SqlDbType.Int).Value = Convert.ToInt32(processCount);
                }

                string percent = this.GetParam("Percent");
                if (!String.IsNullOrEmpty(percent))
                {
                    filterGrouped = this.CombinCond(filterGrouped, "TimeoutPercent>=@Percent");
                    cmd.Parameters.Add("@Percent", SqlDbType.Int).Value = Convert.ToInt32(percent) * 10;
                }

                if (!String.IsNullOrEmpty(filterGrouped))
                    filterGrouped = " WHERE " + filterGrouped;

                //获得排序子句
                string sort = this.GetSortString("TimeoutCount DESC");

                //输出列
                StringBuilder fields = new StringBuilder();
                fields.Append("ProcessName,");
                fields.Append("NodeName,");
                fields.Append("sum(case when FinishAt>TimeoutDeadline then 1 else 0 end) TimeoutCount,");
                fields.Append("sum(case when FinishAt>TimeoutDeadline then 1 else 0 end)*1000/Count(*) TimeoutPercent,");
                fields.Append("Count(*) Counts");

                //查询语句
                string query = "WITH A AS(SELECT {0} FROM {1} {2} GROUP BY ProcessName,NodeName)," +
                    "X AS(SELECT *,ROW_NUMBER() OVER(ORDER BY {3}) AS RowNum FROM A {4})," +
                    "Y AS(SELECT count(*) AS TotalRows FROM X)," +
                    "Z AS(SELECT X.*,Y.TotalRows FROM Y,X)" +
                    "SELECT * FROM Z WHERE RowNum BETWEEN @StartRowIndex AND @EndRowIndex";

                cmd.CommandText = String.Format(query, fields.ToString(), "BPMInstProcSteps WITH(INDEX(YZIX_BPMInstProcSteps))", filter, sort, filterGrouped);
                cmd.Parameters.Add("@StartRowIndex", SqlDbType.Int).Value = gridPageInfo.RowNumStart;
                cmd.Parameters.Add("@EndRowIndex", SqlDbType.Int).Value = gridPageInfo.RowNumEnd;

                return cmd;
            }
        }

        public virtual IDbCommand TimeoutUserCommand
        {
            get
            {
                GridPageInfo gridPageInfo = new GridPageInfo(this.Context);
                SqlCommand cmd = new SqlCommand();
                string searctType = this.GetParam("SearchType");

                //获得查询条件 每一年的的执行计划不一样例如：2012,2013
                string filter = String.Format("ExtStepYear={0} AND HumanStep=1 AND Posted=0 AND AutoProcess=0 AND FinishAt IS NOT NULL AND NodeName!='sysTaskOpt'", Convert.ToInt32(this.GetParam("Year")));
                string filterGrouped = null;

                if (!NameCompare.EquName(this.GetParam("PeriodType"), "year"))
                {
                    filter = this.CombinCond(filter, "ReceiveAt>=@Date1 AND ReceiveAt<@Date2");
                    cmd.Parameters.Add("@Date1", SqlDbType.DateTime).Value = Convert.ToDateTime(this.GetParam("Date1"));
                    cmd.Parameters.Add("@Date2", SqlDbType.DateTime).Value = Convert.ToDateTime(this.GetParam("Date2"));
                }

                if (searctType == "AdvancedSearch")
                {
                    //从超时统计跳转而来，此时只列出超时的步骤
                    filterGrouped = this.CombinCond(filterGrouped, "TimeoutCount >= 1");

                    string processName = this.GetParam("ProcessName");
                    if (!String.IsNullOrEmpty(processName))
                    {
                        filter = this.CombinCond(filter, "ProcessName=@ProcessName");
                        cmd.Parameters.Add("@ProcessName", SqlDbType.NVarChar).Value = processName;
                    }

                    string nodeName = this.GetParam("NodeName");
                    if (!String.IsNullOrEmpty(nodeName))
                    {
                        filter = this.CombinCond(filter, "NodeName=@NodeName");
                        cmd.Parameters.Add("@NodeName", SqlDbType.NVarChar).Value = nodeName;
                    }
                }

                string account = this.GetParam("Account");
                if (!String.IsNullOrEmpty(account))
                {
                    filter = this.CombinCond(filter, "OwnerAccount=@Account");
                    cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = account;
                }

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                if (!String.IsNullOrEmpty(filterGrouped))
                    filterGrouped = " WHERE " + filterGrouped;

                //获得排序子句
                string sort = this.GetSortString("TimeoutCount DESC");

                //输出列
                StringBuilder fields = new StringBuilder();
                fields.Append("OwnerAccount,");
                fields.Append("ProcessName,");
                fields.Append("NodeName,");
                fields.Append("sum(case when FinishAt>TimeoutDeadline then 1 else 0 end) TimeoutCount,");
                fields.Append("sum(case when FinishAt>TimeoutDeadline then 1 else 0 end)*1000/Count(*) TimeoutPercent,");
                fields.Append("Count(*) Counts");

                //查询语句
                string query = "WITH A AS(SELECT {0} FROM {1} {2} GROUP BY OwnerAccount,ProcessName,NodeName)," +
                    "X AS(SELECT *,ROW_NUMBER() OVER(ORDER BY {3}) AS RowNum FROM A {4})," +
                    "Y AS(SELECT count(*) AS TotalRows FROM X)," +
                    "Z AS(SELECT X.*,Y.TotalRows FROM Y,X)" +
                    "SELECT * FROM Z WHERE RowNum BETWEEN @StartRowIndex AND @EndRowIndex";

                cmd.CommandText = String.Format(query, fields.ToString(), "BPMInstProcSteps WITH(INDEX(YZIX_BPMInstProcSteps))", filter, sort, filterGrouped);
                cmd.Parameters.Add("@StartRowIndex", SqlDbType.Int).Value = gridPageInfo.RowNumStart;
                cmd.Parameters.Add("@EndRowIndex", SqlDbType.Int).Value = gridPageInfo.RowNumEnd;

                return cmd;
            }
        }

        public virtual IDbCommand TimeoutDetailCommand
        {
            get
            {
                GridPageInfo gridPageInfo = new GridPageInfo(this.Context);
                SqlCommand cmd = new SqlCommand();
                string searctType = this.GetParam("SearchType");

                //获得查询条件 每一年的的执行计划不一样例如：2012,2013
                string filter = String.Format("ExtStepYear={0} AND HumanStep=1 AND Posted=0 AND AutoProcess=0 AND FinishAt IS NOT NULL AND NodeName!='sysTaskOpt'", Convert.ToInt32(this.GetParam("Year")));

                if (!NameCompare.EquName(this.GetParam("PeriodType"), "year"))
                {
                    filter = this.CombinCond(filter, "ReceiveAt>=@Date1 AND ReceiveAt<@Date2");
                    cmd.Parameters.Add("@Date1", SqlDbType.DateTime).Value = Convert.ToDateTime(this.GetParam("Date1"));
                    cmd.Parameters.Add("@Date2", SqlDbType.DateTime).Value = Convert.ToDateTime(this.GetParam("Date2"));
                }

                if (searctType == "AdvancedSearch")
                {
                    filter = this.CombinCond(filter, "FinishAt>TimeoutDeadline");

                    string processName = this.GetParam("ProcessName");
                    if (!String.IsNullOrEmpty(processName))
                    {
                        filter = this.CombinCond(filter, "ProcessName=@ProcessName");
                        cmd.Parameters.Add("@ProcessName", SqlDbType.NVarChar).Value = processName;
                    }

                    string nodeName = this.GetParam("NodeName");
                    if (!String.IsNullOrEmpty(nodeName))
                    {
                        filter = this.CombinCond(filter, "NodeName=@NodeName");
                        cmd.Parameters.Add("@NodeName", SqlDbType.NVarChar).Value = nodeName;
                    }

                    string account = this.GetParam("Account");
                    if (!String.IsNullOrEmpty(account))
                    {
                        filter = this.CombinCond(filter, "OwnerAccount=@Account");
                        cmd.Parameters.Add("@Account", SqlDbType.NVarChar).Value = account;
                    }
                }

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //获得排序子句
                string sort = this.GetSortString("UsedMinutesWork DESC");

                //输出列
                StringBuilder fields = new StringBuilder();
                fields.Append("TaskID,");
                fields.Append("StepID,");
                fields.Append("ProcessName,");
                fields.Append("NodeName,");
                fields.Append("OwnerAccount,");
                fields.Append("HandlerAccount,");
                fields.Append("ReceiveAt,");
                fields.Append("FinishAt,");
                fields.Append("TimeoutNotifyCount,");
                fields.Append("TimeoutDeadline,");
                fields.Append("(case when FinishAt>TimeoutDeadline then 1 else 0 end) Timeouted,");
                fields.Append("UsedMinutesWork,");
                fields.Append("UsedMinutes");

                //查询语句
                string query = "WITH A AS(SELECT {0} FROM {1} {2})," +
                    "X AS(SELECT *,ROW_NUMBER() OVER(ORDER BY {3}) AS RowNum FROM A)," +
                    "Y AS(SELECT count(*) AS TotalRows FROM X)," +
                    "Z AS(SELECT X.*,Y.TotalRows FROM Y,X)" +
                    "SELECT * FROM Z WHERE RowNum BETWEEN @StartRowIndex AND @EndRowIndex";

                cmd.CommandText = String.Format(query, fields.ToString(), "BPMInstProcSteps WITH(INDEX(YZIX_BPMInstProcSteps))", filter, sort);
                cmd.Parameters.Add("@StartRowIndex", SqlDbType.Int).Value = gridPageInfo.RowNumStart;
                cmd.Parameters.Add("@EndRowIndex", SqlDbType.Int).Value = gridPageInfo.RowNumEnd;

                return cmd;
            }
        }

        public virtual IDbCommand SystemUsageCommand
        {
            get
            {
                SqlCommand cmd = new SqlCommand();

                //获得查询条件 每一年的的执行计划不一样例如：2012,2013
                string filter = String.Format("ExtYear={0}", Convert.ToInt32(this.GetParam("Year")));

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                //查询语句
                string query =
                    "WITH " +
                    "A AS(SELECT State,MONTH(CreateAt) [Month],Count(*) Counts FROM BPMInstTasks {0} GROUP BY State,MONTH(CreateAt))," +
                    "B AS(SELECT State," +
                    "max(case when [Month]=1 then Counts else 0 end) Month1," +
                    "max(case when [Month]=2 then Counts else 0 end) Month2," +
                    "max(case when [Month]=3 then Counts else 0 end) Month3," +
                    "max(case when [Month]=4 then Counts else 0 end) Month4," +
                    "max(case when [Month]=5 then Counts else 0 end) Month5," +
                    "max(case when [Month]=6 then Counts else 0 end) Month6," +
                    "max(case when [Month]=7 then Counts else 0 end) Month7," +
                    "max(case when [Month]=8 then Counts else 0 end) Month8," +
                    "max(case when [Month]=9 then Counts else 0 end) Month9," +
                    "max(case when [Month]=10 then Counts else 0 end) Month10," +
                    "max(case when [Month]=11 then Counts else 0 end) Month11," +
                    "max(case when [Month]=12 then Counts else 0 end) Month12," +
                    "sum(Counts) Total FROM A GROUP BY State)" +
                    "SELECT * FROM B";

                cmd.CommandText = String.Format(query, filter);
                return cmd;
            }
        }

        public virtual IDbCommand ProcessUsageCommand
        {
            get
            {
                GridPageInfo gridPageInfo = new GridPageInfo(this.Context);
                SqlCommand cmd = new SqlCommand();

                //获得查询条件 每一年的的执行计划不一样例如：2012,2013
                string filter = String.Format("ExtYear={0}", Convert.ToInt32(this.GetParam("Year")));

                if (!NameCompare.EquName(this.GetParam("PeriodType"), "year"))
                {
                    filter = this.CombinCond(filter, "CreateAt>=@Date1 AND CreateAt<@Date2");
                    cmd.Parameters.Add("@Date1", SqlDbType.DateTime).Value = Convert.ToDateTime(this.GetParam("Date1"));
                    cmd.Parameters.Add("@Date2", SqlDbType.DateTime).Value = Convert.ToDateTime(this.GetParam("Date2"));
                }

                if (!String.IsNullOrEmpty(filter))
                    filter = " WHERE " + filter;

                string filterGrouped = null;
                string instanceCount = this.GetParam("InstanceCount");
                if (!String.IsNullOrEmpty(instanceCount))
                {
                    filterGrouped = this.CombinCond(filterGrouped, "Total>=@InstanceCount");
                    cmd.Parameters.Add("@InstanceCount", SqlDbType.Int).Value = Convert.ToInt32(instanceCount);
                }

                if (!String.IsNullOrEmpty(filterGrouped))
                    filterGrouped = " WHERE " + filterGrouped;

                //获得排序子句
                string sort = this.GetSortString("Total DESC");

                //查询语句
                string query =
                    "WITH A AS(SELECT ProcessName,State,Count(*) Counts FROM BPMInstTasks {0} GROUP BY ProcessName,State)," +
                    "B AS(SELECT ProcessName," +
                    "max(case State when 'Approved' then Counts else 0 end) Approved," +
                    "max(case State when 'Running' then Counts else 0 end) Running," +
                    "max(case State when 'Rejected' then Counts else 0 end) Rejected," +
                    "max(case State when 'Aborted' then Counts else 0 end) Aborted," +
                    "max(case State when 'Deleted' then Counts else 0 end) Deleted," +
                    "sum(Counts) Total " +
                    "FROM A GROUP BY ProcessName)," +
                    "X AS(SELECT *,ROW_NUMBER() OVER(ORDER BY {1}) AS RowNum FROM B {2})," +
                    "Y AS(SELECT count(*) AS TotalRows FROM X)," +
                    "Z AS(SELECT X.*,Y.TotalRows FROM Y,X)" +
                    "SELECT * FROM Z WHERE RowNum BETWEEN @StartRowIndex AND @EndRowIndex";

                cmd.CommandText = String.Format(query, filter, sort, filterGrouped);
                cmd.Parameters.Add("@StartRowIndex", SqlDbType.Int).Value = gridPageInfo.RowNumStart;
                cmd.Parameters.Add("@EndRowIndex", SqlDbType.Int).Value = gridPageInfo.RowNumEnd;

                return cmd;
            }
        }

        #region Communication

        public virtual IDbCommand GetResourceCommunicationNewMessagesCommand(YZResourceType resType, string resId, int maxReadedMessageId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.CommandText = "SELECT * FROM YZAppCommunication WHERE resType=@resType AND resId=@resId AND id>@id ORDER BY id";

                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = resType.ToString();
                cmd.Parameters.Add("@resId", SqlDbType.NVarChar).Value = resId;
                cmd.Parameters.Add("@id", SqlDbType.Int).Value = maxReadedMessageId;

                return cmd;
            }
        }

        public virtual int GetTaskCommunicationNewMessageCount(IDbConnection cn, string uid, BPMObjectNameCollection sids)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.AppendLine("WITH A AS(SELECT M.* FROM YZV_TaskCommunicationRead M WHERE uid=@uid),");
                sb.AppendLine("B AS(SELECT M.*,A.uid as ruid,isnull(A.readId,0) readId FROM YZV_TaskCommunication M LEFT JOIN A ON M.TaskID=A.TaskID WHERE M.id>isnull(A.readId,0)),");
                sb.AppendLine("C AS(SELECT TaskID,count(*) count FROM B GROUP BY TaskID),");
                sb.AppendLine(String.Format("D AS(SELECT * FROM C WHERE TaskID IN(SELECT TaskID FROM YZV_TaskAccess WHERE SID IN({0})))", this.GetDBInString(sids, uid)));
                sb.AppendLine("SELECT ISNULL(sum(count),0) as count FROM D");

                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = uid;

                return Convert.ToInt32(this.ExecuteScalar(cmd));
            }
        }

        public virtual IDbCommand GetTaskCommunicationListCommand(IDbConnection cn, string uid, BPMObjectNameCollection sids, string taskTableFilter, string messageTableFilter, int start, int limit)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                string filter = null;

                if (!String.IsNullOrEmpty(messageTableFilter))
                filter = String.Format("TaskID IN(SELECT DISTINCT TaskID FROM B WHERE {0})",messageTableFilter);

                filter = this.CombinCondOR(filter, taskTableFilter);

                if (!String.IsNullOrEmpty(filter))
                    filter = "WHERE " + filter;

                StringBuilder sb = new StringBuilder();
                sb.AppendLine("WITH A AS(SELECT M.* FROM YZV_TaskCommunicationRead M WHERE uid=@uid),");
                sb.AppendLine("B AS(SELECT M.*,A.uid as ruid,isnull(A.readId,0) as readId FROM YZV_TaskCommunication M LEFT JOIN A ON M.TaskID=A.TaskID),");
                sb.AppendLine("C1 AS(SELECT sum(case when id>readId then 1 else 0 end) count,count(*) total,max(id) as lastMsgId FROM B GROUP BY TaskID),");
                sb.AppendLine("C AS(SELECT B.*,C1.* FROM C1 INNER JOIN B ON C1.lastMsgId=B.id),");
                //sb.AppendLine("B AS(SELECT M.*,A.uid as ruid FROM YZV_TaskCommunication M LEFT JOIN A ON M.TaskID=A.TaskID WHERE M.id>isnull(A.readId,0)),");
                //sb.AppendLine("C AS(SELECT TaskID,count(*) count FROM B GROUP BY TaskID),");
                sb.AppendLine("D AS(SELECT * FROM C WHERE TaskID IN(SELECT TaskID FROM YZV_TaskAccess WHERE SID IN({0}))),");
                sb.AppendLine("E AS(SELECT D.*,SerialNum,ProcessName,OwnerAccount,AgentAccount,CreateAt,Description,State FROM D INNER JOIN BPMInstTasks M ON D.TaskID=M.TaskID),");
                sb.AppendLine("F AS(SELECT * FROM E {1}),");
                sb.AppendLine("X AS(SELECT *,ROW_NUMBER() OVER(ORDER BY id DESC) AS RowNum FROM F),");
                sb.AppendLine("Y AS(SELECT count(*) AS TotalRows FROM X),");
                sb.AppendLine("Z AS(SELECT X.*,Y.TotalRows FROM Y,X)");
                sb.AppendLine("SELECT * FROM Z WHERE RowNum = 1 OR RowNum BETWEEN @StartRowIndex AND @EndRowIndex ORDER BY RowNum");
                cmd.CommandText = String.Format(sb.ToString(), this.GetDBInString(sids, uid), filter);

                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = uid;
                cmd.Parameters.Add("@StartRowIndex", SqlDbType.Int).Value = start + 1;
                cmd.Parameters.Add("@EndRowIndex", SqlDbType.Int).Value = start + limit;

                return cmd;
            }
        }

        public virtual IDbCommand GetResourceCommunicationCountCommand(YZResourceType resType, string resId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendLine("select count(*) from YZAppCommunication WHERE resType=@resType and resId=@resId");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = resType.ToString();
                cmd.Parameters.Add("@resId", SqlDbType.NVarChar).Value = resId;

                return cmd;
            }
        }

        public virtual IDbCommand GetResourceCommunicationNewMessageCountCommand(string uid, YZResourceType resType, string resId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendLine("declare @readId int");
                sb.AppendLine("select @readId = ISNULL(max(readId),0) from YZAppCommunicationRead WHERE resType=@resType and resId=@resId and uid=@uid");
                sb.AppendLine("select count(*) from YZAppCommunication WHERE resType=@resType and resId=@resId and id>@readId");
                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = resType.ToString();
                cmd.Parameters.Add("@resId", SqlDbType.NVarChar).Value = resId;
                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = uid;

                return cmd;
            }
        }

        public virtual YZMessage Insert(IDbConnection cn, YZMessage message)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.Append("SET NOCOUNT ON;");
                sb.Append("INSERT INTO YZAppCommunication(");
                sb.Append("uid,");
                sb.Append("date,");
                sb.Append("resType,");
                sb.Append("resId,");
                sb.Append("message) ");
                sb.Append("VALUES(");
                sb.Append("@uid,");
                sb.Append("@date,");
                sb.Append("@resType,");
                sb.Append("@resId,");
                sb.Append("@message);");
                sb.Append("SELECT @@IDENTITY");

                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = message.uid;
                cmd.Parameters.Add("@date", SqlDbType.DateTime).Value = message.date;
                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = message.resType;
                cmd.Parameters.Add("@resId", SqlDbType.NVarChar).Value = message.resId;
                cmd.Parameters.Add("@message", SqlDbType.NVarChar).Value = message.message;

                message.id = Convert.ToInt32(this.ExecuteScalar(cmd));
                return message;
            }
        }

        public virtual void UpdateResourceCommunicationReaded(IDbConnection cn, string uid, YZResourceType resType, string resId, int maxReadedMessageId)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;

                StringBuilder sb = new StringBuilder();
                sb.AppendLine("SELECT * FROM YZAppCommunicationRead WHERE uid=@uid AND resType=@resType AND resId=@resId AND readId>@readId");
                sb.AppendLine("IF @@ROWCOUNT = 0");
                sb.AppendLine("BEGIN");
                sb.AppendLine("UPDATE YZAppCommunicationRead SET readId=@readId WHERE uid=@uid AND resType=@resType AND resId=@resId");
                sb.AppendLine("IF @@ROWCOUNT = 0");
                sb.AppendLine("INSERT INTO YZAppCommunicationRead(uid,resType,resId,readId) VALUES(@uid,@resType,@resId,@readId)");
                sb.AppendLine("END");

                cmd.CommandText = sb.ToString();

                cmd.Parameters.Add("@uid", SqlDbType.NVarChar).Value = uid;
                cmd.Parameters.Add("@resType", SqlDbType.NVarChar).Value = resType.ToString();
                cmd.Parameters.Add("@resId", SqlDbType.NVarChar).Value = resId;
                cmd.Parameters.Add("@readId", SqlDbType.Int).Value = maxReadedMessageId;

                cmd.ExecuteNonQuery();
            }
        }

        #endregion
    }
}