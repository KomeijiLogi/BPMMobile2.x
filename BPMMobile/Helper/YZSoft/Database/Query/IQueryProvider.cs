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

/// <summary>
/// IQueryProvider 的摘要说明

/// </summary>
public interface IQueryProvider
{
    string GetSortString(string defaultSort);
    string SortStringDraftGrid { get;}
    string SortStringHistoryTaskMyPosted { get;}
    string SortStringMyTask { get;}
    string SortStringOnlineUsers { get;}
    string SortStringSystemUsers { get;}
    string SortStringAppLog { get;}

    string FilterStringHistoryTaskTaskTableFilter { get;}
    string FilterStringHistoryTaskStepTableFilter { get;}
    string FilterStringMyTask { get;}
    string FilterStringSystemUsers { get;}
    string FilterStringAppLog { get;}

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
    IDataReader GetAttachmentsInfo(IDbConnection cn,string[] fileids);
    void InsertAttachmentInfo(IDbConnection cn,AttachmentInfo attInfo);
    byte[] Excel2Image(MemoryStream stream, int timeout, out Size size, out string error);
}
