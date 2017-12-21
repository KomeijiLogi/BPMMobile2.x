using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YUN
{
    public class MessageFrom
    {
        

        /// <summary>
        /// 发送方企业的企业注册号(eID)，格式为字符串
        /// </summary>
        public string no; 
        /// <summary>
        /// 发送使用的公共号编码，格式为字符串
        /// </summary>
        public string pub;
        /// <summary>
        /// 发送时间，为'currentTimeMillis()以毫秒为单位的当前时间'的字符串或数字
        /// </summary>
        public string time;
        /// <summary>
        /// 随机数，格式为字符串或数字
        /// </summary>
        public string nonce;
        /// <summary>
        /// sha加密串，格式为字符串
        /// </summary>
        public string pubtoken;

    }
    public class MessageToItem
    {
        /// <summary>
        /// 接收方企业的企业注册号(eID)，格式为字符串
        /// </summary>
        public string no;
    }
   

}
