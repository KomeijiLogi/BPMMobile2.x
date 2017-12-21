using System;
using System.Collections.Generic;
using System.Web;
using BPM;
using BPM.Client;
using YZSoft.Web.Database;

/// <summary>
///YZComunity 的摘要说明
/// </summary>
namespace YZSoft.Web.Communication
{
    public class YZMessageCollection : BPMList<YZMessage>
    {
        public YZMessageCollection(YZReader reader)
        {
            while (reader.Read())
            {
                YZMessage message = new YZMessage(reader);
                this.Add(message);
            }
        }

        public void Serialize(BPMConnection cn,JsonItemCollection items)
        {
            foreach (YZMessage message in this)
            {
                JsonItem item = new JsonItem();
                items.Add(item);
                message.Serialize(cn,item);
            }
        }
    }
}