using System;
using System.Collections.Generic;
using System.Web;
using System.Data;
using System.Text;

/// <summary>
///YZReader 的摘要说明

namespace YZSoft.Web.Database
{
    public class YZReader : IDisposable
    {
        private IDataReader _reader = null;

        public YZReader(IDataReader reader)
        {
            this._reader = reader;
        }

        public void NextResult()
        {
            this._reader.NextResult();
        }

        public bool Read()
        {
            return this._reader.Read();
        }

        public IDataReader Reader
        {
            get
            {
                return this._reader;
            }
        }

        public bool IsDBNull(int index)
        {
            return this._reader.IsDBNull(index);
        }

        public bool IsDBNull(string fieldName)
        {
            return IsDBNull(this._reader.GetOrdinal(fieldName));
        }

        public DateTime ReadDateTime(int index)
        {
            if (this._reader.IsDBNull(index))
                return DateTime.MinValue;

            return this._reader.GetDateTime(index);
        }

        public DateTime ReadDateTime(string fieldName)
        {
            return ReadDateTime(this._reader.GetOrdinal(fieldName));
        }

        public int ReadInt32(int index)
        {
            if (this._reader.IsDBNull(index))
                return -1;

            return Convert.ToInt32(this._reader.GetValue(index));
        }

        public int ReadInt32(string fieldName)
        {
            return ReadInt32(this._reader.GetOrdinal(fieldName));
        }

        public decimal ReadDecimal(int index)
        {
            if (this._reader.IsDBNull(index))
                return -1;

            //SQL Server数据库中monery4位小数点处理
            return (decimal)Convert.ToDouble(this._reader.GetValue(index));
        }

        public decimal ReadDecimal(string fieldName)
        {
            return ReadDecimal(this._reader.GetOrdinal(fieldName));
        }

        public uint ReadUInt32(int index, uint defaultValue)
        {
            if (this._reader.IsDBNull(index))
                return defaultValue;

            int value = Convert.ToInt32(this._reader.GetValue(index));
            if (value < 0)
                return defaultValue;

            return (uint)value;
        }

        public uint ReadUInt32(string fieldName, uint defaultValue)
        {
            return ReadUInt32(this._reader.GetOrdinal(fieldName), defaultValue);
        }

        public bool ReadBool(int index, bool defaultValue)
        {
            object objValue = this._reader.GetValue(index);
            if (System.Convert.IsDBNull(objValue))
                return defaultValue;

            if (objValue is bool)
                return (bool)objValue;

            int value = System.Convert.ToInt32(objValue);
            if (value == 0)
                return false;
            else
                return true;
        }

        public bool ReadBool(string fieldName, bool defaultValue)
        {
            return ReadBool(this._reader.GetOrdinal(fieldName), defaultValue);
        }

        public string ReadString(int index)
        {
            object objValue = this._reader.GetValue(index);

            if (System.Convert.IsDBNull(objValue))
                return null;

            if (objValue is string)
                return (string)objValue;

            try
            {
                if (objValue is byte[])
                    return Encoding.UTF8.GetString((byte[])objValue);
            }
            catch
            {
            }

            return null;
        }

        public string ReadString(string fieldName)
        {
            return ReadString(this._reader.GetOrdinal(fieldName));
        }

        public Guid ReadGuid(int index)
        {
            object objValue = this._reader.GetValue(index);

            if (System.Convert.IsDBNull(objValue))
                return Guid.Empty;

            if (objValue is Guid)
                return (Guid)objValue;

            try
            {
                if (objValue is string)
                    return new Guid(objValue as string);
            }
            catch
            {
            }
            return Guid.Empty;
        }

        public Guid ReadGuid(string fieldName)
        {
            return ReadGuid(this._reader.GetOrdinal(fieldName));
        }

        public object ReadObject(int index, object defvalue)
        {
            object value = this._reader.GetValue(index);
            if (System.Convert.IsDBNull(value))
                return defvalue;
            else
            {
                string strValue = value as string;
                if (strValue != null)
                {
                    strValue = strValue.Trim();
                    return strValue;
                }

                return value;
            }
        }

        public object ReadObject(string fieldName, object defvalue)
        {
            return ReadObject(this._reader.GetOrdinal(fieldName), defvalue);
        }

        public object ReadEnum(int index, Type enumType, object defaultValue)
        {
            string value = ReadString(index);

            if (!String.IsNullOrEmpty(value))
                value = value.Trim();

            if (String.IsNullOrEmpty(value))
                return defaultValue;

            try
            {
                return Enum.Parse(enumType, value, true);
            }
            catch
            {
                return defaultValue;
            }
        }

        public object ReadEnum(string fieldName, Type enumType, object defaultValue)
        {
            return ReadEnum(this._reader.GetOrdinal(fieldName), enumType, defaultValue);
        }

        public static DateTime ReadDateTime(IDataReader reader, int index)
        {
            YZReader dbr = new YZReader(reader);
            return dbr.ReadDateTime(index);
        }

        public static DateTime ReadDateTime(IDataReader reader, string fieldName)
        {
            return ReadDateTime(reader, reader.GetOrdinal(fieldName));
        }

        public static int ReadInt32(IDataReader reader, int index)
        {
            YZReader dbr = new YZReader(reader);
            return dbr.ReadInt32(index);
        }

        public static int ReadInt32(IDataReader reader, string fieldName)
        {
            return ReadInt32(reader, reader.GetOrdinal(fieldName));
        }

        public static bool ReadBool(IDataReader reader, int index, bool defaultValue)
        {
            YZReader dbr = new YZReader(reader);
            return dbr.ReadBool(index, defaultValue);
        }

        public static bool ReadBool(IDataReader reader, string fieldName, bool defaultValue)
        {
            return ReadBool(reader, reader.GetOrdinal(fieldName), defaultValue);
        }

        public static string ReadString(IDataReader reader, int index)
        {
            YZReader dbr = new YZReader(reader);
            return dbr.ReadString(index);
        }

        public static string ReadString(IDataReader reader, string fieldName)
        {
            return ReadString(reader, reader.GetOrdinal(fieldName));
        }

        public static Guid ReadGuid(IDataReader reader, int index)
        {
            YZReader dbr = new YZReader(reader);
            return dbr.ReadGuid(index);
        }

        public static Guid ReadGuid(IDataReader reader, string fieldName)
        {
            return ReadGuid(reader, reader.GetOrdinal(fieldName));
        }

        public static object ReadObject(IDataReader reader, int index, object defaultValue)
        {
            YZReader dbr = new YZReader(reader);
            return dbr.ReadObject(index, defaultValue);
        }

        public static object ReadObject(IDataReader reader, string fieldName, object defaultValue)
        {
            return ReadObject(reader, reader.GetOrdinal(fieldName), defaultValue);
        }

        public static object ReadEnum(IDataReader reader, int index, Type enumType, object defaultValue)
        {
            YZReader dbr = new YZReader(reader);
            return dbr.ReadEnum(index, enumType, defaultValue);
        }

        public static object ReadEnum(IDataReader reader, string fieldName, Type enumType, object defaultValue)
        {
            return ReadEnum(reader, reader.GetOrdinal(fieldName), enumType, defaultValue);
        }

        #region IDisposable 成员

        public void Dispose()
        {
            if (this._reader != null)
                this._reader.Dispose();
        }

        #endregion
    }
}