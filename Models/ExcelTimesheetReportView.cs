using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PJ_CWN019.TM.PBM.Web.Models
{
    public class ExcelTimesheetReportView
    {
        public int ReportID { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public bool CheckAllTime { get; set; }
        public long ProjectID { get; set; }
        public long EmployeeID { get; set; }
        public long DepartmentID { get; set; }
    }
}