using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BPMMobile.Models
{
    public class PostInformModel
    {
       public int taskID { get; set; }
       public string comments { get; set; }
       public string[] accounts { get; set; }
    }
}