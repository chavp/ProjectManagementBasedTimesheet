using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;

namespace PJ_CWN019.TM.PBM.Web.Controllers
{
    using NHibernate;
    using NHibernate.Linq;
    using PJ_CWN019.TM.PBM.Web.Models;
    using Cwn.PM.BusinessModels.Entities;
    using Cwn.PM.BusinessModels.Queries;
    using Cwn.PM.Reports.Values;
    using Cwn.PM.Reports;
    using PJ_CWN019.TM.PBM.Web.Filters;
    using System.Drawing;
    using PJ_CWN019.TM.PBM.Web.Models.Services;
    using System.Web.Security;

    public class ReportingController : PbmController
    {
        public ReportingController(ISessionFactory sessionFactory) : 
            base(sessionFactory){}

        [OutputCache(Duration = 60 * 5)]
        public JsonResult ReadReportType()
        {
            var viewList = new List<ReportTypeView>();

            var allReport = ReportDictionary.AllReportType;
            //ReportDictionary.AllReportType.ForEach(r =>
            //{
            //    viewList.Add(new ReportTypeView
            //    {
            //        ID = r.ID,
            //        Name = r.Name,
            //        NameEN = r.NameEN
            //    });
            //});
            if (Roles.IsUserInRole(ConstAppRoles.Staff))
            {
                // 1 - ประวัติการทำงานของบุคคล
                viewList.Add(new ReportTypeView
                {
                    ID = allReport[0].ID,
                    Name = allReport[0].Name,
                    NameEN = allReport[0].NameEN
                });
            }

            if (Roles.IsUserInRole(ConstAppRoles.Admin) ||
                Roles.IsUserInRole(ConstAppRoles.Executive) ||
                Roles.IsUserInRole(ConstAppRoles.Manager))
            {
                // 2 - ต้นทุนการทำงานของบุคคล
                viewList.Add(new ReportTypeView
                {
                    ID = allReport[1].ID,
                    Name = allReport[1].Name,
                    NameEN = allReport[1].NameEN
                });

                // 4 - ต้นทุนการทำงานของแผนก
                viewList.Add(new ReportTypeView
                {
                    ID = allReport[3].ID,
                    Name = allReport[3].Name,
                    NameEN = allReport[3].NameEN
                });

                // 5 - ต้นทุนการทำงานของโปรเจกต์
                viewList.Add(new ReportTypeView
                {
                    ID = allReport[4].ID,
                    Name = allReport[4].Name,
                    NameEN = allReport[4].NameEN
                });
            }

            if (Roles.IsUserInRole(ConstAppRoles.Admin) ||
                Roles.IsUserInRole(ConstAppRoles.Executive))
            {
                // 6 - ต้นทุนการทำงานของโปรเจกต์ทั้งหมด
                viewList.Add(new ReportTypeView
                {
                    ID = allReport[5].ID,
                    Name = allReport[5].Name,
                    NameEN = allReport[5].NameEN
                });
            }

            if (Roles.IsUserInRole(ConstAppRoles.Admin) ||
                Roles.IsUserInRole(ConstAppRoles.Manager) || 
                Roles.IsUserInRole(ConstAppRoles.Executive))
            {
                // 7 - สรุปข้อมูลการบันทึกเวลาการทำงาน
                viewList.Add(new ReportTypeView
                {
                    ID = allReport[6].ID,
                    Name = allReport[6].Name,
                    NameEN = allReport[6].NameEN
                });
            }

            var result = new
            {
                data = viewList,
                total = viewList.Count,
                success = true,
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        Color _defaultReportGridHeaderColor = Color.LightSalmon;
        public JsonResult ExportToExcelReport(ExcelTimesheetReportView exportingRequest)
        {
            string filename = "actual_effort_for_person_{0}_{1}.xlsx";
            int randomFolder = new Random(DateTime.Now.Second).Next(1, int.MaxValue);
            string fullFilepath = Server.MapPath(@"~\Export\" + randomFolder + "\\");
            string exportPath = Url.Content(@"~\Export\" + randomFolder + "\\");
            if (!Directory.Exists(fullFilepath))
            {
                Directory.CreateDirectory(fullFilepath);
            }

            string message = string.Empty;
            bool success = true;

            var fromDate = exportingRequest.FromDate;
            var toDate = exportingRequest.ToDate;

            var reportType = ReportDictionary.GetReportTypeByReportID(exportingRequest.ReportID);

            if (exportingRequest.ReportID == 7)
            {
                #region 7 - สรุปข้อมูลการบันทึกเวลาการทำงาน
                var timesheetDataRecording = new TimesheetDataRecording(fromDate, toDate)
                {
                    Title = reportType.Name,
                    GridHeader = _defaultReportGridHeaderColor,

                    EffortHoursTitle = ReportDictionary.ReportTextTH["EffortHoursTitle"],
                    DateTitle = ReportDictionary.ReportTextTH["DateLabel"],
                    NoTitle = ReportDictionary.ReportTextTH["NoColumnLabel"],
                    DivisionTitle = ReportDictionary.ReportTextTH["DivisionColumnLabel"],
                    DepartmentTitle = ReportDictionary.ReportTextTH["DepartmentLabel"],
                    EmployeeIDTitle = ReportDictionary.ReportTextTH["EmployeeIDColumnLabel"],
                    FullNameTitle = ReportDictionary.ReportTextTH["FullNameColumnLabel"],
                    PositionTitle = ReportDictionary.ReportTextTH["PositionLabel"],
                    EmailTitle = ReportDictionary.ReportTextTH["EmailColumnLabel"],
                    TotalEffortTitle = ReportDictionary.ReportTextTH["TotalEffortColumnLabel"],
                };

                using (var session = _sessionFactory.OpenSession())
                {
                    var user = TimesheetService.GetCurrentLoginUser(session);

                    var allUser = (from u in session.Query<User>()
                                   orderby u.Department.Division.NameTH, u.Department.NameTH, u.FirstNameTH, u.LastNameTH
                                   where !u.Department.NameEN.Contains("__SYSTEM__")
                                   && u.EndDate == null
                                   select u).ToList();

                    if (Roles.IsUserInRole(ConstAppRoles.Manager))
                    {
                        allUser = allUser.Where(x => x.Department == user.Department).ToList();
                    }

                    var allTimesheet = (from t in session.Query<Timesheet>()
                                        orderby t.User.Department.Division.NameTH, t.User.Department.NameTH, t.User.FirstNameTH, t.User.LastNameTH
                                        where fromDate <= t.ActualStartDate
                                   && t.ActualStartDate <= toDate
                                        select t).ToList();


                    var queryTimesheet = (from u in allUser
                                          join t in allTimesheet on u equals t.User into u_t
                                          from ut in u_t.DefaultIfEmpty()
                                          select new
                                          {
                                              User = u,
                                              Timesheet = ut,
                                          }).ToList();

                    foreach (var t in queryTimesheet)
                    {
                        string poName = (t.User.Position != null) ? t.User.Position.NameTH : string.Empty;
                        if (t.Timesheet != null)
                        {
                            var td = new TimesheetDetail
                            {
                                EmployeeID = t.User.EmployeeID,
                                FullName = string.Format("{0} {1}", t.User.FirstNameTH, t.User.LastNameTH),
                                Email = t.User.Email,
                                PositionName = poName,
                                DivisionName = t.User.Department.Division.NameTH,
                                DepartmentName = t.User.Department.NameTH,
                                Date = t.Timesheet.ActualStartDate.GetValueOrDefault(),
                                Hours = t.Timesheet.ActualHourUsed,
                            };
                            timesheetDataRecording.Details.Add(td);
                        }
                        else
                        {
                            var td = new TimesheetDetail
                            {
                                EmployeeID = t.User.EmployeeID,
                                FullName = string.Format("{0} {1}", t.User.FirstNameTH, t.User.LastNameTH),
                                Email = t.User.Email,
                                PositionName = poName,
                                DivisionName = t.User.Department.Division.NameTH,
                                DepartmentName = t.User.Department.NameTH,
                                Date = DateTime.MinValue,
                                Hours = 0,
                            };

                            timesheetDataRecording.Details.Add(td);
                        }
                    }
                }

                filename = "timesheet_data_recording_{0}.xlsx";
                filename = string.Format(filename, DateTime.Now.ToString("yyyyMMdd"));
                fullFilepath = fullFilepath + filename;
                timesheetDataRecording.WriteExcel(fullFilepath);
                #endregion

                return Json(new
                {
                    exportUrl = exportPath + filename,
                    success = success,
                    message = message,
                }, JsonRequestBehavior.AllowGet);
            }

            var listOfProjectHeader = new List<ProjectHeader>();
            var listOfActualCostForProject = new List<ActualCostForProject>();

            int employeeID = 0;
            string fullName = string.Empty;
            string positionName = string.Empty;
            string departmentName = string.Empty;
            string projectCode = string.Empty;
            string projectRoleName = string.Empty;
            using (var session = _sessionFactory.OpenSession())
            {
                var allTimesheet = (from t in session.Query<Timesheet>()
                                    where fromDate <= t.ActualStartDate &&
                                    t.ActualStartDate <= toDate
                                    select t);

                var me = TimesheetService.GetCurrentLoginUser(session);

                if (exportingRequest.ReportID == 1
                    || exportingRequest.ReportID == 2)
                {
                    if (Roles.IsUserInRole(ConstAppRoles.Staff))
                    {
                        var projectRole = (from m in session.Query<ProjectRole>()
                                           where m.NameTH == me.Position.NameTH
                                           select m).Single();

                        projectRoleName = projectRole.NameTH;

                        employeeID = me.EmployeeID;
                        fullName = me.FullName;
                        positionName = me.Position.NameTH;
                        departmentName = me.Department.NameTH;

                        allTimesheet = allTimesheet.Where(t => t.User == me);
                    }
                    else if (Roles.IsUserInRole(ConstAppRoles.Manager) ||
                        Roles.IsUserInRole(ConstAppRoles.Admin) ||
                        Roles.IsUserInRole(ConstAppRoles.Executive))
                    {
                        var userTarget = (from u in session.Query<User>()
                                          where u.ID == exportingRequest.EmployeeID
                                          select u).Single();

                        var projectRole = (from m in session.Query<ProjectRole>()
                                           where m.NameTH == userTarget.Position.NameTH
                                           select m).Single();

                        projectRoleName = projectRole.NameTH;

                        employeeID = userTarget.EmployeeID;
                        fullName = userTarget.FullName;
                        positionName = userTarget.Position.NameTH;
                        departmentName = userTarget.Department.NameTH;

                        allTimesheet = allTimesheet.Where(t => t.User == userTarget);
                    }
                }
                else if (exportingRequest.ReportID == 3
                    || exportingRequest.ReportID == 4)
                {
                    if (Roles.IsUserInRole(ConstAppRoles.Manager))
                    {
                        departmentName = me.Department.NameTH;
                        allTimesheet = allTimesheet.Where(t => t.ActualUserDepartment.ID == me.Department.ID);
                    }
                    else
                    {
                        var departMent = (from d in session.Query<Department>()
                                          where d.ID == exportingRequest.DepartmentID
                                          select d).Single();

                        departmentName = departMent.NameTH;
                        allTimesheet = allTimesheet.Where(t => t.ActualUserDepartment == departMent);
                    }
                }
                else if (exportingRequest.ReportID == 5)
                {
                    allTimesheet = allTimesheet.Where(t => t.Project.ID == exportingRequest.ProjectID);
                }
                else if (exportingRequest.ReportID == 6)
                {
                    //allTimesheet = allTimesheet.Where(t => !t.Project.IsNonProject);
                }

                var grpByProject = (from gm in allTimesheet
                                    group gm by gm.Project into gmG
                                    select new
                                    {
                                        Project = gmG.Key,
                                        Timesheets = gmG.ToList()
                                    }).ToList();

                foreach (var pro in grpByProject)
                {
                    projectCode = pro.Project.Code;

                    // นับจากจำนวนสมาชิก ที่กรอก timesheet
                    var membersCount = (from t in session.Query<Timesheet>()
                                        where t.Project == pro.Project
                                        select t.User).Distinct().Count();

                    //var membersCount = pro.Project.TimeSheets.Select(t => t.User).Distinct().Count();

                    var header1 = new ProjectHeader
                    {
                        ProjectCode = pro.Project.Code,
                        ProjectName = pro.Project.NameTH,
                        Members = membersCount,

                        CurrentProjectRole = projectRoleName, // ตำแหน่งปัจจุบันในโครงการ
                    };
                    listOfProjectHeader.Add(header1);

                    if (exportingRequest.ReportID == 5)
                    {
                        var actualCostForProject = new ActualCostForProject
                        {
                            DisplayOverTime = true,
                            OTColumnLabel = ReportDictionary.ReportTextTH["OTColumnLabel"],

                            FromDate = fromDate,
                            ToDate = toDate,
                            ProjectStartDate = pro.Project.StartDate.ToPresentDateString(),
                            ProjectEndDate = pro.Project.EndDate.ToPresentDateString(),

                            ProjectNameLabel = ReportDictionary.ReportTextTH["ProjectNameLabel"],
                            ProjectCodeLabel = ReportDictionary.ReportTextTH["ProjectCodeLabel"],

                            NoColumnLabel = ReportDictionary.ReportTextTH["NoColumnLabel"],
                            DateColumnLabel = ReportDictionary.ReportTextTH["DateColumnLabel"],
                            ProjectCodeColumnLabel = ReportDictionary.ReportTextTH["ProjectCodeColumnLabel"],
                            PhaseColumnLabel = ReportDictionary.ReportTextTH["PhaseColumnLabel"],
                            TaskTypeColumnLabel = ReportDictionary.ReportTextTH["TaskTypeColumnLabel"],
                            MainTaskColumnLabel = ReportDictionary.ReportTextTH["MainTaskColumnLabel"],
                            SubTaskColumnLabel = ReportDictionary.ReportTextTH["SubTaskColumnLabel"],
                            ProjectRoleColumnLabel = ReportDictionary.ReportTextTH["ProjectRoleColumnLabel"],
                            HoursColumnLabel = ReportDictionary.ReportTextTH["HoursColumnLabel"],
                            PercentangeHoursColumnLabel = ReportDictionary.ReportTextTH["PercentangeHoursColumnLabel"],
                            CostColumnLabel = ReportDictionary.ReportTextTH["CostColumnLabel"],
                            PercentangeCostColumnLabel = ReportDictionary.ReportTextTH["PercentangeCostColumnLabel"],
                            RoleCostColumnLabel = ReportDictionary.ReportTextTH["RoleCostColumnLabel"],
                            MemberColumnLabel = ReportDictionary.ReportTextTH["MemberColumnLabel"],
                            EmployeeIDColumnLabel = ReportDictionary.ReportTextTH["EmployeeIDColumnLabel"],
                            FullNameColumnLabel = ReportDictionary.ReportTextTH["FullNameColumnLabel"],
                            PeriodColumnLabel = ReportDictionary.ReportTextTH["PeriodColumnLabel"],
                            AccumulatedCostColumnLabel = ReportDictionary.ReportTextTH["AccumulatedCostColumnLabel"],

                            GridHeader = _defaultReportGridHeaderColor,
                        };
                        listOfActualCostForProject.Add(actualCostForProject);

                        actualCostForProject.DetailHeaders.Add(header1);
                        actualCostForProject.ProjectCode = header1.ProjectCode;
                        actualCostForProject.ProjectName = header1.ProjectName;
                    }

                    //fill only memebr timesheet

                    var timesheets = (from t in session.Query<Timesheet>()
                                    where t.Project == pro.Project
                                    && fromDate <= t.ActualStartDate 
                                    && t.ActualStartDate <= toDate
                                    select t).ToList();

                    int index = 0;
                    foreach (var item in timesheets)
                    {
                        ++index;
                        decimal roleCost = 0;
                        decimal totalCost = 0;

                        if (exportingRequest.ReportID == 2
                            || exportingRequest.ReportID == 4
                            || exportingRequest.ReportID == 5
                            || exportingRequest.ReportID == 6)
                        {
                            roleCost = item.ProjectRole.ProjectRoleRates
                                                    .GetEffectiveRatePerHours(item.ActualStartDate)
                                                    .FirstOrDefault();

                            totalCost = item.ActualHourUsed * roleCost;
                        }

                        var detail = item.ToViewModel(index, pro.Project, totalCost, roleCost);
                        header1.Details.Add(detail);
                    }
                }

            }

            if (listOfProjectHeader.Count == 0)
            {
                if (listOfProjectHeader.Count() == 0)
                {
                    return Json(new
                    {
                        success = false,
                        message = "ไม่พบข้อมูลการบันทึกเวลาทำงานของรายงานนี้",
                    }, JsonRequestBehavior.AllowGet);
                }
            }

            string newDepartmentName = departmentName.Replace("&", "and");

            switch (exportingRequest.ReportID)
            {
                case 1: // ประวัติการทำงานของบุคคล
                    var actualEffortForPerson = new ActualEffortForPerson
                    {
                        DisplayOverTime = true,
                        OTColumnLabel = ReportDictionary.ReportTextTH["OTColumnLabel"],

                        FromDate = fromDate,
                        ToDate = toDate,
                        Title = reportType.Name,

                        SummaryByDateTitle = ReportDictionary.ReportTextTH["SummaryByDateTitle"],
                        SummaryByProjectTitle = ReportDictionary.ReportTextTH["SummaryByProjectTitle"],
                        SummaryByTaskTypeTitle = ReportDictionary.ReportTextTH["SummaryByTaskTypeTitle"],
                        SummaryByProjectRoleTitle = ReportDictionary.ReportTextTH["SummaryByProjectRoleTitle"],
                        DetailTitle = ReportDictionary.ReportTextTH["DetailTitle"],

                        DateLabel = ReportDictionary.ReportTextTH["DateLabel"],
                        EmployeeIDLabel = ReportDictionary.ReportTextTH["EmployeeIDLabel"],
                        FullNameLabel = ReportDictionary.ReportTextTH["FullNameLabel"],
                        DepartmentLabel = ReportDictionary.ReportTextTH["DepartmentLabel"],
                        PositionLabel = ReportDictionary.ReportTextTH["PositionLabel"],
                        ProjectNameLabel = ReportDictionary.ReportTextTH["ProjectNameLabel"],
                        ProjectCodeLabel = ReportDictionary.ReportTextTH["ProjectCodeLabel"],

                        NoColumnLabel = ReportDictionary.ReportTextTH["NoColumnLabel"],
                        DateColumnLabel = ReportDictionary.ReportTextTH["DateColumnLabel"],
                        ProjectCodeColumnLabel = ReportDictionary.ReportTextTH["ProjectCodeColumnLabel"],
                        PhaseColumnLabel = ReportDictionary.ReportTextTH["PhaseColumnLabel"],
                        TaskTypeColumnLabel = ReportDictionary.ReportTextTH["TaskTypeColumnLabel"],
                        MainTaskColumnLabel = ReportDictionary.ReportTextTH["MainTaskColumnLabel"],
                        SubTaskColumnLabel = ReportDictionary.ReportTextTH["SubTaskColumnLabel"],
                        ProjectRoleColumnLabel = ReportDictionary.ReportTextTH["ProjectRoleColumnLabel"],
                        HoursColumnLabel = ReportDictionary.ReportTextTH["HoursColumnLabel"],

                        GridHeader = _defaultReportGridHeaderColor,
                    };

                    actualEffortForPerson.EmployeeID = employeeID;
                    actualEffortForPerson.FullName = fullName;
                    actualEffortForPerson.Position = positionName;
                    actualEffortForPerson.Department = departmentName;

                    foreach (var header1 in listOfProjectHeader)
                    {
                        actualEffortForPerson.DetailHeaders.Add(header1);
                    }

                    filename = "actual_effort_for_person_{0}_{1}.xlsx";
                    filename = string.Format(filename, actualEffortForPerson.EmployeeID, DateTime.Now.ToString("yyyyMMdd"));
                    fullFilepath = fullFilepath + filename;
                    actualEffortForPerson.WriteExcel(fullFilepath);

                    break;
                case 2: // ต้นทุนการทำงานของบุคคล
                    var actualCostForPerson = new ActualCostForPerson
                    {
                        DisplayOverTime = true,
                        OTColumnLabel = ReportDictionary.ReportTextTH["OTColumnLabel"],

                        FromDate = fromDate,
                        ToDate = toDate,
                        Title = reportType.Name,

                        SummaryByDateTitle = ReportDictionary.ReportTextTH["SummaryByDateTitle"],
                        SummaryByProjectTitle = ReportDictionary.ReportTextTH["SummaryByProjectTitle"],
                        SummaryByTaskTypeTitle = ReportDictionary.ReportTextTH["SummaryByTaskTypeTitle"],
                        SummaryByProjectRoleTitle = ReportDictionary.ReportTextTH["SummaryByProjectRoleTitle"],
                        DetailTitle = ReportDictionary.ReportTextTH["DetailTitle"],

                        DateLabel = ReportDictionary.ReportTextTH["DateLabel"],
                        EmployeeIDLabel = ReportDictionary.ReportTextTH["EmployeeIDLabel"],
                        FullNameLabel = ReportDictionary.ReportTextTH["FullNameLabel"],
                        DepartmentLabel = ReportDictionary.ReportTextTH["DepartmentLabel"],
                        PositionLabel = ReportDictionary.ReportTextTH["PositionLabel"],
                        ProjectNameLabel = ReportDictionary.ReportTextTH["ProjectNameLabel"],
                        ProjectCodeLabel = ReportDictionary.ReportTextTH["ProjectCodeLabel"],

                        NoColumnLabel = ReportDictionary.ReportTextTH["NoColumnLabel"],
                        DateColumnLabel = ReportDictionary.ReportTextTH["DateColumnLabel"],
                        ProjectCodeColumnLabel = ReportDictionary.ReportTextTH["ProjectCodeColumnLabel"],
                        PhaseColumnLabel = ReportDictionary.ReportTextTH["PhaseColumnLabel"],
                        TaskTypeColumnLabel = ReportDictionary.ReportTextTH["TaskTypeColumnLabel"],
                        MainTaskColumnLabel = ReportDictionary.ReportTextTH["MainTaskColumnLabel"],
                        SubTaskColumnLabel = ReportDictionary.ReportTextTH["SubTaskColumnLabel"],
                        ProjectRoleColumnLabel = ReportDictionary.ReportTextTH["ProjectRoleColumnLabel"],
                        HoursColumnLabel = ReportDictionary.ReportTextTH["HoursColumnLabel"],
                        PercentangeHoursColumnLabel = ReportDictionary.ReportTextTH["PercentangeHoursColumnLabel"],
                        CostColumnLabel = ReportDictionary.ReportTextTH["CostColumnLabel"],
                        PercentangeCostColumnLabel = ReportDictionary.ReportTextTH["PercentangeCostColumnLabel"],
                        RoleCostColumnLabel = ReportDictionary.ReportTextTH["RoleCostColumnLabel"],

                        GridHeader = _defaultReportGridHeaderColor,
                    };

                    actualCostForPerson.EmployeeID = employeeID;
                    actualCostForPerson.FullName = fullName;
                    actualCostForPerson.Position = positionName;
                    actualCostForPerson.Department = departmentName;

                    foreach (var header1 in listOfProjectHeader)
                    {
                        actualCostForPerson.DetailHeaders.Add(header1);
                    }

                    filename = "actual_cost_for_person_{0}_{1}.xlsx";
                    filename = string.Format(filename, actualCostForPerson.EmployeeID, DateTime.Now.ToString("yyyyMMdd"));
                    fullFilepath = fullFilepath + filename;
                    actualCostForPerson.WriteExcel(fullFilepath);
                    break;

                case 3: // ประวัติการทำงานของแผนก
                    var report = new ActualCostForDepartment
                    {
                        DisplayOverTime = true,
                        OTColumnLabel = ReportDictionary.ReportTextTH["OTColumnLabel"],

                        FromDate = fromDate,
                        ToDate = toDate,
                        Title = reportType.Name,

                        IsDisplayCost = false,

                        SummaryByDateTitle = ReportDictionary.ReportTextTH["SummaryByDateTitle"],
                        SummaryByProjectTitle = ReportDictionary.ReportTextTH["SummaryByProjectTitle"],
                        SummaryByTaskTypeTitle = ReportDictionary.ReportTextTH["SummaryByTaskTypeTitle"],
                        SummaryByProjectRoleTitle = ReportDictionary.ReportTextTH["SummaryByProjectRoleTitle"],
                        DetailTitle = ReportDictionary.ReportTextTH["DetailOfPersonTitle"],
                        SummaryByPersonTitle = ReportDictionary.ReportTextTH["SummaryByPersonTitle"],
                        DetailOfProjectTitle = ReportDictionary.ReportTextTH["DetailOfProjectTitle"],

                        DateLabel = ReportDictionary.ReportTextTH["DateLabel"],
                        EmployeeIDLabel = ReportDictionary.ReportTextTH["EmployeeIDLabel"],
                        FullNameLabel = ReportDictionary.ReportTextTH["FullNameLabel"],
                        DepartmentLabel = ReportDictionary.ReportTextTH["DepartmentLabel"],
                        PositionLabel = ReportDictionary.ReportTextTH["PositionLabel"],
                        ProjectNameLabel = ReportDictionary.ReportTextTH["ProjectNameLabel"],
                        ProjectCodeLabel = ReportDictionary.ReportTextTH["ProjectCodeLabel"],

                        NoColumnLabel = ReportDictionary.ReportTextTH["NoColumnLabel"],
                        DateColumnLabel = ReportDictionary.ReportTextTH["DateColumnLabel"],
                        ProjectCodeColumnLabel = ReportDictionary.ReportTextTH["ProjectCodeColumnLabel"],
                        PhaseColumnLabel = ReportDictionary.ReportTextTH["PhaseColumnLabel"],
                        TaskTypeColumnLabel = ReportDictionary.ReportTextTH["TaskTypeColumnLabel"],
                        MainTaskColumnLabel = ReportDictionary.ReportTextTH["MainTaskColumnLabel"],
                        SubTaskColumnLabel = ReportDictionary.ReportTextTH["SubTaskColumnLabel"],
                        ProjectRoleColumnLabel = ReportDictionary.ReportTextTH["ProjectRoleColumnLabel"],
                        HoursColumnLabel = ReportDictionary.ReportTextTH["HoursColumnLabel"],
                        PercentangeHoursColumnLabel = ReportDictionary.ReportTextTH["PercentangeHoursColumnLabel"],
                        CostColumnLabel = ReportDictionary.ReportTextTH["CostColumnLabel"],
                        PercentangeCostColumnLabel = ReportDictionary.ReportTextTH["PercentangeCostColumnLabel"],
                        RoleCostColumnLabel = ReportDictionary.ReportTextTH["RoleCostColumnLabel"],
                        MemberColumnLabel = ReportDictionary.ReportTextTH["MemberColumnLabel"],

                        EmployeeIDColumnLabel = ReportDictionary.ReportTextTH["EmployeeIDColumnLabel"],
                        FullNameColumnLabel = ReportDictionary.ReportTextTH["FullNameColumnLabel"],

                        GridHeader = _defaultReportGridHeaderColor,
                    };

                    report.EmployeeID = employeeID;
                    report.FullName = fullName;
                    report.Position = positionName;
                    report.Department = departmentName;

                    foreach (var header1 in listOfProjectHeader)
                    {
                        report.DetailHeaders.Add(header1);
                    }

                    //for all
                    filename = "actual_effort_for_department_{0}_{1}.xlsx";
                    filename = string.Format(filename, newDepartmentName, DateTime.Now.ToString("yyyyMMdd"));
                    fullFilepath = fullFilepath + filename;
                    report.WriteExcel(fullFilepath, false);

                    break;
                case 4: // ต้นทุนการทำงานของแผนก
                    var reportCost = new ActualCostForDepartment
                    {
                        DisplayOverTime = true,
                        OTColumnLabel = ReportDictionary.ReportTextTH["OTColumnLabel"],

                        FromDate = fromDate,
                        ToDate = toDate,
                        Title = reportType.Name,

                        IsDisplayCost = true,

                        SummaryByDateTitle = ReportDictionary.ReportTextTH["SummaryByDateTitle"],
                        SummaryByProjectTitle = ReportDictionary.ReportTextTH["SummaryByProjectTitle"],
                        SummaryByTaskTypeTitle = ReportDictionary.ReportTextTH["SummaryByTaskTypeTitle"],
                        SummaryByProjectRoleTitle = ReportDictionary.ReportTextTH["SummaryByProjectRoleTitle"],
                        DetailTitle = ReportDictionary.ReportTextTH["DetailOfPersonTitle"],
                        SummaryByPersonTitle = ReportDictionary.ReportTextTH["SummaryByPersonTitle"],
                        DetailOfProjectTitle = ReportDictionary.ReportTextTH["DetailOfProjectTitle"],

                        DateLabel = ReportDictionary.ReportTextTH["DateLabel"],
                        EmployeeIDLabel = ReportDictionary.ReportTextTH["EmployeeIDLabel"],
                        FullNameLabel = ReportDictionary.ReportTextTH["FullNameLabel"],
                        DepartmentLabel = ReportDictionary.ReportTextTH["DepartmentLabel"],
                        PositionLabel = ReportDictionary.ReportTextTH["PositionLabel"],
                        ProjectNameLabel = ReportDictionary.ReportTextTH["ProjectNameLabel"],
                        ProjectCodeLabel = ReportDictionary.ReportTextTH["ProjectCodeLabel"],

                        NoColumnLabel = ReportDictionary.ReportTextTH["NoColumnLabel"],
                        DateColumnLabel = ReportDictionary.ReportTextTH["DateColumnLabel"],
                        ProjectCodeColumnLabel = ReportDictionary.ReportTextTH["ProjectCodeColumnLabel"],
                        PhaseColumnLabel = ReportDictionary.ReportTextTH["PhaseColumnLabel"],
                        TaskTypeColumnLabel = ReportDictionary.ReportTextTH["TaskTypeColumnLabel"],
                        MainTaskColumnLabel = ReportDictionary.ReportTextTH["MainTaskColumnLabel"],
                        SubTaskColumnLabel = ReportDictionary.ReportTextTH["SubTaskColumnLabel"],
                        ProjectRoleColumnLabel = ReportDictionary.ReportTextTH["ProjectRoleColumnLabel"],
                        HoursColumnLabel = ReportDictionary.ReportTextTH["HoursColumnLabel"],
                        PercentangeHoursColumnLabel = ReportDictionary.ReportTextTH["PercentangeHoursColumnLabel"],
                        CostColumnLabel = ReportDictionary.ReportTextTH["CostColumnLabel"],
                        PercentangeCostColumnLabel = ReportDictionary.ReportTextTH["PercentangeCostColumnLabel"],
                        RoleCostColumnLabel = ReportDictionary.ReportTextTH["RoleCostColumnLabel"],
                        MemberColumnLabel = ReportDictionary.ReportTextTH["MemberColumnLabel"],

                        EmployeeIDColumnLabel = ReportDictionary.ReportTextTH["EmployeeIDColumnLabel"],
                        FullNameColumnLabel = ReportDictionary.ReportTextTH["FullNameColumnLabel"],

                        GridHeader = _defaultReportGridHeaderColor,
                    };

                    reportCost.EmployeeID = employeeID;
                    reportCost.FullName = fullName;
                    reportCost.Position = positionName;
                    reportCost.Department = departmentName;

                    foreach (var header1 in listOfProjectHeader)
                    {
                        reportCost.DetailHeaders.Add(header1);
                    }

                    //for all
                    filename = "actual_cost_for_department_{0}_{1}.xlsx";
                    filename = string.Format(filename, newDepartmentName, DateTime.Now.ToString("yyyyMMdd"));
                    fullFilepath = fullFilepath + filename;
                    reportCost.WriteExcel(fullFilepath, false);

                    break;
                case 5:// ต้นทุนการทำงานของโครงการ

                    var actualCostForProjects = new ActualCostForProjects
                    {
                        DisplayOverTime = true,
                        OTColumnLabel = ReportDictionary.ReportTextTH["OTColumnLabel"],

                        Title = reportType.Name,
                        FromDate = fromDate,
                        ToDate = toDate,

                        DateLabel = ReportDictionary.ReportTextTH["DateLabel"],

                        SummaryByPersonTitle = ReportDictionary.ReportTextTH["SummaryByPersonTitle"],
                        SummaryByPhaseTitle = ReportDictionary.ReportTextTH["SummaryByPhaseTitle"],
                        SummaryByTaskTypeTitle = ReportDictionary.ReportTextTH["SummaryByTypeOfPhaseTitle"],
                        SummaryByWeekTitle = ReportDictionary.ReportTextTH["SummaryByWeekTitle"],
                        SummaryByProjectRoleTitle = ReportDictionary.ReportTextTH["SummaryByProjectRoleTitle"],
                        DetailTitle = ReportDictionary.ReportTextTH["DetailTitle"],

                        GridHeader = _defaultReportGridHeaderColor,
                    };
                    foreach (var actualCostForProject in listOfActualCostForProject)
                    {
                        actualCostForProjects.ActualCostForProjectList.Add(actualCostForProject);
                    }

                    filename = "actual_cost_for_project_{0}_{1}.xlsx";
                    filename = string.Format(filename, projectCode, DateTime.Now.ToString("yyyyMMdd"));
                    fullFilepath = fullFilepath + filename;
                    actualCostForProjects.WriteExcel(fullFilepath, false);

                    break;
                case 6:// ต้นทุนการทำงานของโครงการทั้งหมด
                    var actualCostForAllProject = new ActualCostForAllProject
                    {
                        DisplayOverTime = true,
                        OTColumnLabel = ReportDictionary.ReportTextTH["OTColumnLabel"],

                        Title = reportType.Name,
                        FromDate = fromDate,
                        ToDate = toDate,

                        DetailTitle = ReportDictionary.ReportTextTH["DetailTitle"],
                        PhaseTitle = ReportDictionary.ReportTextTH["PhaseTitle"],
                        RoleTitle = ReportDictionary.ReportTextTH["RoleTitle"],

                        DateLabel = ReportDictionary.ReportTextTH["DateLabel"],
                        ProjectNameLabel = ReportDictionary.ReportTextTH["ProjectNameLabel"],
                        ProjectCodeLabel = ReportDictionary.ReportTextTH["ProjectCodeLabel"],

                        NoColumnLabel = ReportDictionary.ReportTextTH["NoColumnLabel"],
                        DateColumnLabel = ReportDictionary.ReportTextTH["DateColumnLabel"],
                        DaysColumnLabel = ReportDictionary.ReportTextTH["DaysColumnLabel"],
                        ProjectCodeColumnLabel = ReportDictionary.ReportTextTH["ProjectCodeColumnLabel"],
                        PhaseColumnLabel = ReportDictionary.ReportTextTH["PhaseColumnLabel"],
                        TaskTypeColumnLabel = ReportDictionary.ReportTextTH["TaskTypeColumnLabel"],
                        MainTaskColumnLabel = ReportDictionary.ReportTextTH["MainTaskColumnLabel"],
                        SubTaskColumnLabel = ReportDictionary.ReportTextTH["SubTaskColumnLabel"],
                        ProjectRoleColumnLabel = ReportDictionary.ReportTextTH["ProjectRoleColumnLabel"],
                        HoursColumnLabel = ReportDictionary.ReportTextTH["HoursColumnLabel"],
                        PercentangeHoursColumnLabel = ReportDictionary.ReportTextTH["PercentangeHoursColumnLabel"],
                        CostColumnLabel = ReportDictionary.ReportTextTH["CostColumnLabel"],
                        PercentangeCostColumnLabel = ReportDictionary.ReportTextTH["PercentangeCostColumnLabel"],
                        RoleCostColumnLabel = ReportDictionary.ReportTextTH["RoleCostColumnLabel"],
                        MemberColumnLabel = ReportDictionary.ReportTextTH["MemberColumnLabel"],

                        GridHeader = _defaultReportGridHeaderColor,
                    };
                    foreach (var header1 in listOfProjectHeader)
                    {
                        actualCostForAllProject.DetailHeaders.Add(header1);
                    }
                    filename = "actual_cost_for_all_project_{0}.xlsx";
                    filename = string.Format(filename, DateTime.Now.ToString("yyyyMMdd"));
                    fullFilepath = fullFilepath + filename;
                    actualCostForAllProject.WriteExcel(fullFilepath);

                    break;

                default:
                    break;
            }

            return Json(new
            {
                exportUrl = exportPath + filename,
                success = success,
                message = message,
            }, JsonRequestBehavior.AllowGet);
        }
    }
}
