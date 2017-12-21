using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YUN
{
    /// <summary>
    /// 轻应用调用云之家的服务接口均需使用access_token。
    ///注意：access_token有效期为7天,32位字符串。
    /// </summary>
    public class AccessToken
    {
        public string access_token;

        public string expires_in;
    }
}
