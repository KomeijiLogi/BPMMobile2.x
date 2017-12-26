using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using Helper;
using BPM.Client;
using BPM;
using System.Net.Sockets;
using System.Xml;
using System.Xml.Linq;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.Identity;
using System.IO;
using System.Data;
using BPMMobile.Models;
using System.Configuration;
using YUN;
using log4net;
using System.Reflection;
using System.Text;
using BPM.Client.Data.Common;
using BPM.Data.Common;


namespace BPMMobile.Controllers
{
    [YunAuthenticate]
    public class BPMController : ApiController
    {
        [HttpPost]
        //[Route("PostAccount")] 
        public IHttpActionResult PostAccount([FromBody] PostAccountInput input)
        {
            string yunxt = ConfigurationManager.AppSettings["yunxt"];//轻应用注册到云之家时生成 
            string eid = ConfigurationManager.AppSettings["eid"];// 
            string keyFile = ConfigurationManager.AppSettings["keyFile"];// 
            string privatekey = AppDomain.CurrentDomain.BaseDirectory + keyFile;
            byte[] data;
            using (FileStream fs = File.OpenRead(privatekey))
            {
                data = new byte[fs.Length];
                fs.Read(data, 0, data.Length);
            }
            var resp = YUNAPI.GetPersonInfo(yunxt, eid, data, input.ids);
            return Json(resp);

        }

        //[HttpPost]
        //public IHttpActionResult PostDepart([FromBody] PostAccountInput input)
        //{
        //    string yunxt = ConfigurationManager.AppSettings["yunxt"];//轻应用注册到云之家时生成 
        //    string eid = ConfigurationManager.AppSettings["eid"];// 
        //    string keyFile = ConfigurationManager.AppSettings["keyFile"];// 
        //    string privatekey = AppDomain.CurrentDomain.BaseDirectory + keyFile;
        //    byte[] data;
        //    using (FileStream fs = File.OpenRead(privatekey))
        //    {
        //        data = new byte[fs.Length];
        //        fs.Read(data, 0, data.Length);
        //    }
        //    var resp = YUNAPI.GetDepartInfo(yunxt, eid, data, input.ids);
        //    return Json(resp);

        //}

        /// <summary>
        /// 可发起流程列表
        /// </summary>
        /// <returns></returns>

        private List<Process> GetCanCreate()
        {
            PrepareBPMEnv();

            List<Process> myProcesses = new List<Process>();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                BPMProcessCollection processes = new BPMProcessCollection();
                var mobileProcess = GetMobileProcess();
                var cache = new Dictionary<string, BPMProcessCollection>();
                foreach (var p in mobileProcess)
                {
                    if (!p.CanCreate) continue;
                    if (cache.ContainsKey(p.Path))
                    {
                        processes = cache[p.Path];
                    }
                    else
                    {
                        processes = cn.GetProcessList(p.Path, BPMPermision.Execute, true);
                        cache.Add(p.Path, processes);
                    }
                    foreach (BPMProcess item in processes)
                    {
                        if (item.Name == p.Name)
                        {
                            p.Version = item.Version.Major.ToString() + "." + item.Version.Minor.ToString();
                            myProcesses.Add(p);
                        }
                    }
                }
            }
            return myProcesses;
        }
        /// <summary>
        /// 可发起流程列表
        /// </summary>
        /// <returns></returns>

        public IHttpActionResult GetCanCreateProcess()
        {
            //PrepareBPMEnv();

            //List<Process> myProcesses = new List<Process> ();
            //using (BPMConnection cn = new BPMConnection())
            //{
            //    cn.WebOpen();

            //    BPMProcessCollection processes = new BPMProcessCollection();
            //    var mobileProcess = GetMobileProcess();
            //    var cache = new Dictionary<string, BPMProcessCollection>();
            //    foreach (var p in mobileProcess)
            //    {
            //        if (!p.CanCreate) continue;
            //        if (cache.ContainsKey(p.Path))
            //        {
            //            processes = cache[p.Path];
            //        }
            //        else
            //        {
            //            processes = cn.GetProcessList(p.Path, BPMPermision.Execute, true);
            //            cache.Add(p.Path, processes);
            //        }
            //        foreach (BPMProcess item in processes)
            //        {
            //            if (item.Name == p.Name)
            //            {
            //                p.Version = item.Version.Major.ToString()+"." + item.Version.Minor.ToString();
            //                myProcesses.Add(p);
            //            }
            //        }
            //    }
            //}
            var list = GetCanCreate();
                return Json(list);
            }
        /// <summary>
        /// 获取待办任务数量
        /// </summary>
        /// <returns></returns>
        public int GetMyTaskCount()
        {
            PrepareBPMEnv();
            var tasks= GetMyTaskList();
            return tasks.Count;
        }
      
        /// <summary>
        /// 获取全部待办任务
        /// </summary>
        /// <returns></returns>
        public IHttpActionResult GetMyUndoTaskAll()
        {
            var taskList=GetMyTaskList();
            var mobileProcess = GetMobileProcess();
            var ret = from t in taskList
                        join m in mobileProcess on t.ProcessName equals m.Name
                        select new TaskDto()
                        {
                            DisplayName = m.DisplayName,
                            Icon=m.Icon,
                            
                            ReceiveAt=t.ReceiveAt,
                            CreateAt=t.CreateAt,
                            ViewUndoPage = m.ViewUndoPage,
                            ViewAskPage = m.ViewAskPage,
                            ViewDonePage = m.ViewDonePage,
                            Description =t.Description,
                            ProcessName=t.ProcessName,
                            StepID=t.StepID,
                            StepName=t.StepName,
                            TaskID=t.TaskID
                        };
    
            return Json(ret);
        }

       

        /// <summary>
        /// 获取待办任务分页
        /// </summary>
        /// <returns></returns>
        public IHttpActionResult GetMyUndoTask(int startRowIndex,int rows,String search)
        {
            var allList = GetMyTaskList();


            if (search!=null&&search != "")
            {
              allList = GetMyTaskList(search);
            }
           
            var taskList = allList
                .OrderByDescending(t=>t.ReceiveAt)
                .Skip(startRowIndex)
                .Take(rows);
            var mobileProcess = GetMobileProcess();
          
                var ret = from t in taskList
                          join m in mobileProcess on t.ProcessName equals m.Name
                          select new TaskDto()
                          {
                              DisplayName = m.DisplayName,
                              Icon = m.Icon,
                              ReceiveAt = t.ReceiveAt,
                              ViewUndoPage = m.ViewUndoPage,
                              ViewAskPage = m.ViewAskPage,
                              ViewDonePage = m.ViewDonePage,
                              Description = t.Description,
                              ProcessName = t.ProcessName,
                              StepID = t.StepID,
                              StepName = t.StepName,
                              TaskID = t.TaskID
                          };
                return Json(new { tasks = ret, total = allList.Count });
           

            
        }

        /// <summary>
        /// 获取BPM业务数据
        /// </summary>
        /// <param name="xml"></param>
        /// <returns></returns>
        [HttpPost]
        public string DataProvider([FromBody] string xml)
        {



            XmlDocument doc = new XmlDocument();
            doc.LoadXml(xml);

            XmlNodeList nodeParams = doc.SelectNodes("Requests/Params");
            try
            {
                JsonItemCollection jTables = new JsonItemCollection();
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    for (int i = 0; i < nodeParams.Count; i++)
                    {
                        XmlNode nodeParam = nodeParams[i];

                        string method = null;
                        XmlNode nodeMethod = nodeParam.SelectSingleNode("Method");
                        if (nodeMethod != null)
                            method = nodeMethod.InnerText;

                        if (String.Compare(method, "GetUserDataTable", true) == 0)
                        {
                            XmlNode nodeDataSourceName = nodeParam.SelectSingleNode("DataSource");
                            string dataSourceName = nodeDataSourceName.InnerText;

                            XmlNode nodeTableName = nodeParam.SelectSingleNode("TableName");
                            string tableName = nodeTableName.InnerText;

                            XmlNode nodeOrderBy = nodeParam.SelectSingleNode("OrderBy");
                            string orderBy = nodeOrderBy.InnerText;

                            BPMDBParameterCollection filters = new BPMDBParameterCollection();
                            XmlNode nodeFilters = nodeParam.SelectSingleNode("Filter");
                            if (nodeFilters != null)
                            {
                                foreach (KeyValuePair<string, YZDSFilter> filter in filters)
                                {
                                    BPMDBParameter paramater = new BPMDBParameter(filter.Key, typeof(String), filter.Value.value);
                                    filters.Add(paramater);
                                }
                            }


                            FlowDataTable table = DataSourceManager.LoadTableData(cn, dataSourceName, tableName, filters, orderBy);
                            this.AppendTo(i, jTables, table, false);
                        }
                        else if (String.Compare(method, "GetUserDataProcedure", true) == 0)
                        {
                            XmlNode nodeDataSourceName = nodeParam.SelectSingleNode("DataSource");
                            string dataSourceName = nodeDataSourceName.InnerText;

                            XmlNode nodeProcedureName = nodeParam.SelectSingleNode("ProcedureName");
                            string procedureName = nodeProcedureName.InnerText;

                            BPMDBParameterCollection filters = new BPMDBParameterCollection();
                            XmlNode nodeFilters = nodeParam.SelectSingleNode("Filter");
                            if (nodeFilters != null)
                            {
                                foreach (KeyValuePair<string, YZDSFilter> filter in filters)
                                {
                                    BPMDBParameter paramater = new BPMDBParameter(filter.Key, typeof(String), filter.Value.value);
                                    filters.Add(paramater);
                                }
                            }

                            FlowDataTable table = DataSourceManager.ExecProcedure(cn, dataSourceName, procedureName, filters);
                            this.AppendTo(i, jTables, table, false);
                        }
                        else if (String.Compare(method, "GetFormPostData", true) == 0)
                        {
                            XmlNode nodeProcessName = nodeParam.SelectSingleNode("ProcessName");
                            string processName = nodeProcessName.InnerText;
                            XmlNode nodeProcessVersion = nodeParam.SelectSingleNode("ProcessVersion");
                            Version processVersion = new Version(nodeProcessVersion.InnerText);

                            string owner = null;
                            XmlNode nodeOwner = nodeParam.SelectSingleNode("Owner");
                            if (nodeOwner != null)
                                owner = nodeOwner.InnerText;

                            FlowDataSet dataset = BPMProcess.GetFormData(cn, processName, processVersion, owner);
                            foreach (FlowDataTable table in dataset.Tables)
                                this.AppendTo(i, jTables, table, true);
                        }
                        else if (String.Compare(method, "GetFormProcessData", true) == 0)
                        {
                            XmlNode nodePID = nodeParam.SelectSingleNode("PID");
                            string spid = nodePID.InnerText;

                            FlowDataSet dataset = BPMProcess.GetFormData(cn, Int32.Parse(spid));
                            foreach (FlowDataTable table in dataset.Tables)
                                this.AppendTo(i, jTables, table, true);
                        }
                        else if (String.Compare(method, "GetFormReadData", true) == 0)
                        {
                            XmlNode nodeTID = nodeParam.SelectSingleNode("TID");
                            string stid = nodeTID.InnerText;

                            FlowDataSet dataset = BPMProcess.GetFormDataForRead(cn, Int32.Parse(stid));
                            foreach (FlowDataTable table in dataset.Tables)
                                this.AppendTo(i, jTables, table, true);
                        }
                        else if (String.Compare(method, "GetSnapshotData", true) == 0)
                        {
                            XmlNode nodeTID = nodeParam.SelectSingleNode("TID");
                            string stid = nodeTID.InnerText;

                            XmlNode nodeVersion = nodeParam.SelectSingleNode("Version");
                            string sver = nodeVersion.InnerText;

                            string spid = "-1";
                            XmlNode nodePID = nodeParam.SelectSingleNode("PID");
                            if (nodePID != null)
                                spid = nodePID.InnerText;

                            FlowDataSet dataset = cn.GetSnapshotData(Int32.Parse(stid), Int32.Parse(sver), Int32.Parse(spid));
                            foreach (FlowDataTable table in dataset.Tables)
                                this.AppendTo(i, jTables, table, true);
                        }
                        else if (String.Compare(method, "GetDraftData", true) == 0)
                        {
                            XmlNode nodeDraftId = nodeParam.SelectSingleNode("DraftID");
                            string draftId = nodeDraftId.InnerText;
                            Guid draftGuid = new Guid(draftId);

                            FlowDataSet dataset = cn.GetDraftData(draftGuid);
                            foreach (FlowDataTable table in dataset.Tables)
                                this.AppendTo(i, jTables, table, true);
                        }
                        else if (String.Compare(method, "GetFormApplicationData", true) == 0)
                        {
                            XmlNode nodeApplicationName = nodeParam.SelectSingleNode("ApplicationName");
                            string appName = nodeApplicationName.InnerText;

                            string formState = String.Empty;
                            XmlNode nodeFormState = nodeParam.SelectSingleNode("FormState");
                            if (nodeFormState != null)
                                formState = nodeFormState.InnerText;

                            string keyValue = String.Empty;
                            XmlNode nodePrimaryKey = nodeParam.SelectSingleNode("PrimaryKey");
                            if (nodePrimaryKey != null)
                                keyValue = nodePrimaryKey.InnerText;

                            FlowDataSet dataset = FormService.GetFormApplicationData(cn, appName, formState, keyValue);
                            foreach (FlowDataTable table in dataset.Tables)
                                this.AppendTo(i, jTables, table, true);
                        }
                        else
                        {
                            throw new Exception("Invalid method:" + method);
                        }
                    }
                }

                JsonItem rv = new JsonItem();
                rv.Attributes.Add("success", true);
                rv.Attributes.Add("Tables", jTables);

                return rv.ToString();
            }
            catch (Exception e)
            {
                JsonItem rv = new JsonItem();
                rv.Attributes.Add("success", false);
                rv.Attributes.Add("errorMessage", e.Message);
                return rv.ToString();
            }
           
        }
        private void AppendTo(int requestIndex, JsonItemCollection jTables, FlowDataTable table, bool formTable)
        {
            JsonItem jTable = new JsonItem();
            jTables.Add(jTable);

            jTable.Attributes.Add("DataSource", TableIdentityHelper.IsDefaultDataSource(table.DataSourceName) ? "" : table.DataSourceName);
            jTable.Attributes.Add("TableName", table.TableName);
            jTable.Attributes.Add("Index", requestIndex);
            jTable.Attributes.Add("FormTable", formTable);

            if (formTable)
            {
                jTable.Attributes.Add("IsRepeatable", table.IsRepeatableTable);
                jTable.Attributes.Add("AllowAddRecord", table.AllowAddRecord);

                if (!table.IsRepeatableTable)
                {
                    jTable.Attributes.Add("CKeyName", table.CKeyName);
                    jTable.Attributes.Add("CKeyValue", table.CKeyValue);
                }
            }

            JsonItemCollection jColumns = new JsonItemCollection();
            jTable.Attributes.Add("Columns", jColumns);
            foreach (FlowDataColumn column in table.Columns)
            {
                JsonItem jColumn = new JsonItem();
                jColumns.Add(jColumn);

                jColumn.Attributes.Add("ColumnName", column.ColumnName);
                jColumn.Attributes.Add("Type", column.DataType.Name);
                if (formTable)
                {
                    jColumn.Attributes.Add("Length", column.MaxLength);
                    jColumn.Attributes.Add("Readable", column.AllowRead);
                    jColumn.Attributes.Add("Writeable", column.AllowWrite);
                    jColumn.Attributes.Add("AutoIncrement", column.AutoIncrement);
                    jColumn.Attributes.Add("PrimaryKey", column.PrimaryKey);
                    jColumn.Attributes.Add("DefaultValue", column.DefaultValue);
                    jColumn.Attributes.Add("ShowSpoor", column.ShowSpoor);
                }
            }

            JsonItemCollection jRows = new JsonItemCollection();
            jTable.Attributes.Add("Rows", jRows);
            foreach (FlowDataRow row in table.Rows)
            {
                JsonItem jRow = new JsonItem();
                jRows.Add(jRow);

                foreach (string colName in row.Keys)
                    jRow.Attributes.Add(colName, row[colName]);
            }
        }
        protected void WriteSchema(FlowDataTable table, StringBuilder sb)
        {
            sb.AppendLine("<Schema>");

            foreach (FlowDataColumn column in table.Columns)
                WriteColumn(column, sb);

            sb.AppendLine("</Schema>");
        }

        protected void WriteColumn(FlowDataColumn column, StringBuilder sb)
        {
            sb.Append("<");
            sb.Append(column.ColumnName);

            sb.Append(String.Format(" Type=\"{0}\"", column.DataType.Name));

            sb.Append(String.Format(" Length=\"{0}\"", column.MaxLength.ToString()));

            if (!column.AllowRead)
                sb.Append(" Readable=\"false\"");

            if (!column.AllowWrite)
                sb.Append(" Writeable=\"false\"");

            if (column.AutoIncrement)
                sb.Append(" AutoIncrement=\"true\"");

            if (column.PrimaryKey)
                sb.Append(" PrimaryKey=\"true\"");

            if (column.DefaultValue != null)
                sb.Append(" DefaultValue=\"" + this.FormatValue(column.DefaultValue) + "\"");

            sb.Append("/>");
            sb.AppendLine();
        }

        protected void WriteData(FlowDataTable table, StringBuilder sb)
        {
            sb.AppendLine("<Data>");

            foreach (FlowDataRow row in table.Rows)
                WriteRow(table, row, sb);

            sb.AppendLine("</Data>");
        }

        protected void WriteRow(FlowDataTable table, FlowDataRow row, StringBuilder sb)
        {
            sb.AppendLine("<Row>");

            foreach (string colName in row.Keys)
            {
                sb.Append("<");
                sb.Append(colName);
                sb.Append(">");

                sb.Append(this.FormatValue(row[colName]));

                sb.Append("</");
                sb.Append(colName);
                sb.Append(">");

                sb.AppendLine();
            }

            sb.AppendLine("</Row>");
        }

        private string FormatValue(object value)
        {
            string strValue;
            if (value == null)
            {
                strValue = String.Empty;
            }
            else
            {
                if (value is DateTime)
                    strValue = ((DateTime)value).ToString("yyyy-MM-dd HH:mm:ss");
                else if (value is byte[])
                    strValue = Convert.ToBase64String((byte[])value);
                else
                    strValue = value.ToString();
            }

            strValue = HttpUtility.HtmlEncode(strValue);

            return strValue;
        }


        /// <summary>
        /// 我发起的
        /// </summary>
        /// <param name="startRowIndex"></param>
        /// <param name="rows"></param>
        /// <returns></returns>
        public IHttpActionResult GetMyRequest(int startRowIndex, int rows, String search)
        {
            var allList = GetMyRequestList();
            if (search != null && search != "")
            {
                allList = GetMyRequestList(search);
            }
            var taskList = allList
                .OrderByDescending(t=>t.CreateAt)
                .Skip(startRowIndex)
                .Take(rows);
            var mobileProcess = GetMobileProcess();
            var ret = from t in taskList
                      join m in mobileProcess on t.ProcessName equals m.Name
                      select new TaskDto()
                      {
                          DisplayName = m.DisplayName,
                          Icon = m.Icon,
                          CreateAt = t.CreateAt,
                          ViewUndoPage = m.ViewUndoPage,
                          ViewAskPage=m.ViewAskPage,
                          ViewDonePage=m.ViewDonePage,
                          Description = t.Description,
                          ProcessName = t.ProcessName,
                          TaskState =t.TaskState,
                          TaskID = t.TaskID
                      };
            return Json(new { tasks = ret, total = allList.Count });

        }
       
        /// <summary>
        /// 已办的
        /// </summary>
        /// <param name="startRowIndex"></param>
        /// <param name="rows"></param>
        /// <returns></returns>
        public IHttpActionResult GetMyProcessed(int startRowIndex, int rows,String search)
        {
            var allList = GetMyProcessedList();
            if (search != null && search != "")
            {
                allList = GetMyProcessedList(search);
            }
            var taskList = allList
                .OrderByDescending(t => t.CreateAt)
                .Skip(startRowIndex)
                .Take(rows);
            var mobileProcess = GetMobileProcess();
            var ret = from t in taskList
                      join m in mobileProcess on t.ProcessName equals m.Name
                      select new TaskDto()
                      {
                          DisplayName = m.DisplayName,
                          Icon = m.Icon,
                          CreateAt = t.CreateAt,
                          ViewUndoPage = m.ViewUndoPage,
                          ViewAskPage = m.ViewAskPage,
                          ViewDonePage = m.ViewDonePage,
                          Description = t.Description,
                          ProcessName = t.ProcessName,
                          TaskID = t.TaskID
                      };
            return Json(new { tasks = ret, total = allList.Count });

        }
        /// <summary>
        /// 发起 审批 加签 流程
        /// </summary>
        /// <param name=""></param>
        public IHttpActionResult PostProcess([FromBody]string xml )
        {
            ILog log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
            try
            {
                PrepareBPMEnv();
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    byte[] bs = System.Text.Encoding.UTF8.GetBytes(xml);
                    MemoryStream xlmStream = new MemoryStream(bs);
                    PostResult result = BPMProcess.Post(cn, xlmStream);
                    return Json(result);
                }

        } catch (Exception e) {

                log.Error("error:"+e);
            }
            return null;
        }
        /// <summary>
        /// 退回
        /// </summary>
        /// <param name="taskID"></param>
        /// <param name="comments"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult PostRecedeRestart(PostRecedeRestartModel model)
        {
            ILog log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
            try
            {
                PrepareBPMEnv();
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    User result = BPMTask.RecedeRestart(cn, model.taskID, model.comments);
                    return Json(result);
                }
            }
            catch (Exception e)
            {

                log.Error("error:" + e);
            }
            return null;
        }

        /// <summary>
        /// 退回某步
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult PostRecedeBack(PostRecedeBackModel model)
        {
            PrepareBPMEnv();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMStepCollection newSteps= BPMProcStep.RecedeBack(cn, model.stepid, model.toStepIDs, model.comments);
                List<string> to = new List<string>();
                foreach (BPMProcStep step in newSteps)
                    to.Add(String.Format("{0}[{1}]", step.NodeName, YZStringHelper.GetUserFriendlyName(step.RecipientAccount, step.RecipientFullName)));

                JsonItem rv = new JsonItem();
                rv.Attributes.Add("success", true);
                rv.Attributes.Add("tosteps", String.Join(";", to.ToArray()));
                return Json(rv.ToString());
            }
        }

        /// <summary>
        /// 从共享池取出
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult PickupShareTaskExt(PostShareModel model)
        {
            PrepareBPMEnv();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                BPMProcStep.PickupShareStep(cn, model.stepid);

                return Json("ok");
            }
        }

        /// <summary>
        /// 放回共享池
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult PutbackShareTaskExt(PostShareModel model)
        {
            PrepareBPMEnv();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                BPMProcStep.PutbackShareStep(cn, model.stepid);

                return Json("ok");
            }
        }

        /// <summary>
        /// 获取全部可以退回的步骤
        /// </summary>
        /// <param name="stepid"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult GetRecedableToSteps([FromBody]int stepid) {
            PrepareBPMEnv();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMStepCollection steps= BPMProcStep.GetRecedableToSteps(cn, stepid);
                return Json(steps);
            }

               
        }

        /// <summary>
        /// 拒绝
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult PostReject(PostRecedeRestartModel model)
        {
            ILog log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
            PrepareBPMEnv();
            try {
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    BPMTask.Reject(cn, model.taskID, model.comments);
                    return Json("ok");
                }
            } catch (Exception e) {
                log.Error("error:", e);
            }
            return null;

        }

        /// <summary>
        /// 知会
        /// </summary>
        /// <param name="taskID"></param>
        /// <param name="comments"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult PostInform(PostInformModel inform)
        {
            var bpmAccounts = new BPMObjectNameCollection();
            
            
            bpmAccounts.AddRange(inform.accounts);
            PrepareBPMEnv();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                var result = BPMTask.Inform(cn, inform.taskID, bpmAccounts, inform.comments);
                return Json(result);
            }
        }
        /// <summary> 
        /// 获取流程定义 
        /// </summary> 
        /// <param name="path"></param> 
        /// <param name="name"></param> 
        /// <returns></returns> 
        public IHttpActionResult GetProcessDefine(string path, string name)
        {
            PrepareBPMEnv();
            BPMProcess p = null; ;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMProcessCollection processes = new BPMProcessCollection();
                processes = cn.GetProcessList(path, BPMPermision.Execute, true);
                foreach (BPMProcess item in processes)
                {
                    if (item.Name == name)
                    {
                        p = item;
                        break;
                    }
                }
            }
            return Json(p);
        }
        /// <summary>
        /// 上传文件
        /// </summary>
        /// <param name="files"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult UploadFiles()
        {
            HttpFileCollection files;

            ILog log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);


            try
            {


                files = System.Web.HttpContext.Current.Request.Files;
                List<AttachmentInfo> attachments = new List<AttachmentInfo>();

                for (int i = 0; i < files.Count; i++)
                {
                    if (files[i].ContentLength > 0)
                    {
                        HttpPostedFile file = files[i];
                        string fileName = Path.GetFileName(file.FileName);
                        long fileSize = file.ContentLength;
                        string fileExt = Path.GetExtension(fileName).ToLower();
                        string fileId;
                        string savePath;
                        do
                        {
                            fileId = YZAttachmentHelper.GetNewFileID();
                            savePath = AttachmentInfo.FileIDToPath(fileId, YZAttachmentHelper.AttachmentRootPath);
                        } while (File.Exists(savePath));

                        Directory.CreateDirectory(savePath.Substring(0, savePath.LastIndexOf(@"\")));
                        file.SaveAs(savePath);

                        AttachmentInfo attachment = new AttachmentInfo();
                        attachment.FileID = fileId;
                        attachment.Name = fileName;
                        attachment.Ext = fileExt;
                        attachment.Size = fileSize;
                        attachment.LastUpdate = DateTime.Now;
                        attachment.OwnerAccount = User.Identity.Name;
                        attachments.Add(attachment);
                        using (IDbConnection cn = QueryManager.CurrentProvider.OpenConnection())
                        {
                            QueryManager.CurrentProvider.InsertAttachmentInfo(cn, attachment);
                        }
                    }
                }
                return Json(attachments);

            }
            catch (Exception e)
            {
                log.Error("error:", e);
            }
            return null;
           
        }

        /// <summary> 
        /// 获取草稿信息 
        /// </summary> 
        /// <param name="taskID"></param> 
        /// <returns></returns> 
        public IHttpActionResult GetDraftData(Guid draftID)
        {
            PrepareBPMEnv();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                FlowDataSet formdataset = cn.GetDraftData(draftID);
                var tables = formdataset.Tables;
                Dictionary<string, DataTable> dt = new Dictionary<string, DataTable>();

                for (int i = 0; i < tables.Count; i++)
                {
                    dt.Add(tables[i].TableName, tables[i].ToDataTable());
                }

                return Json(new { FormDataSet = dt });
            }
        }
        /// <summary> 
        /// 获取草稿分页 
        /// </summary> 
        /// <returns></returns> 
        public IHttpActionResult GetMyDraft(int startRowIndex, int rows,string search)
        {
            var allList = GetMyDraftsList();
            if (search != null && search != "")
            {
                allList = GetMyDraftsList(search);
            }
            var taskList = allList
            .OrderByDescending(t => t.CreateDate)
            .Skip(startRowIndex)
            .Take(rows);
          //  var mobileProcess = GetMobileProcess();
            var canCreatelist = GetCanCreate();
            var ret = from t in taskList
                      //join m in mobileProcess on t.ProcessName equals m.Name
                      join m in canCreatelist  on t.ProcessName equals m.Name
                      select new DraftDto()
                      {
                          DisplayName = m.DisplayName,
                          Icon = m.Icon,
                          CreateDate = t.CreateDate,
                          ViewPage = m.ViewPage,
                          Description = t.Description,
                          ProcessName = t.ProcessName,
                          DraftGuid = t.DraftGuid,
                          Version=m.Version
                          
                         
                          
                      };
            return Json(new { drafts = ret, total = allList.Count });
        }

        /// <summary> 
        /// 获取我的草稿 
        /// </summary> 
        /// <returns></returns> 
        private BPMDraftCollection GetMyDraftsList()
        {
            PrepareBPMEnv();
            BPMDraftCollection drafts = new BPMDraftCollection();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                var mobileProcess = GetMobileProcess();
                foreach (var p in mobileProcess)
                {
                    int rowcount = 0;
                    var list = cn.GetMyDrafts(
                    DraftType.Draft,
                    p.Path,
                    "ProcessName='" + p.Name + "'",
                    "",
                    0,
                    int.MaxValue,
                    out rowcount);
                    drafts.Append(list);
                }
            }
            return drafts;
        }
        /// <summary>
        /// 根据条件获取到全部满足条件的草稿
        /// </summary>
        /// <param name="search">查询条件</param>
        /// <returns></returns>

        private BPMDraftCollection GetMyDraftsList(string search)
        {
            PrepareBPMEnv();
            BPMDraftCollection drafts = new BPMDraftCollection();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                var mobileProcess = GetMobileProcess();
                foreach (var p in mobileProcess)
                {
                    int rowcount = 0;
                    if (p.DisplayName.IndexOf(search) != -1)
                    {
                        var list = cn.GetMyDrafts(
                        DraftType.Draft,
                        p.Path,
                        "ProcessName='" + p.Name + "'",
                        "",
                        0,
                        int.MaxValue,
                        out rowcount);
                        drafts.Append(list);
                    }
                   
                }
            }
            return drafts;
        }

        /// <summary> 
        /// 获取附件详细信息 
        /// </summary> 
        /// <param name="attachId"></param> 
        /// <returns></returns> 
        [HttpPost]
        public IHttpActionResult GetAttachmentsInfo(PostAttachmentModel pach)
        {
            String[] fileIds = pach.fileIds;
            List<AttachmentInfo> attachments = new List<AttachmentInfo>();
            using (IDbConnection cn = QueryManager.CurrentProvider.OpenConnection())
            {
                var dr = QueryManager.CurrentProvider.GetAttachmentsInfo(cn, fileIds);
                while (dr.Read())//判断数据表中是否含有数据 
                {
                    var attach = new AttachmentInfo()
                    {
                        FileID = dr["FileID"].ToString(),
                        Name = dr["Name"].ToString(),
                        Ext = dr["Ext"].ToString(),
                        Size = long.Parse(dr["Size"].ToString()),
                        LastUpdate = (DateTime)dr["LastUpdate"],
                        OwnerAccount = dr["OwnerAccount"].ToString()

                    };
                    attachments.Add(attach);
                }
            }
            return Json(attachments);

        }

        /// <summary>
        /// 获取BPM用户
        /// </summary>
        /// <returns></returns>
        public IHttpActionResult GetBPMParam()
        {
            PrepareBPMEnv();
           
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                MemberCollection positions = OrgSvr.GetUserPositions(cn, User.Identity.GetUserName());
                string UserFullName = positions[0].FullName;
                var bpmUser = BPM.Client.User.FromAccount(cn, User.Identity.GetUserName());

                return Json(new { Position = positions, BPMUser = bpmUser });
            }
            
        }
        /// <summary>
        /// 获取审批信息
        /// </summary>
        /// <param name="stepID"></param>
        /// <returns></returns>
        public IHttpActionResult GetProcessData(int stepID, int taskID)
        {
            PrepareBPMEnv();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                FlowDataSet formdataset = BPMProcess.GetFormData(cn, stepID);
                var tables=formdataset.Tables;
                
                Dictionary<string, DataTable> dt = new Dictionary<string, DataTable>();

                for(int i=0;i<tables.Count;i++)
                {
                    dt.Add(tables[i].TableName, tables[i].ToDataTable());
                }
                BPM.Client.ProcessInfo processInfo = BPMProcess.GetProcessInfo(cn, stepID);
                var steps = GetBPMStep(taskID);
                return Json(new { FormDataSet = dt, Process = processInfo ,Steps=steps});
                
            }
        }
        /// <summary>
        /// 获取任务信息
        /// </summary>
        /// <param name="taskID"></param>
        /// <returns></returns>
        public IHttpActionResult GetTaskData(int taskID)
        {
            PrepareBPMEnv();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                FlowDataSet formdataset= BPMProcess.GetFormDataForRead(cn, taskID);
                var tables = formdataset.Tables;
                Dictionary<string, DataTable> dt = new Dictionary<string, DataTable>();

                for (int i = 0; i < tables.Count; i++)
                {
                    dt.Add(tables[i].TableName, tables[i].ToDataTable());
                }
                var steps = GetBPMStep(taskID);
                return Json(new { FormDataSet = dt, Steps = steps });
            }
        }
        /// <summary>
        /// 获取审批步骤
        /// </summary>
        /// <param name="taskID"></param>
        /// <returns></returns>
        private List<BPMProcStep> GetBPMStep(int taskID)
        {
            PrepareBPMEnv();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMStepCollection steps = BPMTask.GetAllSteps(cn, taskID);
                var ret=steps.Where(e => e.IsHumanStep)
                    .Where(e => (!string.IsNullOrEmpty(e.OwnerAccount) || e.Share))
                    .ToList();
                return ret;
            }
        }
        /// <summary>
        /// 向BPM发起请求前设置环境
        /// </summary>
        private void PrepareBPMEnv()
        {
            var user_account = User.Identity.GetUserName();
            //user_account = "00000088";
            YZAuthHelper.SetAuthCookie(user_account);
            YZAuthHelper.ClearLogoutFlag();
        }
        /// <summary>
        /// 从Process.xml读取手机端支持的流程列表
        /// </summary>
        /// <returns></returns>
        private List<Process> GetMobileProcess()
        {
            var path = System.Web.Hosting.HostingEnvironment.MapPath("~/Process.xml");
            XElement xe = null;
            try
            {
                xe = XElement.Load(path);
            }
            catch(Exception e)
            {
                System.Diagnostics.Debug.WriteLine(e);
            }
           
            IEnumerable<XElement> elements =xe.Elements("Process");
            List<Process> processList = new List<Process>();
            foreach (var ele in elements)
            {
                Process process = new Process();
                process.Name = ele.Element("Name").Value;
                process.Path = ele.Element("Path").Value;
                process.CanCreate = ele.Element("CanCreate").Value.ToLower().Equals("true");
                process.CreatePage = ele.Element("CreatePage").Value;
                process.ViewUndoPage = ele.Element("ViewUndoPage").Value;
                process.ViewAskPage = ele.Element("ViewAskPage").Value;
                process.ViewDonePage = ele.Element("ViewDonePage").Value;
                process.Css = ele.Element("Css").Value;
                process.DisplayName = ele.Element("DisplayName").Value;
                process.Icon = ele.Element("Icon").Value;
                process.Group = ele.Element("Group").Value;
                process.Description = ele.Element("Description").Value;
                process.ViewPage = ele.Element("ViewPage").Value;
                processList.Add(process);
            }
            return processList;
        }
        /// <summary>
        /// 获取全部待办任务
        /// </summary>
        /// <returns></returns>
        private BPMTaskListCollection GetMyTaskList()
        {
            PrepareBPMEnv();
            BPMTaskListCollection tasks = new BPMTaskListCollection();
            using (BPMConnection cn = new BPMConnection())
            {
               
                cn.WebOpen();
                
                
                var mobileProcess = GetMobileProcess();
                foreach (var p in mobileProcess)
                {
                    int rowcount = 0;
                    var list = cn.GetMyTaskList("ProcessName='" + p.Name + "'", null, 0, int.MaxValue, out rowcount);


                    tasks.Append(list);
                }
                //共享池
                foreach(var p in mobileProcess)
                {
                    int rowcounts = 0;
                    var list = cn.GetShareTaskList("ProcessName='" + p.Name + "'", null, 0, int.MaxValue, out rowcounts);
                    tasks.Append(list);
                }
            }
            return tasks;
        }
        /// <summary>
        /// 根据查询条件获取全部待办任务
        /// </summary>
        /// <param name="search">查询条件</param>
        /// <returns></returns>
        private BPMTaskListCollection GetMyTaskList(String search)
        {
            PrepareBPMEnv();
            BPMTaskListCollection tasks = new BPMTaskListCollection();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                var mobileProcess = GetMobileProcess();
                foreach (var p in mobileProcess)
                {
                    int rowcount = 0;
                    if (p.DisplayName.IndexOf(search)!=-1) {
                        var list = cn.GetMyTaskList("ProcessName='" + p.Name + "'", null, 0, int.MaxValue, out rowcount);
                        tasks.Append(list);
                    }
                   
                }
                //共享池
                foreach (var p in mobileProcess)
                {
                    int rowcounts = 0;
                    if (p.DisplayName.IndexOf(search) != -1)
                    {
                        var list = cn.GetShareTaskList("ProcessName='" + p.Name + "'", null, 0, int.MaxValue, out rowcounts);
                        tasks.Append(list);
                    }
                }
            }
            return tasks;
        }





        /// <summary>
        /// 获取全部我发起的
        /// </summary>
        /// <returns></returns>
        private BPMTaskCollection GetMyRequestList()
        {
            ILog log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
            try
            {
                PrepareBPMEnv();
                BPMTaskCollection tasks = new BPMTaskCollection();
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    var mobileProcess = GetMobileProcess();
                    foreach (var p in mobileProcess)
                    {
                        int rowcount = 0;
                        var list = cn.GetHistoryTasks(
                            HistoryTaskType.MyRequest, p.Path,
                            "ProcessName='" + p.Name + "'",
                            "",
                            "",
                            0,
                            int.MaxValue,
                            out rowcount); 
                        
                        tasks.Append(list);
                    }
                }
                return tasks;
            }catch(Exception e)
            {
                log.Error("error:", e);
                return null;
            }
        }

        /// <summary>
        /// 根据查询条件获取全部我发起的
        /// </summary>
        /// <param name="search">查询条件</param>
        /// <returns></returns>
        private BPMTaskCollection GetMyRequestList(String search)
        {
            PrepareBPMEnv();
            BPMTaskCollection tasks = new BPMTaskCollection();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                var mobileProcess = GetMobileProcess();
                foreach (var p in mobileProcess)
                {
                    int rowcount = 0;
                    if (p.DisplayName.IndexOf(search) != -1) {
                        var list = cn.GetHistoryTasks(
                       HistoryTaskType.MyRequest, p.Path,
                       "ProcessName='" + p.Name + "'",
                       "",
                       "",
                       0,
                       int.MaxValue,
                       out rowcount);
                        tasks.Append(list);
                    }
                   
                }
            }
            return tasks;
        }

        /// <summary>
        /// 获取全部已办的
        /// </summary>
        /// <returns></returns>
        private BPMTaskCollection GetMyProcessedList()
        {
            PrepareBPMEnv();
            BPMTaskCollection tasks = new BPMTaskCollection();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                var mobileProcess = GetMobileProcess();
                foreach (var p in mobileProcess)
                {
                    int rowcount = 0;
                    var list = cn.GetHistoryTasks(
                        HistoryTaskType.MyProcessed, p.Path,
                        "ProcessName='" + p.Name + "'",
                        "",
                        "",
                        0,
                        int.MaxValue,
                        out rowcount);
                    tasks.Append(list);
                }
            }
            return tasks;
        }

        /// <summary>
        /// 根据查询条件获取全部已办的
        /// </summary>
        /// <param name="search">查询条件</param>
        /// <returns></returns>
        private BPMTaskCollection GetMyProcessedList(String search)
        {
            PrepareBPMEnv();
            BPMTaskCollection tasks = new BPMTaskCollection();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                var mobileProcess = GetMobileProcess();
                foreach (var p in mobileProcess)
                {
                    int rowcount = 0;
                    if (p.DisplayName.IndexOf(search) != -1) {
                        var list = cn.GetHistoryTasks(
                        HistoryTaskType.MyProcessed, p.Path,
                        "ProcessName='" + p.Name + "'",
                        "",
                        "",
                        0,
                        int.MaxValue,
                        out rowcount);
                        tasks.Append(list);
                    }
                    
                }
            }
            return tasks;
        }
    }

    

   
    /// <summary>
    /// 流程Model,从Process.xml读入 
    /// </summary>
    public class Process
    {
        public string Path { get; set; }
        public string Name { get; set; }
        public bool CanCreate { get; set; }
        public string CreatePage { get; set; }
        public string ViewUndoPage { get; set; }

        public string ViewAskPage { get; set; }

        public string ViewDonePage { get; set; }
        public string Css { get; set; }
        public string DisplayName { get; set; }
        public string Icon { get; set; }
        public string Group { get; set; }

        public string Description { get; set; }
        public string Version { get; set; }

        public string ViewPage { get; set; }
    }
    public class TaskDto
    {
        public string Icon { get; set; }
        public string ViewUndoPage { get; set; }

        public string ViewAskPage { get; set; }
        public string ViewDonePage { get; set; }
        public string DisplayName { get; set; }
        public DateTime CreateAt { get; set; }
        public DateTime ReceiveAt { get; set; }
        public string Description { get; set; }
        public int TaskID { get; set; }
        public int StepID { get; set; }
        public string StepName { get; set; }
        public string ProcessName { get; set; }

        public TaskState TaskState { get; set; }

        
    }
    public class DraftDto
    {
        public string Icon { get; set; }
        public string ViewPage { get; set; }
        public string DisplayName { get; set; }
        public DateTime CreateDate { get; set; }
        public string Description { get; set; }
        public Guid DraftGuid { get; set; }
        public string ProcessName { get; set; }
        public string Version { get; set; }


    }

    public class PostAccountInput
    {
        public string[] ids { get; set; }
    }
    public class YZDSFilter
    {
        public object value { get; set; }
        public bool afterBind { get; set; }
        public string op { get; set; }
    }

}
