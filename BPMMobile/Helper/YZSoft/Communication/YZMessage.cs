using System;
using System.Collections.Generic;
using System.Web;
using YZSoft.Web.Database;
using System.Data;
using BPM;
using BPM.Client;

/// <summary>
///YZComunity 的摘要说明
/// </summary>
namespace YZSoft.Web.Communication
{
    public class YZMessage
    {
        public int id{get;set;}
        public string uid { get; set; }
        public DateTime date { get; set; }
        public YZResourceType resType { get; set; }
        public string resId{get;set;}
        public string message{get;set;}

        public YZMessage(string uid, DateTime date, YZResourceType resType, string resId, string message)
        {
            this.uid = uid;
            this.date = date;
            this.resType = resType;
            this.resId = resId;
            this.message = message;
        }

        public YZMessage(YZReader reader)
        {
            this.id = reader.ReadInt32("id");
            this.uid = reader.ReadString("uid");
            this.date = reader.ReadDateTime("date");
            this.resType = (YZResourceType)reader.ReadEnum("resType", typeof(YZResourceType), YZResourceType.Task);
            this.resId = reader.ReadString("resId");
            this.message = reader.ReadString("message");
        }

        public void Serialize(JsonItem item)
        {
            this.Serialize(null, item);
        }

        public void Serialize(BPMConnection cn,JsonItem item)
        {
            User user = null;
            if (cn != null)
                user = User.TryGetUser(cn, this.uid);

            if (user == null)
            {
                user = new User();
                user.Account = this.uid;
            }

            item.Attributes["id"] = this.id;
            item.Attributes["uid"] = user.Account;
            item.Attributes["uname"] = user.ShortName;
            item.Attributes["date"] = "";//YZStringHelper.DateToStringM(this.date);
            item.Attributes["resType"] = this.resType.ToString();
            item.Attributes["resId"] = this.resId;
            item.Attributes["message"] = this.message;
        }

        public void Insert(IDbConnection cn)
        {
            YZDBProviderManager.CurrentProvider.Insert(cn, this);
        }
    }
}