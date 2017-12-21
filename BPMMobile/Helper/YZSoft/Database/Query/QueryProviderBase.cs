using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Drawing;
using BPM;
using BPM.Client;

/// <summary>
/// QueryProvider 的摘要说明


/// </summary>
public abstract class QueryProviderBase
{
    HttpContext _context = null;

    public QueryProviderBase(HttpContext context)
    {
        this._context = context;
    }

    #region 公共属性

    public HttpContext Context
    {
        get
        {
            return this._context;
        }
    }

    #endregion

    #region 私有方法

    protected string GetParam(string paramName)
    {
        return GetParam(paramName, null);
    }

    protected string GetParam(string paramName, string defaultValue)
    {
        string value = this.Context.Request.Params[paramName];
        if (value != null)
            value = value.Trim();

        if (value == null)
            return defaultValue;

        return value;
    }

    public virtual string GetSortString(string defaultSort, Dictionary<string,string> map,string extsort)
    {
        string sort = this.Context.Request.Params["sort"];
        string dir = this.Context.Request.Params["dir"];

        //获得Order String
        if (String.IsNullOrEmpty(sort))
            return defaultSort;

        if (String.Compare(dir, "ASC", true) != 0)
            dir = "DESC";

        if (map != null)
        {
            string sortmaped;
            if (map.TryGetValue(sort, out sortmaped))
                sort = sortmaped;
        }

        return (sort + " " + dir) + (String.IsNullOrEmpty(extsort) ? "" : "," + extsort);
    }

    public virtual string GetSortString(string defaultSort)
    {
        return this.GetSortString(defaultSort, null,null);
    }

    public virtual string EncodeText(string str)
    {
        if (String.IsNullOrEmpty(str))
            return str;

        return str.Replace("'", "''");
    }

    protected virtual string CombinCond(bool and, params string[] conds)
    {
        string rv = String.Empty;

        if (conds.Length == 0)
            return rv;

        foreach (string cond in conds)
        {
            if (String.IsNullOrEmpty(cond))
                continue;

            if (String.IsNullOrEmpty(rv))
                rv = cond;
            else
                rv = "(" + rv + (and ? ") AND (" : ") OR (") + cond + ")";
        }

        return rv;
    }

    public virtual string CombinCond(params string[] conds)
    {
        return CombinCond(true, conds);
    }

    public virtual string CombinCondOR(params string[] conds)
    {
        return CombinCond(false, conds);
    }

    public virtual string GenPeriodCond(string fieldName, DateTime date1, DateTime date2)
    {
        return String.Format("({0}>='{1}' AND {0}<'{2}')",
            fieldName,
            YZStringHelper.DateToStringL(date1),
            YZStringHelper.DateToStringL(date2));
    }

    #endregion

    #region 接口实现 - Sort

    public virtual string SortStringDraftGrid
    {
        get
        {
            return GetSortString("CreateDate DESC");
        }
    }

    public virtual string SortStringHistoryTaskMyPosted
    {
        get
        {
            return GetSortString("TaskID DESC",null,"TaskID DESC");
        }
    }

    public virtual string SortStringMyTask
    {
        get
        {
            return GetSortString("StepID DESC", null, "StepID DESC");
        }
    }

    public virtual string SortStringOnlineUsers
    {
        get
        {
            return GetSortString("LastActiveDate DESC");
        }
    }

    public virtual string SortStringSystemUsers
    {
        get
        {
            return GetSortString("LastActiveDate DESC");
        }
    }

    public virtual string SortStringAppLog
    {
        get
        {
            return GetSortString("LogDate DESC");
        }
    }

    #endregion

    #region 接口实现 - Filter

    public virtual string FilterStringHistoryTaskTaskTableFilter
    {
        get
        {
            string filter = null;

            string searchType = this.GetParam("SearchType");
            string keyword = this.GetParam("Keyword");

            string serialNumLike = null;
            string processNameLike = null;
            string ownerAccountLike = null;
            string agentAccountLike = null;
            string descriptionLike = null;
            string taskidEqu = null;
            if (!String.IsNullOrEmpty(keyword))
            {
                serialNumLike = String.Format("SerialNum LIKE(N'%{0}%')", this.EncodeText(keyword));
                processNameLike = String.Format("ProcessName LIKE(N'%{0}%')", this.EncodeText(keyword));
                ownerAccountLike = String.Format("OwnerAccount LIKE(N'%{0}%')", this.EncodeText(keyword));
                agentAccountLike = String.Format("AgentAccount LIKE(N'%{0}%')", this.EncodeText(keyword));
                descriptionLike = String.Format("Description LIKE(N'%{0}%')", this.EncodeText(keyword));
                if (YZStringHelper.IsNumber(keyword))
                    taskidEqu = String.Format("TaskID={0}", keyword);
            }

            string specProcessName = this.GetParam("SpecProcessName");
            if (!String.IsNullOrEmpty(specProcessName))
            {
                string[] processNames = specProcessName.Split(',');
                string processNameFilter = null;
                foreach (string processName in processNames)
                {
                    if (String.IsNullOrEmpty(processName))
                        continue;
                    
                    processNameFilter = this.CombinCondOR(processNameFilter, String.Format("ProcessName=N'{0}'", this.EncodeText(processName)));
                }

                filter = this.CombinCond(filter, processNameFilter);
            }

            if (YZStringHelper.EquName(searchType, "AdvancedSearch"))
            {
                string processName = this.GetParam("ProcessName");
                string postUserAccount = this.GetParam("PostUserAccount");
                string periodType = this.GetParam("PostDateType").ToLower();
                string periodDate1 = this.GetParam("PostDate1");
                string periodDate2 = this.GetParam("PostDate2");
                string taskStatus = this.GetParam("TaskStatus");
                string taskId = this.GetParam("TaskID");
                string serialNum = this.GetParam("SerialNum");

                string keywordFilter = null;

                if (String.IsNullOrEmpty(specProcessName))
                {
                    if (!String.IsNullOrEmpty(processName))
                        filter = this.CombinCond(filter, String.Format("ProcessName=N'{0}'", this.EncodeText(processName)));
                    else
                        keywordFilter = this.CombinCondOR(keywordFilter, processNameLike);
                }

                if (!String.IsNullOrEmpty(postUserAccount))
                {
                    filter = this.CombinCond(filter, String.Format("OwnerAccount=N'{0}' OR AgentAccount=N'{0}'", this.EncodeText(postUserAccount)));
                }
                else
                {
                    keywordFilter = this.CombinCondOR(keywordFilter, ownerAccountLike);
                    keywordFilter = this.CombinCondOR(keywordFilter, agentAccountLike);
                }

                DateTime date1 = DateTime.MinValue;
                DateTime date2 = DateTime.MaxValue;
                if (periodType != "all")
                {
                    DateTime.TryParse(periodDate1, out date1);
                    DateTime.TryParse(periodDate2, out date2);
                }

                if (date1 != DateTime.MinValue)
                    filter = this.CombinCond(filter, this.GenPeriodCond("CreateAt", date1, date2));

                if (!String.IsNullOrEmpty(taskStatus) && !YZStringHelper.EquName(taskStatus, "all"))
                    filter = this.CombinCond(filter, String.Format("State=N'{0}'", taskStatus));

                if (!String.IsNullOrEmpty(taskId) && YZStringHelper.IsNumber(taskId))
                    filter = this.CombinCond(filter, String.Format("TaskID={0}", taskId));
                else
                    keywordFilter = this.CombinCondOR(keywordFilter, taskidEqu);

                if (!String.IsNullOrEmpty(serialNum))
                    filter = this.CombinCond(filter, String.Format("SerialNum LIKE(N'{0}%')", this.EncodeText(serialNum)));
                else
                    keywordFilter = this.CombinCondOR(keywordFilter, serialNumLike);

                keywordFilter = this.CombinCondOR(keywordFilter, descriptionLike);

                filter = this.CombinCond(filter, keywordFilter);
            }

            if (YZStringHelper.EquName(searchType, "QuickSearch"))
            {
                string processName = this.GetParam("ProcessName");
                string keywordFilter = null;

                if (String.IsNullOrEmpty(specProcessName))
                {
                    if (!String.IsNullOrEmpty(processName))
                        filter = this.CombinCond(filter, String.Format("ProcessName=N'{0}'", this.EncodeText(processName)));
                    else
                        keywordFilter = this.CombinCondOR(keywordFilter, processNameLike);
                }

                keywordFilter = this.CombinCondOR(keywordFilter, taskidEqu);
                keywordFilter = this.CombinCondOR(keywordFilter, serialNumLike);
                keywordFilter = this.CombinCondOR(keywordFilter, ownerAccountLike);
                keywordFilter = this.CombinCondOR(keywordFilter, agentAccountLike);
                keywordFilter = this.CombinCondOR(keywordFilter, descriptionLike);
                filter = this.CombinCond(filter, keywordFilter);
            }

            return filter;
        }
    }

    public virtual string FilterStringHistoryTaskStepTableFilter
    {
        get
        {
            string filter = null;
            string searchType = this.GetParam("SearchType");

            if (YZStringHelper.EquName(searchType, "AdvancedSearch"))
            {
                string taskStatus = this.GetParam("TaskStatus");

                if (YZStringHelper.EquName(taskStatus, TaskState.Running.ToString()))
                {
                    string recipientUserAccount = this.GetParam("RecipientUserAccount");
                    if (!String.IsNullOrEmpty(recipientUserAccount))
                        filter = this.CombinCond(filter, String.Format("(FinishAt IS NULL AND (OwnerAccount=N'{0}' OR AgentAccount=N'{0}'))", this.EncodeText(recipientUserAccount)));
                }
            }

            return filter;
        }
    }

    public virtual string FilterStringMyTask
    {
        get
        {
            string filter = null;

            string searchType = this.GetParam("SearchType");
            string keyword = this.GetParam("Keyword");

            string serialNumLike = null;
            string processNameLike = null;
            string ownerAccountLike = null;
            string agentAccountLike = null;
            string stepNameLike = null;
            string descriptionLike = null;
            string taskidEqu = null;

            string specProcessName = this.GetParam("SpecProcessName");
            if (!String.IsNullOrEmpty(specProcessName))
            {
                string[] processNames = specProcessName.Split(',');
                string processNameFilter = null;
                foreach (string processName in processNames)
                {
                    if (String.IsNullOrEmpty(processName))
                        continue;

                    processNameFilter = this.CombinCondOR(processNameFilter, String.Format("ProcessName=N'{0}'", this.EncodeText(processName)));
                }

                filter = this.CombinCond(filter, processNameFilter);
            }

            if (!String.IsNullOrEmpty(keyword))
            {
                serialNumLike = String.Format("SerialNum LIKE(N'%{0}%')", this.EncodeText(keyword));
                processNameLike = String.Format("ProcessName LIKE(N'%{0}%')", this.EncodeText(keyword));
                ownerAccountLike = String.Format("OwnerAccount LIKE(N'%{0}%')", this.EncodeText(keyword));
                agentAccountLike = String.Format("AgentAccount LIKE(N'%{0}%')", this.EncodeText(keyword));
                stepNameLike = String.Format("NodeName LIKE(N'%{0}%')", this.EncodeText(keyword));
                descriptionLike = String.Format("Description LIKE(N'%{0}%')", this.EncodeText(keyword));
                if (YZStringHelper.IsNumber(keyword))
                    taskidEqu = String.Format("TaskID={0}", keyword);
            }

            if (YZStringHelper.EquName(searchType, "AdvancedSearch"))
            {
                string processName = this.GetParam("ProcessName");
                string postUserAccount = this.GetParam("PostUserAccount");
                string periodType = this.GetParam("PostDateType").ToLower();
                string periodDate1 = this.GetParam("PostDate1");
                string periodDate2 = this.GetParam("PostDate2");
                string taskId = this.GetParam("TaskID");
                string serialNum = this.GetParam("SerialNum");

                string keywordFilter = null;

                if (!String.IsNullOrEmpty(processName))
                    filter = this.CombinCond(filter, String.Format("ProcessName=N'{0}'", this.EncodeText(processName)));
                else
                    keywordFilter = this.CombinCondOR(keywordFilter, processNameLike);

                if (!String.IsNullOrEmpty(postUserAccount))
                {
                    filter = this.CombinCond(filter, String.Format("OwnerAccount=N'{0}' OR AgentAccount=N'{0}'", this.EncodeText(postUserAccount)));
                }
                else
                {
                    keywordFilter = this.CombinCondOR(keywordFilter, ownerAccountLike);
                    keywordFilter = this.CombinCondOR(keywordFilter, agentAccountLike);
                }

                DateTime date1 = DateTime.MinValue;
                DateTime date2 = DateTime.MaxValue;
                if (periodType != "all")
                {
                    DateTime.TryParse(periodDate1, out date1);
                    DateTime.TryParse(periodDate2, out date2);
                }

                if (date1 != DateTime.MinValue)
                    filter = this.CombinCond(filter, this.GenPeriodCond("CreateAt", date1, date2));

                if (!String.IsNullOrEmpty(taskId) && YZStringHelper.IsNumber(taskId))
                    filter = this.CombinCond(filter, String.Format("TaskID={0}", taskId));
                else
                    keywordFilter = this.CombinCondOR(keywordFilter, taskidEqu);

                if (!String.IsNullOrEmpty(serialNum))
                    filter = this.CombinCond(filter, String.Format("SerialNum LIKE(N'{0}%')", this.EncodeText(serialNum)));
                else
                    keywordFilter = this.CombinCondOR(keywordFilter, serialNumLike);

                keywordFilter = this.CombinCondOR(keywordFilter, stepNameLike);
                keywordFilter = this.CombinCondOR(keywordFilter, descriptionLike);

                filter = this.CombinCond(filter, keywordFilter);
            }

            if (YZStringHelper.EquName(searchType, "QuickSearch"))
            {
                string processName = this.GetParam("ProcessName");
                string keywordFilter = null;

                if (!String.IsNullOrEmpty(processName))
                    filter = this.CombinCond(filter, String.Format("ProcessName=N'{0}'", this.EncodeText(processName)));
                else
                    keywordFilter = this.CombinCondOR(keywordFilter, processNameLike);

                keywordFilter = this.CombinCondOR(keywordFilter, taskidEqu);
                keywordFilter = this.CombinCondOR(keywordFilter, serialNumLike);
                keywordFilter = this.CombinCondOR(keywordFilter, ownerAccountLike);
                keywordFilter = this.CombinCondOR(keywordFilter, agentAccountLike);
                keywordFilter = this.CombinCondOR(keywordFilter, stepNameLike);
                keywordFilter = this.CombinCondOR(keywordFilter, descriptionLike);
                filter = this.CombinCond(filter, keywordFilter);
            }

            return filter;
        }
    }

    public virtual string FilterStringSystemUsers
    {
        get
        {
            string filter = null;

            string searchType = this.GetParam("SearchType");
            string keyword = this.GetParam("Keyword");

            string accountLike = null;
            string displayNameLike = null;
            string officePhoneLike = null;
            string emailLike = null;
            string hridLike = null;

            if (!String.IsNullOrEmpty(keyword))
            {
                accountLike = String.Format("Account LIKE('%{0}%')", this.EncodeText(keyword));
                displayNameLike = String.Format("DisplayName LIKE('%{0}%')", this.EncodeText(keyword));
                officePhoneLike = String.Format("OfficePhone LIKE('%{0}%')", this.EncodeText(keyword));
                emailLike = String.Format("EMail LIKE('%{0}%')", this.EncodeText(keyword));
                hridLike = String.Format("HRID LIKE('%{0}%')", this.EncodeText(keyword));
            }

            if (YZStringHelper.EquName(searchType, "AdvancedSearch"))
            {
            }
            else
            {
                filter = this.CombinCondOR(filter, accountLike);
                filter = this.CombinCondOR(filter, displayNameLike);
                filter = this.CombinCondOR(filter, officePhoneLike);
                filter = this.CombinCondOR(filter, emailLike);
                filter = this.CombinCondOR(filter, hridLike);
            }

            return filter;
        }
    }

    public virtual string FilterStringAppLog
    {
        get
        {
            string filter = null;

            string searchType = this.GetParam("SearchType");
            string keyword = this.GetParam("Keyword");

            string clienIPLike = null;
            string accountLike = null;
            string actionLike = null;
            string actParam1Like = null;
            string actParam2Like = null;
            string errLike = null;

            if (!String.IsNullOrEmpty(keyword))
            {
                clienIPLike = String.Format("ClientIP LIKE(N'%{0}%')", this.EncodeText(keyword));
                accountLike = String.Format("UserAccount LIKE(N'%{0}%')", this.EncodeText(keyword));
                actionLike = String.Format("Action LIKE(N'%{0}%')", this.EncodeText(keyword));
                actParam1Like = String.Format("ActParam1 LIKE(N'%{0}%')", this.EncodeText(keyword));
                actParam2Like = String.Format("ActParam2 LIKE(N'%{0}%')", this.EncodeText(keyword));
                errLike = String.Format("Error LIKE(N'%{0}%')", this.EncodeText(keyword));
            }

            if (YZStringHelper.EquName(searchType, "AdvancedSearch"))
            {
                string account = this.GetParam("Account");
                string action = this.GetParam("Action");
                string result = this.GetParam("Result");
                string clientIP = this.GetParam("ClientIP");

                string keywordFilter = null;

                if (!String.IsNullOrEmpty(account))
                    filter = this.CombinCond(filter, String.Format("UserAccount=N'{0}'", this.EncodeText(account)));
                else
                    keywordFilter = this.CombinCondOR(keywordFilter, accountLike);

                if (action!="all")
                    filter = this.CombinCond(filter, String.Format("Action=N'{0}'", this.EncodeText(action)));
                else
                    keywordFilter = this.CombinCondOR(keywordFilter, actionLike);

                if (result == "Success")
                    filter = this.CombinCond(filter, "Succeed=1");
                if (result == "Failed")
                    filter = this.CombinCond(filter, "Succeed=0");

                if (!String.IsNullOrEmpty(clientIP))
                    filter = this.CombinCond(filter, String.Format("ClientIP=N'{0}'", this.EncodeText(clientIP)));
                else
                    keywordFilter = this.CombinCondOR(keywordFilter, clienIPLike);

                if (!String.IsNullOrEmpty(keyword))
                {
                    keywordFilter = this.CombinCondOR(keywordFilter, actParam1Like);
                    keywordFilter = this.CombinCondOR(keywordFilter, actParam2Like);
                    keywordFilter = this.CombinCondOR(keywordFilter, errLike);
                }

                filter = this.CombinCond(filter, keywordFilter);
            }

            if (YZStringHelper.EquName(searchType, "QuickSearch"))
            {
                filter = this.CombinCondOR(filter, clienIPLike);
                filter = this.CombinCondOR(filter, accountLike);
                filter = this.CombinCondOR(filter, actionLike);
                filter = this.CombinCondOR(filter, actParam1Like);
                filter = this.CombinCondOR(filter, actParam2Like);
                filter = this.CombinCondOR(filter, errLike);
            }

            return filter;
        }
    }

    #endregion
}
