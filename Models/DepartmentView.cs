using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PJ_CWN019.TM.PBM.Web.Models
{
    public class DepartmentView
    {
        public long ID { get; set; }
        public string NameTH { get; set; }
        public string NameEN { get; set; }
        public long DepartmentID { get; set; }
        public string Department { get; set; }
        public int TotalPerson { get; set; }
    }
}