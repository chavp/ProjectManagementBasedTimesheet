using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PJ_CWN019.TM.PBM.Web.Models
{
    public class ProjectView
    {
        public long ID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Display
        {
            get
            {
                if (string.IsNullOrEmpty(Code))
                {
                    return Name;
                }
                else
                {
                    return Code + ": " + Name;
                }
            }
            set
            {
            }
        }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string StringStartDate { get; set; }
        public string StringEndDate { get; set; }
        public long? CustomerID { get; set; }

        public long ProjectStatusID { get; set; }
        public string ProjectStatusName { get; set; }

        public decimal EstimateProjectValue { get; set; }
        public decimal ActualProjectCost { get; set; }

        public bool IsNonProject { get; set; }
        public int TotalTimesheet { get; set; }
    }
}