using Cwn.PM.BusinessModels.Entities;
using Cwn.PM.Reports.Values;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace PJ_CWN019.TM.PBM.Web.Models
{
    public static class ViewModelConverter
    {
        public const string DateFormat = "dd/MM/yyyy";
        public static readonly CultureInfo CultureInfoForDate = new CultureInfo("en-US");

        public static TimesheetDetail ToViewModel(this Timesheet timesheet, int index,
            Project project,
            decimal totalCost, decimal roleCost)
        {
            return new TimesheetDetail
            {
                Index = index,
                Date = timesheet.ActualStartDate.GetValueOrDefault(),
                EmployeeID = timesheet.User.EmployeeID,
                FullName = timesheet.User.FullName,

                ProjectCode = project.Code,
                ProjectName = project.NameTH,

                ProjectStartDate = project.StartDate.ToPresentDateString(),
                ProjectEndDate = project.EndDate.ToPresentDateString(),

                ProjectRole = timesheet.ProjectRole.NameTH,
                ProjectRoleOrder = timesheet.ProjectRole.Order,
                Phase = timesheet.Phase.NameTH,
                PhaseOrder = timesheet.Phase.Order,
                TaskType = timesheet.TaskType.NameTH,
                MainTask = timesheet.MainTask,
                SubTask = timesheet.SubTask,
                Hours = timesheet.ActualHourUsed,

                Cost = totalCost,
                RoleCost = roleCost,

                IsOT = timesheet.IsOT,
            };

        }

        public static DateTime FirstDayOfWeek(this DateTime date)
        {
            var candidateDate = date;
            while (candidateDate.DayOfWeek != DayOfWeek.Sunday)
            {
                candidateDate = candidateDate.AddDays(-1);
            }
            return candidateDate;
        }
        public static DateTime LastDayOfWeek()
        {
            return LastDayOfWeek(DateTime.Today);
        }
        public static DateTime LastDayOfWeek(this DateTime date)
        {
            var candidateDate = date;
            while (candidateDate.DayOfWeek != DayOfWeek.Saturday)
            {
                candidateDate = candidateDate.AddDays(1);
            }
            return candidateDate;
        }

        public static DateTime FirstDayOfWeek()
        {
            return FirstDayOfWeek(DateTime.Today);
        }

        public static string ToPresentDateString(this DateTime? row)
        {
            return (row.HasValue) ? row.Value.ToString(ViewModelConverter.DateFormat) : "N/A";
        }
    }
}