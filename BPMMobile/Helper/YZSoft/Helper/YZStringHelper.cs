using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Collections.Generic;
using System.Text;
using BPM;
using BPM.Client;
using BPM.Client.Data.Common;

/// <summary>
/// StringHelper 的摘要说明

/// </summary>
public class YZStringHelper
{
    static System.Globalization.CultureInfo datetimeCultureInfo= new System.Globalization.CultureInfo(1033);

    public static bool EquName(string str1,string str2)
    {
        if (String.Compare(str1, str2, true) == 0)
            return true;
        else
            return false;
    }

    public static string DateToString(DateTime date)
    {
        return YZStringHelper.DateToString(date, null);
    }

    public static string DateToString(DateTime date, string nullString)
    {
        if (date == DateTime.MinValue)
            return nullString;
        else
            return date.ToString("yyyy-MM-dd", YZStringHelper.datetimeCultureInfo);
    }

    public static string DateToStringH(DateTime date)
    {
        return YZStringHelper.DateToStringH(date, null);
    }

    public static string DateToStringH(DateTime date, string nullString)
    {
        if (date == DateTime.MinValue)
            return nullString;
        else
            return date.ToString("yyyy-MM-dd HH", YZStringHelper.datetimeCultureInfo);
    }

    public static string DateToStringM(DateTime date)
    {
        return YZStringHelper.DateToStringM(date, null);
    }

    public static string DateToStringM(DateTime date, string nullString)
    {
        if (date == DateTime.MinValue)
            return nullString;
        else
            return date.ToString("yyyy-MM-dd HH:mm", YZStringHelper.datetimeCultureInfo);
    }

    public static string DateToStringL(DateTime date)
    {
        return YZStringHelper.DateToStringL(date, null);
    }

    public static string DateToStringL(DateTime date,string nullString)
    {
        if (date == DateTime.MinValue)
            return nullString;
        else
            return date.ToString("yyyy-MM-dd HH:mm:ss", YZStringHelper.datetimeCultureInfo);
    }


    public static string DateToStringHM(DateTime date, string nullString)
    {
        if (date == DateTime.MinValue)
            return nullString;
        else
            return date.ToString("HH:mm", YZStringHelper.datetimeCultureInfo);
    }

    public static string DateToStringHM(DateTime date)
    {
        return DateToStringHM(date, "");
    }

    public static DateTime StringToDate(string date)
    {
        DateTime rv;
        if (String.IsNullOrEmpty(date))
            rv = DateTime.MinValue;
        else
            rv = DateTime.Parse(date, YZStringHelper.datetimeCultureInfo);

        return rv;
    }

    public static DateTime StringToDate(string date,string time)
    {
        if (String.IsNullOrEmpty(time))
            time = "00:00";

        DateTime rv = YZStringHelper.StringToDate(date);
        rv = DateTime.Parse(YZStringHelper.DateToString(rv) + " " + time, YZStringHelper.datetimeCultureInfo);
        return rv;
    }

    public static string MinutesToStringDHM(int minutes)
    {
        return YZStringHelper.MinutesToStringDHM(minutes,24);
    }

    public static string MinutesToStringDHM(int minutes,int dayhours)
    {
        if (minutes == -1)
            return Resources.YZStrings.All_HandlingTime_NoCal;

        if (minutes == 0)
            return Resources.YZStrings.All_HandlingTime_LTOneM;

        int totalhours = minutes / 60;
        minutes = minutes % 60;
        int days = totalhours / dayhours;
        int hours = totalhours % dayhours;

        List<string> ar = new List<string>();
        if (days >= 1)
            ar.Add(days.ToString() + Resources.YZStrings.All_HandlingTime_UnitDay);

        if (ar.Count != 0)
            ar.Add(hours.ToString("00") + Resources.YZStrings.All_HandlingTime_UnitH);
        else if(hours >= 1)
            ar.Add(hours.ToString() + Resources.YZStrings.All_HandlingTime_UnitH);

        if (ar.Count != 0)
            ar.Add(minutes.ToString("00") + Resources.YZStrings.All_HandlingTime_UnitM);
        else
            ar.Add(minutes.ToString() + Resources.YZStrings.All_HandlingTime_UnitM);

        return String.Join(null,ar.ToArray());
    }

    public static bool IsNumber(string strVar)
    {
        int count = strVar.Length;
        for (int i = 0; i < count; i++)
        {
            char ch = strVar[i];
            if (ch < '0' || ch > '9')
                return false;
        }

        return true;
    }

    public static int[] StringToIntArray(string str)
    {
        string[] strids = str.Split(',');

        List<int> idarray = new List<int>();
        foreach (string strid in strids)
        {
            if (String.IsNullOrEmpty(strid))
                continue;

            int id;
            if (Int32.TryParse(strid, out id))
                idarray.Add(id);
        }

        return idarray.ToArray();
    }

    public static string GetSelActionDisplayString(BPMProcStep step)
    {
        if (!step.Finished)
            return Resources.YZStrings.All_Running;

        if (YZStringHelper.EquName(step.SelAction, SystemAction.Abort))
            return Resources.YZStrings.Aspx_SysAct_Abort;

        if (YZStringHelper.EquName(step.SelAction, SystemAction.RecedeBack))
            return Resources.YZStrings.Aspx_SysAct_RecedeBack;

        if (YZStringHelper.EquName(step.SelAction, SystemAction.AssignOwner))
            return Resources.YZStrings.Aspx_SysAct_AssignOwner;

        if (YZStringHelper.EquName(step.SelAction, SystemAction.Continue))
            return Resources.YZStrings.Aspx_SysAct_Continue;

        if (YZStringHelper.EquName(step.SelAction, SystemAction.Delete))
            return Resources.YZStrings.Aspx_SysAct_Delete;

        if (YZStringHelper.EquName(step.SelAction, SystemAction.Jump))
            return Resources.YZStrings.Aspx_SysAct_Jump + "(" + step.Memo + ")";

        if (YZStringHelper.EquName(step.SelAction, SystemAction.TimeoutJump))
            return Resources.YZStrings.Aspx_SysAct_TimeoutJump + "(" + step.Memo + ")";

        if (YZStringHelper.EquName(step.SelAction, SystemAction.PickBackRestart))
            return "重新取回";// Resources.YZStrings.Aspx_SysAct_PickbackRestart;

        if (YZStringHelper.EquName(step.SelAction, SystemAction.PickBack))
            return "取回";// Resources.YZStrings.Aspx_SysAct_Pickback;

        if (YZStringHelper.EquName(step.SelAction, SystemAction.RecedeRestart))
            return Resources.YZStrings.Aspx_SysAct_RecedeRestart;

        if (YZStringHelper.EquName(step.SelAction, SystemAction.Reject))
            return Resources.YZStrings.Aspx_SysAct_Reject;

        if (YZStringHelper.EquName(step.SelAction, SystemAction.Transfer))
            return Resources.YZStrings.Aspx_SysAct_Agent;

        if (YZStringHelper.EquName(step.SelAction, SystemAction.DirectSend))
            return Resources.YZStrings.Aspx_SysAct_DirectSend;

        if (YZStringHelper.EquName(step.SelAction, SystemAction.InviteIndicate))
            return Resources.YZStrings.Aspx_SysAct_InviteIndicate;

        if (!step.AutoProcess)
            return step.SelAction;
        else
            return step.SelAction + "(" + Resources.YZStrings.Aspx_Auto + ")";
    }

    public static string GetTaskStateDisplayName(TaskState state)
    {
        switch (state)
        {
            case TaskState.Running:
                return Resources.YZStrings.All_Running;
            case TaskState.Approved:
                return Resources.YZStrings.All_Approved;
            case TaskState.Rejected:
                return Resources.YZStrings.All_Rejected;
            case TaskState.Aborted:
                return Resources.YZStrings.All_Aborted;
            case TaskState.Deleted:
                return Resources.YZStrings.All_Deleted;
            default:
                return Resources.YZStrings.All_UnknownStatus;
        }
    }

    public static string GetTaskProcessingStatus(BPMConnection cn, TaskState state, int taskid)
    {
        if (state != TaskState.Running)
            return null;
        else
            return GetTaskStateDisplayString(cn, state, taskid);
    }

    public static string GetTaskStateDisplayString(BPMConnection cn, TaskState state, int taskid)
    {
        if (state != TaskState.Running)
            return YZStringHelper.GetTaskStateDisplayName(state);

        Dictionary<string, BPMObjectNameCollection> results = new Dictionary<string, BPMObjectNameCollection>();
        BPMStepCollection steps = BPMTask.GetInProcessSteps(cn, taskid);

        foreach (BPMProcStep step in steps)
        {
            string stepName = step.StepDisplayName;
            if(step.Share && String.IsNullOrEmpty(step.RecipientAccount))
                stepName = stepName + "(等待获取)";

            BPMObjectNameCollection users = null;
            if (results.ContainsKey(stepName))
            {
                users = results[stepName];
            }
            else
            {
                users = new BPMObjectNameCollection();
                results.Add(stepName, users);
            }

            string userName = YZStringHelper.GetUserShortName(step.RecipientAccount,step.RecipientFullName);

            if (!String.IsNullOrEmpty(userName) && !users.Contains(userName))
                users.Add(userName);
        }

        List<string> rvs = new List<string>();
        foreach (KeyValuePair<string, BPMObjectNameCollection> kv in results)
        {
            string users = String.Join(",",kv.Value.ToArray());
            if (String.IsNullOrEmpty(users))
                rvs.Add(kv.Key);
            else
                rvs.Add(String.Format("{0}:{1}",kv.Key,users));
        }

        return String.Join(";",rvs.ToArray());
    }

    public static string GetPostResultDisplayStringShort(PostResult postResult)
    {
        //获得处理结果
        string message;

        string customMessage = postResult.CustomMessage;
        if (!String.IsNullOrEmpty(customMessage))
            customMessage = "[" + customMessage + "]";

        switch (postResult.PostResultType)
        {
            case PostResultType.HasSentToOtherUsers:
                message = String.Format(Resources.YZStrings.Aspx_PostResult_HasSentToOtherUsers1, YZStringHelper.GetUserNameListString(postResult.Recipients), customMessage);
                break;
            case PostResultType.InWaitingOtherUsers:
                message = String.Format(Resources.YZStrings.Aspx_PostResult_InWaitingOtherUsers1, YZStringHelper.GetUserNameListString(postResult.Recipients), customMessage);
                break;
            case PostResultType.TaskInWaiting:
                message = String.Format(Resources.YZStrings.Aspx_PostResult_TaskInWaiting1, customMessage);
                break;
            case PostResultType.TaskFinishedApproved:
                message = String.Format(Resources.YZStrings.Aspx_PostResult_TaskFinishedApproved1, customMessage);
                break;
            case PostResultType.TaskFinishedRejected:
                message = String.Format(Resources.YZStrings.Aspx_PostResult_TaskFinishedRejected1, customMessage);
                break;
            case PostResultType.RecedeRestarted:
                message = String.Format(Resources.YZStrings.Aspx_PostResult_RecedeRestarted1, YZStringHelper.GetUserNameListString(postResult.Recipients), customMessage);
                break;
            default:
                message = String.Empty;
                break;
        }

        return message;
    }

    public static string GetKeyWordString(QueryParameterCollection peramaterDefines, BPMDBParameterCollection currentParamaters)
    {
        StringBuilder sb = new StringBuilder();
        foreach (BPMDBParameter parameter in currentParamaters)
        {
            QueryParameter queryParameter = peramaterDefines.TryGetItem(parameter.Name);
            if (queryParameter == null)
                continue;

            if (queryParameter.ParameterUIBindType != BPM.Data.Common.ParameterUIBindType.Normal)
                continue;

            if (parameter.Value == null)
                continue;

            string keyword = parameter.Value.ToString().Trim();
            if (String.IsNullOrEmpty(keyword))
                continue;

            if (sb.Length != 0)
                sb.Append(";");

            sb.Append(keyword);
        }

        return sb.ToString();
    }

    public static string GetUserFriendlyName(string account, string displayName)
    {
        if (String.IsNullOrEmpty(account)) //共享任务，Account可能为空
            return "";

        if (String.IsNullOrEmpty(displayName))
            return account;
        else
            return displayName + "(" + account + ")";
    }

    public static string GetUserShortName(string account, string displayName)
    {
        if (String.IsNullOrEmpty(displayName))
            return account;
        else
            return displayName;
    }

    public static string GetRecpientDisplayName(StepRecipient recp)
    {
        if (recp.Agent == null)
            return YZStringHelper.GetUserFriendlyName(recp.Owner.Account, recp.Owner.DisplayName);
        else
            return String.Format(Resources.YZStrings.Aspx_RecpDspFmt, YZStringHelper.GetUserFriendlyName(recp.Agent.Account, recp.Agent.DisplayName),
                YZStringHelper.GetUserShortName(recp.Owner.Account, recp.Owner.DisplayName));
    }

    public static string GetUserNameListString(UserCollection users)
    {
        BPMObjectNameCollection names = new BPMObjectNameCollection();
        foreach(User user in users)
            names.Add(YZStringHelper.GetUserFriendlyName(user.Account,user.DisplayName));

        return names.ToStringList(';');
    }

    public static string GetUserShortNameListString(UserCollection users)
    {
        BPMObjectNameCollection names = new BPMObjectNameCollection();
        foreach (User user in users)
            names.Add(YZStringHelper.GetUserShortName(user.Account, user.DisplayName));

        return names.ToStringList(';');
    }

    public static string GetUserNameListString(StepRecipientCollection recps)
    {
        BPMObjectNameCollection names = new BPMObjectNameCollection();
        foreach (StepRecipient recp in recps)
            names.Add(YZStringHelper.GetRecpientDisplayName(recp));

        return names.ToStringList(';');
    }
}
