using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Drawing;
using System.IO;
using BPM;
using YZSoft.Web.Communication;
using YZSoft.Web;

/// <summary>
/// IYZDBProvider 的摘要说明

/// </summary>
namespace YZSoft.Web.Database
{
    public interface IYZDBProvider
    {
        string GetSortString(string defaultSort);
        string SortStringDraftGrid { get; }
        string SortStringHistoryTaskMyPosted { get; }
        string SortStringMyTask { get; }
        string SortStringOnlineUsers { get; }
        string SortStringSystemUsers { get; }
        string SortStringAppLog { get; }

        string FilterStringHistoryTaskTaskTableFilter { get; }
        string FilterStringHistoryTaskStepTableFilter { get; }
        string FilterStringMyTask { get; }
        string FilterStringSystemUsers { get; }
        string FilterStringAppLog { get; }
        string FilterStringCommunicationListTaskTableFilter { get; }
        string FilterStringCommunicationMessageTableFilter { get; }

        IDbCommand HandlingTimeStepCommand { get; }
        IDbCommand HandlingTimeUserCommand { get; }
        IDbCommand HandlingTimeDetailCommand { get; }

        IDbCommand TimeoutStepCommand { get; }
        IDbCommand TimeoutUserCommand { get; }
        IDbCommand TimeoutDetailCommand { get; }

        IDbCommand SystemUsageCommand { get; }
        IDbCommand ProcessUsageCommand { get; }

        IDbConnection OpenConnection();
        JsonItemCollection GetFactorys(IDbConnection cn);
        DataTable Query2Table(string datasourceName, string query, string resultTableName);
        IDataReader GetAttachmentsInfo(IDbConnection cn, string[] fileids);
        void InsertAttachmentInfo(IDbConnection cn, AttachmentInfo attInfo);
        byte[] Excel2Image(MemoryStream stream, int timeout, out Size size, out string error);

        IDbCommand GetResourceCommunicationNewMessagesCommand(YZResourceType resType, string resId, int maxReadedMessageId);
        int GetTaskCommunicationNewMessageCount(IDbConnection cn, string uid, BPMObjectNameCollection sids);
        IDbCommand GetTaskCommunicationListCommand(IDbConnection cn, string uid, BPMObjectNameCollection sids,string taskTableFilter,string messageTableFilter, int start, int limit);
        YZMessage Insert(IDbConnection cn, YZMessage message);
        void UpdateResourceCommunicationReaded(IDbConnection cn, string uid, YZResourceType resType, string resId, int maxReadedMessageId);
        IDbCommand GetResourceCommunicationCountCommand(YZResourceType resType, string resId);
        IDbCommand GetResourceCommunicationNewMessageCountCommand(string uid, YZResourceType resType, string resId);
    }
}