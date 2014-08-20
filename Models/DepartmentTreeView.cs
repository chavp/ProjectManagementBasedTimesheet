using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PJ_CWN019.TM.PBM.Web.Models
{
    public class DepartmentTreeView
    {
        public DepartmentTreeView()
        {
            children = new List<DepartmentTreeView>();
        }

        public string ID { get; set; }
        public long DepartmentID { get; set; }
        public string Department { get; set; }
        public long PositionID { get; set; }
        public string Position { get; set; }
        public decimal? ProjectRoleRateCost { get; set; }

        public bool leaf { get; set; }
        public bool expanded { get; set; }
        public List<DepartmentTreeView> children { get; set; }
    }
}