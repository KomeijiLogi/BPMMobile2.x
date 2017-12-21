using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Filters;
using System.Web.Http.Results;
using YUN;
namespace BPMMobile
{
    [AttributeUsage(AttributeTargets.Class|AttributeTargets.Method)]
    public class YunAuthenticateAttribute : FilterAttribute, IAuthenticationFilter
    {
        public async Task AuthenticateAsync(HttpAuthenticationContext context, CancellationToken cancellationToken)
        {
            IPrincipal user = null;
            AuthenticationHeaderValue headerValue =
                context.Request.Headers.Authorization;
            if (null != headerValue && headerValue.Scheme == "Basic")
            {
                //string credential = Encoding.Default.GetString(
                //    Convert.FromBase64String(headerValue.Parameter));
                YunUser yunUser = await GetUserFromTicket(headerValue.Parameter);
                if (yunUser!=null)//云之家验证
                {
                    GenericIdentity identity = new GenericIdentity(yunUser.mobile);
                    user = new GenericPrincipal(identity, new string[0]);
                }
            }
            context.Principal = user;
           // return Task<object>(null);
        }

        public Task ChallengeAsync(HttpAuthenticationChallengeContext context, CancellationToken cancellationToken)
        {
            IPrincipal user = context.ActionContext.ControllerContext
                .RequestContext.Principal;
            if (user == null || !user.Identity.IsAuthenticated)
            {
                string parameter = string.Format(
                    "realm=\"{0}\"", context.Request.RequestUri.DnsSafeHost);
                //AuthenticationHeaderValue challenge =
                //    new AuthenticationHeaderValue("Basic", parameter);
                context.Result = new UnauthorizedResult(
                    new AuthenticationHeaderValue[] {  }, context.Request);
            }
            return Task.FromResult<object>(null);
        }
        private async Task<YunUser> GetUserFromTicket(string ticket)
        {

            string appID = ConfigurationManager.AppSettings["appID"];//轻应用注册到云之家时生成
            string appSecret = ConfigurationManager.AppSettings["appSecret"];//轻应用注册到云之家时生成
            string yunxt = ConfigurationManager.AppSettings["yunxt"];//轻应用注册到云之家时生成
            YunUser user = null;
            try
            {
                user = await YUNAPI.GetYunUser(yunxt, ticket, appID, appSecret);
            }
            catch(Exception e)
            {
                System.Diagnostics.Debug.WriteLine(e);
            }
            return user;
        }
    }
}