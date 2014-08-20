using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PJ_CWN019.TM.PBM.Web.Models
{
    public class PhaseView
    {
        public long ID { get; set; }
        public string Name { get; set; }
        public int Order { get; set; }
        public bool ContainsTimesheet { get; set; }
    }
}