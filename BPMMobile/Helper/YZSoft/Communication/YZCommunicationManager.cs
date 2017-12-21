using System;
using System.Collections.Generic;
using System.Web;
using System.Data;
using YZSoft.Web.Database;

/// <summary>
///YZComunity 的摘要说明
/// </summary>
namespace YZSoft.Web.Communication
{
    public class YZCommunicationManager
    {
        public static int GetMessageCount(IDbConnection cn,YZResourceType resType,string resId)
        {
            IYZDBProvider dbProvider = YZDBProviderManager.CurrentProvider;
            IDbCommand cmd = dbProvider.GetResourceCommunicationCountCommand(resType, resId);
            cmd.Connection = cn;

            using (YZReader reader = new YZReader(cmd.ExecuteReader()))
            {
                if (reader.Read())
                    return reader.ReadInt32(0);
                else
                    return 0;
            }
        }

        public static int GetNewMessageCount(IDbConnection cn, string uid, YZResourceType resType, string resId)
        {
            IYZDBProvider dbProvider = YZDBProviderManager.CurrentProvider;
            IDbCommand cmd = dbProvider.GetResourceCommunicationNewMessageCountCommand(uid, resType, resId);
            cmd.Connection = cn;

            using (YZReader reader = new YZReader(cmd.ExecuteReader()))
            {
                if (reader.Read())
                    return reader.ReadInt32(0);
                else
                    return 0;
            }
        }

        public static YZMessageCollection GetNewMessages(IDbConnection cn, YZResourceType resType, string resId, int maxReadedMessageId)
        {
            IYZDBProvider dbProvider = YZDBProviderManager.CurrentProvider;
            IDbCommand cmd = dbProvider.GetResourceCommunicationNewMessagesCommand(resType, resId, maxReadedMessageId);
            cmd.Connection = cn;

            using (YZReader reader = new YZReader(cmd.ExecuteReader()))
            {
                YZMessageCollection messages = new YZMessageCollection(reader);
                return messages;
            }
        }

        public static void UpdateReaded(IDbConnection cn, string uid, YZResourceType resType, string resId, int maxReadedMessageId)
        {
            IYZDBProvider dbProvider = YZDBProviderManager.CurrentProvider;
            dbProvider.UpdateResourceCommunicationReaded(cn, uid, resType, resId, maxReadedMessageId);
        }
    }
}