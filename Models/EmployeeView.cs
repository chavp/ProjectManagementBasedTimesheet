using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PJ_CWN019.TM.PBM.Web.Models
{
    public class EmployeeView
    {
        public long ID { get; set; }
        public int EmployeeID { get; set; }
        public string FullName 
        {
            get
            {
                return NameTH + " " + LastTH;
            }

            set
            {
            }
        }
        public string NameTH { get; set; }
        public string LastTH { get; set; }
        public string NameEN { get; set; }
        public string LastEN { get; set; }
        public string Department { get; set; }
        public long DepartmentID { get; set; }
        public string Position { get; set; }
        public long PositionID { get; set; }
        public string Nickname { get; set; }
        public string Email { get; set; }
        public string StartDate { get; set; }

        public string AppRole { get; set; }

        public int TotalTimesheet { get; set; }
    }
}