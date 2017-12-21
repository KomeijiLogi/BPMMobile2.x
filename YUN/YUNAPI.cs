using System;
using System.Collections;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.Net.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http.Headers;

using System.Security.Cryptography;
using System.Collections.Generic;
using System.Dynamic;
using System.Web;
using System.Net;
using System.IO;

namespace YUN
{

    public class YUNAPI
    {
        private static string xt = "";
        #region 常量定义
        /// <summary>
        /// 待办消息状态，已处理=done
        /// </summary>
        public static string TODOSTAUS_DONE = "done";
        /// <summary>
        /// 待办消息状态,待处理=undo
        /// </summary>
        public static string TODOSTAUS_UNDO = "undo";
        /// <summary>
        /// 是否推送待办消息，推送=1
        /// </summary>
        public static string TODO_YES = "1";
        /// <summary>
        /// 是否推送待办消息，不推送=0
        /// </summary>
        public static string TODO_NO = "0";
        /// <summary>
        /// 公共号所有订阅用户模式
        /// </summary>
        public static string PUBCODE_ALL = "all";
        /// <summary>
        /// 公共号账号模式
        /// </summary>
        public static string PUBCODE_ACCOUNT = "2";

        /// <summary>
        /// 公共号消息内容类型，纯文本信息=2
        /// </summary>
        public static string PUBTYPE_TEXT = "2";
        /// <summary>
        /// 公共号信息类型，文本链接信息=5
        /// </summary>
        public static string PUBTYPE_TEXTANDHREF = "5";
        /// <summary>
        /// 公共号信息类型，图文混排信息=6
        /// </summary>
        public static string PUBTYPE_TEXTANDPIC = "6";


        /// <summary>
        /// 排版展现模型 1:单条文本编排模板
        /// </summary>
        public static string PUBMODE_SINGLETEXT = "1";
        /// <summary>
        /// 排版展现模型 2:单条图文混排模板
        /// </summary>
        public static string PUBMODE_SINGLETEXTANDPIC = "2";
        /// <summary>
        /// 排版展现模型  3:多条图文混排模板 
        /// </summary>
        public static string PUBMODE_MULTITEXTANDPIC = "3";
        /// <summary>
        /// 排版展现模型 4:应用消息模板
        /// </summary>
        public static string PUBMODE_APPMSGTEMPLATE = "4";
        #endregion

        #region 公共号相关
        /// <summary>
        /// 公共号推送消息
        /// </summary>
        /// <param name="jsonContent" ></param>
        /// <returns>消息ID</returns>
        /// <see cref="http://erpcloud.kingdee.com/developer/?p=51"/>
        async public static Task<PubSendOutputDTO> PubSend(string jsonContent)
        {
            //HTTP请求地址
            string url = string.Format("{0}/pubacc/pubsend", YUNXT);
            dynamic result = new PubSendOutputDTO();
            result.success = false;
            result.message = "fail";
            try {
                string resp = await PostAsync(url, jsonContent);
                JObject obj = (JObject)JsonConvert.DeserializeObject(resp);
                var members = obj["members"];
                result.success = true;
                result.message = (string)members["msgId"];
            }
            catch (Exception ex)
            {
                //return new { success = false, msgId = "fail" };
            }
            return result;

        }

        /// <summary>
        /// 生成公共号pubtoken
        /// </summary>
        /// <param name="no">发送方企业的企业注册号(eID)</param>
        /// <param name="pub">发送使用的公共号编码</param>
        /// <param name="pubkey">公共号密钥</param>
        /// <returns></returns>
        public static string CreatePubToken(string no, string pub, string pubkey, string nonce, string time)
        {
            ArrayList list = new ArrayList() { no, pub, pubkey, nonce, time };
            ASCIIStringCompare com = new ASCIIStringCompare();
            list.Sort(com);
            string strTemp = string.Join("", list.ToArray(typeof(string)) as string[]);
            return EncryptToSHA1(strTemp);
        }
        /// <summary>
        /// 修改待办消息状态
        /// </summary>
        /// <param name="jsonContent"></param>
        /// <returns></returns>
        async public static Task<ChangeTodoMsgStatusOutputDTO> ChangeTodoMsgStatus(string jsonContent)
        {
            //HTTP请求地址
            string url = string.Format("{0}/pubacc/changeTodoMsgStatus", YUNXT);
            var result = new ChangeTodoMsgStatusOutputDTO();
            result.success = false;

            try
            {
                string resp = await PostAsync(url, jsonContent);
                JObject obj = (JObject)JsonConvert.DeserializeObject(resp);
                var members = obj["members"];
                result.success = (bool)members["success"];
                result.errorMsg = (string)members["errorMsg"];
                result.resultCode = (string)members["resultCode"];
            }
            catch (Exception ex)
            {

            }
            return result;

        }
        #endregion

        #region 身份验证相关
        /// <summary>
        /// 可以使用AppID和AppSecret调用本接口来获取access_token。AppID和AppSecret在MCLOUD注册轻应用时获得。
        /// </summary>
        /// <param name="appID"></param>
        /// <param name="appSecret"></param>
        /// <returns></returns>
        async public static Task<AccessToken> GetAccessTokenAsync(string appID, string appSecret)
        {
            string url = string.Format("{0}/openauth2/api/token?grant_type=client_credential&appid={1}&secret={2}", YUNXT, appID, appSecret);
            string resp = await GetAsync(url);
            AccessToken accessToken = null;
            try {
                accessToken = (AccessToken)JsonConvert.DeserializeObject(resp, typeof(AccessToken));
            }
            catch (Exception ex)
            {
                throw new Exception(resp);
            }
            return accessToken;

        }
        async public static Task<AccessToken> GetAccessTokenAsync(string yunxt, string appID, string appSecret)
        {
            string url = string.Format("{0}/openauth2/api/token?grant_type=client_credential&appid={1}&secret={2}", yunxt, appID, appSecret);
            string resp = await GetAsync(url);
            AccessToken accessToken = null;
            try
            {
                accessToken = (AccessToken)JsonConvert.DeserializeObject(resp, typeof(AccessToken));
            }
            catch (Exception ex)
            {
                throw new Exception(resp);
            }
            return accessToken;

        }
        /// <summary>
        /// 获取云之家当前登录用户上下文
        /// </summary>
        /// <param name="ticket">ticket</param>
        /// <param name="accessToken">access_token</param>
        /// <returns></returns>
        async public static Task<YunUser> GetYunUser(string yunxt, string ticket, AccessToken accessToken)
        {
            string url = string.Format("{0}/openauth2/api/getcontext?ticket={1}&access_token={2}", yunxt, ticket, accessToken.access_token);
            string resp = await GetAsync(url);
            YunUser user = null;
            try {
                user = (YunUser)JsonConvert.DeserializeObject(resp, typeof(YunUser));
            }
            catch
            {
                throw new Exception(resp);
            }
            return user;
        }

        /// <summary>
        /// 取云之家当前登录用户上下文
        /// </summary>
        /// <param name="ticket"></param>
        /// <param name="appID"></param>
        /// <param name="appSecret"></param>
        /// <returns></returns>
        async public static Task<YunUser> GetYunUser(string yunxt, string ticket, string appID, string appSecret)
        {
            AccessToken accessToken = await GetAccessTokenAsync(yunxt, appID, appSecret);
            return await GetYunUser(yunxt, ticket, accessToken);
        }
        #endregion

        #region 私有方法、属性
        /// <summary>
        /// 消息域名
        /// </summary>
        public static string YUNXT
        {
            get
            {
                if (xt == "")
                    return GetValueFromConfig("yunxt");
                else
                    return xt;
            }
            set
            {
                xt = value;
            }
        }

        /// <summary>
        /// 从配置文件获取Value
        /// </summary>
        /// <param name="key">配置文件中key字符串</param>
        /// <returns></returns>
        private static string GetValueFromConfig(string key)
        {
            try
            {
                Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
                //获取AppSettings的节点 
                AppSettingsSection appsection = (AppSettingsSection)config.GetSection("appSettings");
                return appsection.Settings[key].Value;
            }
            catch
            {
                return "";
            }
        }

        /// <summary>
        /// 获取由SHA1加密的字符串
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        private static string EncryptToSHA1(string str)
        {
            SHA1CryptoServiceProvider sha1 = new SHA1CryptoServiceProvider();
            byte[] str1 = Encoding.UTF8.GetBytes(str);
            byte[] str2 = sha1.ComputeHash(str1);
            sha1.Clear();
            (sha1 as IDisposable).Dispose();
            return BitConverter.ToString(str2).ToLower().Replace("-", "");
        }

        /// <summary>
        /// 使用企业私钥加密
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        private static byte[] EncryptByKey(string eid, string content, byte[] bytes)
        {
            Random r = new Random();
            string noice = "461c32501a4b11e5";// DateTime.Now.ToShortDateString();
            string pKey = RSAKeyConvert.RSAPrivateKeyJava2DotNet(Convert.ToBase64String(bytes));
            RSACryptoServiceProvider rsaCsp = new RSACryptoServiceProvider();
            rsaCsp.FromXmlString(pKey);
            byte[] encrytBytes = RSAHelper.encryptByPriKey(noice, rsaCsp);
            byte[] encContents = AESEncrypt(content, noice);
            int len = encrytBytes.Length + encContents.Length;
            byte[] lenArr = new byte[len];
            encrytBytes.CopyTo(lenArr, 0);
            encContents.CopyTo(lenArr, encrytBytes.Length);
            string resultStr = HttpUtility.UrlEncode(Convert.ToBase64String(lenArr));

            string resultcontent = "noce=" + noice + "&eid=" + eid + "&data=" + resultStr;

            Encoding encode = Encoding.GetEncoding("utf-8");
            byte[] arrB = encode.GetBytes(resultcontent);
            return arrB;

        }
        private static byte[] AESEncrypt(string toEncrypt, string keys)
        {
            byte[] keyArray = UTF8Encoding.UTF8.GetBytes(keys);
            byte[] toEncryptArray = UTF8Encoding.UTF8.GetBytes(toEncrypt);

            RijndaelManaged rDel = new RijndaelManaged();
            rDel.Key = keyArray;
            rDel.Mode = CipherMode.ECB;
            rDel.Padding = PaddingMode.PKCS7;

            ICryptoTransform cTransform = rDel.CreateEncryptor();
            return cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);

            //return Convert.ToBase64String(resultArray, 0, resultArray.Length);
        }
        /// <summary>
        /// post数据
        /// </summary>
        /// <param name="url"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        async private static Task<string> PostAsync(string url, List<KeyValuePair<string, string>> data)
        {
            using (var client = new HttpClient())
            {


                var content = new FormUrlEncodedContent(data);
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                HttpClient httpClient = new HttpClient();
                var response = await client.PostAsync(url, content);

                var responseString = await response.Content.ReadAsStringAsync();
                return responseString;
            }
        }
        private static string FormUrlEncodedPost(string url, byte[] bytes)
        {
            HttpWebRequest myReq = (HttpWebRequest)WebRequest.Create(url);
            myReq.Method = "POST";
            myReq.ContentType = "application/x-www-form-urlencoded";
            myReq.ContentLength = bytes.Length;
            Stream outStream = myReq.GetRequestStream();
            outStream.Write(bytes, 0, bytes.Length);
            outStream.Close();
            Encoding encode = Encoding.GetEncoding("utf-8");
            WebResponse myResp = myReq.GetResponse();
            Stream ReceiveStream = myResp.GetResponseStream();
            StreamReader readStream = new StreamReader(ReceiveStream, encode);

            string detail = readStream.ReadToEnd();
            return detail;
        }
        /// <summary>
        /// post数据
        /// </summary>
        /// <param name="url"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        async private static Task<string> PostAsync(string url, string data)
        {
            using (var client = new HttpClient())
            {
                var content = new StringContent(data);
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                var response = await client.PostAsync(url, content);

                var responseString = await response.Content.ReadAsStringAsync();
                return responseString;
            }
        }
        /// <summary>
        /// get数据
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        async private static Task<string> GetAsync(string url)
        {
            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(url);
                var responseString = await response.Content.ReadAsStringAsync();
                return responseString;
            }
        }

        #endregion

        #region 查询指定人员信息
        public static GetPersonInfoResponse GetPersonInfo(string yunxt, string eid, byte[] bytes, string[] openId)
        {
            string url = string.Format("{0}/openaccess/input/person/get", yunxt);

            string json = "{eid:'" + eid + "',type:1,array:['" + string.Join<string>("','", openId) + "']}";
            var enBytes = EncryptByKey(eid, json, bytes);

            string response = FormUrlEncodedPost(url, enBytes);
            return JsonConvert.DeserializeObject<GetPersonInfoResponse>(response);


        }
        #endregion
        //#region 查询指定组织信息
        //public static GetDepartInfoResponse GetDepartInfo(string yunxt, string eid, byte[] bytes, string[] orgId)
        //{
        //    string url = string.Format("{0}/openaccess/input/dept/getall", yunxt);

        //    string json = "{eid:'" + eid + "',type:1,array:['" + string.Join<string>("','", orgId) + "']}";
        //    var enBytes = EncryptByKey(eid, json, bytes);

        //    string response = FormUrlEncodedPost(url, enBytes);
        //    return JsonConvert.DeserializeObject<GetDepartInfoResponse>(response);


        //}
        //#endregion

    }
    public class ASCIIStringCompare : System.Collections.IComparer
    {

        public int Compare(object xo, object yo)
        {
            String x = xo.ToString();
            String y = yo.ToString();
            if (x.CompareTo(y) == 0)
            {
                return 0;
            }
            if (x.Length == 0)
            {
                return -1;
            }
            if (y.Length == 0)
            {
                return 1;
            }
            if ((int)x.First() == (int)y.First())
            {
                return Compare(x.Substring(1), y.Substring(1));
            }

            return ((int)x.First()).CompareTo((int)y.First());
        }
    }
    public class PersonInfo
    {
        public string openId { get; set; }
        public string name { get; set; }
        public string photoUrl { get; set; }
        public string phone { get; set; }
        public string phones { get; set; }
        public string isHidePhone { get; set; }
        public string email { get; set; }
        public string department { get; set; }
        public string jobTitle { get; set; }
        public int gender { get; set; }
        public int status { get; set; }
        public int weights { get; set; }
        public int orgUserType { get; set; }

    }
    public class GetPersonInfoResponse
    {
        public bool success { get; set; }
        public string error { get; set; }
        public int errorCode { get; set; }
        public PersonInfo[] data { get; set; }
    }
    //public class GetDepartInfoResponse
    //{
    //    public bool success { get; set; }
    //    public string error { get; set; }
    //    public int errorCode { get; set; }
    //    public PersonInfo[] data { get; set; }
    //}
}