using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PJ_CWN019.TM.PBM.Web.Models
{
    public class PositionView
    {
        public long PositionID { get; set; }
        public string PositionName { get; set; }
        public int Order { get; set; }
        public decimal ProjectRoleRateCost { get; set; }
        public int TotalPerson { get; set; }
    }
}