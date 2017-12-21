using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Web.Configuration;
using BPM;
using BPM.Client;

/// <summary>
/// BPMAccountHelper 的摘要说明


/// </summary>
public class YZAuthHelper
{
    public static bool IsAuthenticated
    {
        get
        {
            if (String.Compare(System.Web.Configuration.WebConfigurationManager.AppSettings["ShowMaintenancePage"], "true", true) == 0)
                return false;

            HttpContext context = HttpContext.Current;

            if (context.User.Identity.IsAuthenticated)
                return true;

            HttpCookie authCookie = context.Request.Cookies[FormsAuthentication.FormsCookieName];
            if (authCookie != null)
            {
                try
                {
                    FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(authCookie.Value);
                    FormsIdentity identity = new FormsIdentity(ticket);
                    if (identity.IsAuthenticated)
                        return true;
                }
                catch
                {
                }

                //GenericPrincipal principal = new GenericPrincipal(identity, null);
                //context.User = principal;
            }

            return false;
        }
    }

    public static void AuthCheck()
    {
        if (String.Compare(System.Web.Configuration.WebConfigurationManager.AppSettings["ShowMaintenancePage"], "true", true) == 0)
        {
        }
        else if(!YZAuthHelper.IsAuthenticated)
        {
            throw new Exception("登录超时");
        }
    }
    
    public static void AshxAuthCheck()
    {
        AshxAuthCheck(true);
    }

    public static void AshxAuthCheck(bool checkLogin)
    {
        if (String.Compare(System.Web.Configuration.WebConfigurationManager.AppSettings["ShowMaintenancePage"], "true", true) == 0)
        {
            HttpContext.Current.Response.StatusCode = 500;

            JsonItem rv = new JsonItem();
            rv.Attributes.Add("success", false);
            rv.Attributes.Add("errorCode", 100);

            HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.Write(rv.ToString());
            HttpContext.Current.Response.End();
        }
        else if (checkLogin && !YZAuthHelper.IsAuthenticated)
        {
            HttpContext.Current.Response.StatusCode = 200;

            JsonItem rv = new JsonItem();
            rv.Attributes.Add("success", false);
            rv.Attributes.Add("errorCode", 101);
            rv.Attributes.Add("errorMessage", "登录超时");

            HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.Write(rv.ToString());
            HttpContext.Current.Response.End();
        }
    }

    //调用之前必需先调用 IsAuthenticated
    public static string LoginUserAccount
    {
        get
        {
            HttpContext context = HttpContext.Current;

            if (context.User.Identity.IsAuthenticated)
                return context.User.Identity.Name;

            HttpCookie authCookie = null;
            foreach (string key in context.Response.Cookies.AllKeys)
            {
                if (String.Compare(key, FormsAuthentication.FormsCookieName, true) == 0)
                {
                    authCookie = context.Response.Cookies[key];
                    break;
                }
            }
            if (authCookie == null)
                authCookie = context.Request.Cookies[FormsAuthentication.FormsCookieName];

            if (authCookie != null && !String.IsNullOrEmpty(authCookie.Value))
            {
                FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(authCookie.Value);
                return ticket.Name;
            }

            return String.Empty;
        }
    }
 
 
   public static string UserDisplayName
    {
        get
        {
            HttpCookie cookie = HttpContext.Current.Request.Cookies["UserDisplayName"];
            if (cookie != null)
                return HttpUtility.UrlDecode(cookie.Value, System.Text.Encoding.UTF8);
            else
                return null;
        }
    }
    public static void SetAuthCookie(string account)
    {
        HttpContext.Current.Response.Cookies.Remove(FormsAuthentication.FormsCookieName);
        FormsAuthentication.SetAuthCookie(account, false);
        HttpCookie cookie = HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
        if (cookie == null)
            throw new Exception(String.Format("设置cookie失败"));
    }

    public static void SignOut()
    {
        LoginManager.OnSignOut();
        FormsAuthentication.SignOut();
    }

    public static void SetCookie(HttpResponse response, string key, string value)
    {
        HttpCookie cookie = new HttpCookie(key, value);
        cookie.HttpOnly = true;
        response.SetCookie(cookie);
    }

    public static void ClearCookie(HttpResponse response, string key)
    {
        HttpCookie cookie = new HttpCookie(key, "");
        cookie.HttpOnly = true;
        cookie.Expires = new DateTime(0x7cf, 10, 12);
        response.Cookies.Remove(key);
        response.Cookies.Add(cookie);
    }

    public static string GetCookie(HttpRequest request, string key, string defaultValue)
    {
        HttpCookie cookie = request.Cookies[key];

        string value;
        if (cookie != null && cookie.Value != null)
            value = cookie.Value;
        else
            value = defaultValue;

        if (value == null)
            value = String.Empty;

        return value;
    }

    public static void SetLogoutFlag(string type, string lastaccount)
    {
        HttpContext context = HttpContext.Current;
        SetCookie(context.Response, "_bpm_logout_type", type);
        SetCookie(context.Response, "_bpm_logout_lastaccount", lastaccount);
    }

    public static void ClearLogoutFlag()
    {
        HttpContext context = HttpContext.Current;
        ClearCookie(context.Response, "_bpm_logout_type");
        ClearCookie(context.Response, "_bpm_logout_lastaccount");
    }

    public static string BPMLogoutType
    {
        get
        {
            return GetCookie(HttpContext.Current.Request, "_bpm_logout_type", "");
        }
    }

    public static string BPMLogoutLastAccount
    {
        get
        {
            return GetCookie(HttpContext.Current.Request, "_bpm_logout_lastaccount", "");
        }
    }

    public static string BPMServerName
    {
        get
        {
            return WebConfigurationManager.AppSettings["BPMServerName"];
        }
    }

    public static int BPMServerPort
    {
        get
        {
            int port = BPMConnection.DefaultPort;
            string strPort = WebConfigurationManager.AppSettings["BPMServerPort"];
            if (!String.IsNullOrEmpty(strPort))
            {
                try
                {
                    port = Int32.Parse(strPort);
                }
                catch (Exception)
                {
                    throw new Exception(String.Format("Incorrent prot:{0},Please check \"BPMServerPort\" value in web.config file", strPort));
                }
            }

            return port;
        }
    }
}
