using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Cryptography;


namespace YUN
{
    public static class RSAHelper
    {
        //填充
        private static byte[] add_PKCS1_padding(byte[] oText, int blockLen)
        {
            byte[] result = new byte[blockLen];
            result[0] = 0x00;
            result[1] = 0x01;

            int padLen = blockLen - 3 - oText.Length;
            for (int i = 0; i < padLen; i++)
            {
                result[i + 2] = 0xff;
            }

            result[padLen + 2] = 0x00;

            int j = 0;
            for (int i = padLen + 3; i < blockLen; i++)
            {
                result[i] = oText[j++];
            }

            return result;
        }
        //私钥加密
        private static byte[] priEncrypt(byte[] block, RSACryptoServiceProvider key)
        {
            RSAParameters param = key.ExportParameters(true);
            BigInteger2 d = new BigInteger2(param.D);
            BigInteger2 n = new BigInteger2(param.Modulus);
            BigInteger2 biText = new BigInteger2(block);
            BigInteger2 biEnText = biText.modPow(d, n);
            return biEnText.getBytes();
        }

        //私钥加密
        public static  byte[] encryptByPriKey(String src, RSACryptoServiceProvider key)
        {
            //获得明文字节数组
            byte[] oText = System.Text.Encoding.Default.GetBytes(src);
            //填充
            oText = add_PKCS1_padding(oText, 128);
            //加密
            byte[] result = priEncrypt(oText, key);
            return result;
        }
    }
}