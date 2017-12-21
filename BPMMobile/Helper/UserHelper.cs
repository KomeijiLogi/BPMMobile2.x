using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;

namespace Helper
{
    public class UserHelper
    {
        public  string GetUserHtml()
        {   string user = "";
            string con = ConfigurationManager.ConnectionStrings["BPMDB"].ToString();
            string str = string.Format("select displayname,account from BPMSysUsers  LEFT join BPMSysOUMembers on   BPMSysOUMembers.UserAccount=bpmsysusers.account where BPMSysOUMembers.OUID in((select ouid from ZYOUCODETABLE() where code like '01.02.03%'))");
            using (SqlConnection cn = new SqlConnection(con))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand(str, cn);
            
                SqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    string displayname = string.IsNullOrEmpty(dr["DisPlayName"].ToString()) ? "未录入全名" : dr["DisPlayName"].ToString();
                    user += "<li data-value=\"" + ChinesePyHelper.GetSpellCode(displayname) + "\" data-tags=\" \" class=\"mui-table-view-cell mui-indexed-list-item mui-checkbox mui-left\">" +
                            "<input type=\"checkbox\" value=\"" + dr["account"] + "\"/>" + displayname + "</li>";
                    
                    
                }
                

            }
            
          

         
            return user;
        }



    }


}