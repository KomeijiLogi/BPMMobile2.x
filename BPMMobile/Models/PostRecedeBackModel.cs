using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BPMMobile.Models
{
    public class PostRecedeBackModel
    {
        public int stepid { get; set; }

        public string comments { get; set; }

        public int[] toStepIDs { get; set; }
    }
}