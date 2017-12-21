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
using System.Data.SqlClient;
using BPM;
using BPM.Client;
using YZSoft.Web.Database;

/// <summary>
/// YZAttachmentHelp 的摘要说明
/// </summary>
namespace Helper
{
    public class YZAttachmentHelper
    {
        private static string _attachmentBaseUrl = null;
        private static string _attachmentRootPath = null;

        public static string GetNewFileID()
        {
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                string rv = cn.GetSerialNum("yz_sys_att" + DateTime.Today.ToString("yyyyMMdd"), 4, 1, 1);
                rv = rv.Substring("yz_sys_att".Length);
                return rv;
            }
        }

        public static string AttachmentBaseURL
        {
            get
            {
                if (YZAttachmentHelper._attachmentBaseUrl == null)
                    YZAttachmentHelper._attachmentBaseUrl = System.Web.Configuration.WebConfigurationManager.AppSettings["AttachmentBaseURL"];

                return YZAttachmentHelper._attachmentBaseUrl;
            }
        }

        public static string AttachmentRootPath
        {
            get
            {
                if (YZAttachmentHelper._attachmentRootPath == null)
                    YZAttachmentHelper._attachmentRootPath = System.Web.Configuration.WebConfigurationManager.AppSettings["AttachmentRootPath"];

                return YZAttachmentHelper._attachmentRootPath;
            }
        }

        public static AttachmentInfoCollection GetAttachmentsInfo(IDbConnection cn, string[] fileIds)
        {
            AttachmentInfoCollection rv = new AttachmentInfoCollection();

            using (IDataReader reader = YZDBProviderManager.CurrentProvider.GetAttachmentsInfo(cn, fileIds))
            {
                while (reader.Read())
                    rv.Add(new AttachmentInfo(reader, YZAttachmentHelper.AttachmentRootPath));
            }

            return rv;
        }

        public static AttachmentInfo GetAttachmentInfo(IDbConnection cn, string fileId)
        {
            if (String.IsNullOrEmpty(fileId))
                throw new Exception(null);

            AttachmentInfoCollection attachments = YZAttachmentHelper.GetAttachmentsInfo(cn, new string[] { fileId });

            if (attachments.Count == 0)
                throw new Exception(null);

            return attachments[0];
        }
    }
}
