using System;
using System.Data;
using System.Text;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using BPM;
using BPM.Client;

/// <summary>
/// JsonItem 的摘要说明



/// </summary>
public class JsonItem
{
    public const string TotalRows = "totalRows";

    public string tagName = "Item";
    Dictionary<string, object> _attributes;

    public JsonItem()
    {
    }

    public JsonItem(string tagName)
    {
        this.tagName = tagName;
    }

    public JsonItem(BPMTask task)
    {
        this.Attributes["TaskID"] = task.TaskID;
        this.Attributes["SerialNum"] = task.SerialNum;
        this.Attributes["ProcessName"] = task.ProcessName;
    }

    public JsonItem(AttachmentInfo attachment)
    {
        this.Attributes["FileID"] = attachment.FileID;
        this.Attributes["Name"] = attachment.Name;
        this.Attributes["Ext"] = attachment.Ext;
        this.Attributes["Size"] = attachment.Size;
        this.Attributes["LastUpdate"] = "";//YZStringHelper.DateToStringL(attachment.LastUpdate);
        this.Attributes["OwnerAccount"] = attachment.OwnerAccount;
    }

    public void Applay(JsonItem itm, string ignoreAttr)
    {
        foreach (string attr in itm.Attributes.Keys)
        {
            if (NameCompare.EquName(attr, ignoreAttr))
                continue;

            this.Attributes[attr] = itm.Attributes[attr];
        }
    }

    public static JsonItem GetTaskStateJsonItem(BPMConnection cn, TaskState state, int taskid)
    {
        JsonItem rv = new JsonItem();
        rv.Attributes.Add("State", state.ToString().ToLower());

        if (state == TaskState.Running)
        {
            JsonItemCollection children = new JsonItemCollection();
            rv.Attributes.Add("children", children);

            BPMStepCollection steps = BPMTask.GetInProcessSteps(cn, taskid);
            foreach (BPMProcStep step in steps)
            {
                JsonItem item = new JsonItem();
                item.Attributes.Add("StepName", step.StepDisplayName);
                item.Attributes.Add("Share", step.Share);
                item.Attributes.Add("RecipientAccount", step.RecipientAccount);
                item.Attributes.Add("RecipientDisplayName", step.RecipientFullName);
                children.Add(item);
            }
        }

        return rv;
    }

    public Dictionary<string, object> Attributes
    {
        get
        {
            if (this._attributes == null)
            {
                this._attributes = new Dictionary<string, object>(StringComparer.InvariantCultureIgnoreCase);
            }

            return this._attributes;
        }
    }

    public void AppendToJsonString(StringBuilder sb)
    {
        sb.Append("{");

        bool firstAttr = true;
        foreach (KeyValuePair<string, object> kv in this.Attributes)
        {
            if (firstAttr)
                firstAttr = false;
            else
                sb.Append(",");

            sb.Append("\"" + kv.Key + "\"");
            sb.Append(":");
            sb.Append(YZJsonHelper.ConvertToJsonValue(kv.Value));
        }

        sb.Append("}");
    }

    public override string ToString()
    {
        StringBuilder sb = new StringBuilder();
        AppendToJsonString(sb);
        return sb.ToString();
    }
}
