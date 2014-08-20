using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PJ_CWN019.TM.PBM.Web.Controllers
{
    using Cwn.PM.BusinessModels.Entities;
    using NHibernate;
    using NHibernate.Linq;
    using PJ_CWN019.TM.PBM.Web.Filters;
    using PJ_CWN019.TM.PBM.Web.Models;
    using PJ_CWN019.TM.PBM.Web.Models.Services;
    using System.Web.Security;

    public class TimesheetController : PbmController
    {
        public TimesheetController(ISessionFactory sessionFactory) : 
            base(sessionFactory){}

        public JsonResult ReadTimesheet(
            int projectID, string fromDateText, string toDateText,
            int start, int limit)
        {
            var viewList = new List<TimesheetView>();
            int count;

            var fromDate = DateTime.ParseExact(fromDateText, ViewModelConverter.DateFormat, ViewModelConverter.CultureInfoForDate);
            var toDate = DateTime.ParseExact(toDateText, ViewModelConverter.DateFormat, ViewModelConverter.CultureInfoForDate);

            using (var session = _sessionFactory.OpenSession())
            {
                var user = TimesheetService.GetCurrentLoginUser(session);

                var q = from t in session.Query<Timesheet>()
                        where fromDate <= t.ActualStartDate && t.ActualStartDate <= toDate
                        && t.User == user
                        select t;

                if (projectID > 0)
                {
                    q = q.Where(t => t.Project.ID == projectID);
                }

                q = q.OrderByDescending(t => t.ActualStartDate);
                q = q.OrderByDescending(t => t.CreatedAt);
                q = q.OrderBy(t => t.Project.Code);

                count = q.Count();

                //var order = q.OrderByDescending(t => new { t.ActualStartDate, t.CreatedAt });

                foreach (var timesheet in q.Skip(start).Take(limit))
                {
                    viewList.Add(new TimesheetView
                    {
                        ID = timesheet.ID.ToString(),
                        GuidID = timesheet.ID,
                        ProjectID = timesheet.Project.ID,
                        ProjectCode = timesheet.Project.Code,
                        ProjectName = timesheet.Project.NameTH,
                        StartDate = timesheet.ActualStartDate.GetValueOrDefault(),
                        StartDateText = timesheet.ActualStartDate.GetValueOrDefault().ToString(ViewModelConverter.DateFormat),
                        PhaseID = timesheet.Phase.ID,
                        Phase = timesheet.Phase.NameTH,
                        TaskTypeID = timesheet.TaskType.ID,
                        TaskType = timesheet.TaskType.NameTH,
                        MainTaskDesc = timesheet.MainTask,
                        SubTaskDesc = timesheet.SubTask,
                        HourUsed = timesheet.ActualHourUsed,
                        IsOT = timesheet.IsOT,
                    });
                }
            }

            var result = new
            {
                data = viewList,
                total = count,
                success = true,
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ReadPhase()
        {
            var viewList = new List<PhaseView>();

            using (var session = _sessionFactory.OpenStatelessSession())
            {
                var q = from p in session.Query<Phase>()
                        select p;

                q = q.OrderBy(p => p.Order);
                foreach (var p in q)
                {
                    bool containsTimesheet = false;
                    if (!IsStaff)
                    {
                        containsTimesheet = (from t in session.Query<Timesheet>()
                                                  where t.Phase == p
                                                  select t).Count() > 0;
                    }
                    viewList.Add(new PhaseView
                    {
                        ID = p.ID,
                        Name = p.NameTH,
                        Order = p.Order,
                        ContainsTimesheet = containsTimesheet
                    });
                }
            }

            var result = new
            {
                data = viewList,
                total = viewList.Count,
                success = true,
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ReadTaskType()
        {
            var viewList = new List<TaskTypeView>();

            using (var session = _sessionFactory.OpenStatelessSession())
            {
                var q = from p in session.Query<TaskType>()
                        select p;

                q = q.OrderBy(p => p.Order);
                foreach (var p in q)
                {
                    bool containsTimesheet = false;
                    if (!IsStaff)
                    {
                        containsTimesheet = (from t in session.Query<Timesheet>()
                                             where t.TaskType == p
                                             select t).Count() > 0;
                    }
                    viewList.Add(new TaskTypeView
                    {
                        ID = p.ID,
                        Name = p.NameTH,
                        Order = p.Order,
                        ContainsTimesheet = containsTimesheet,
                    });
                }
            }

            var result = new
            {
                data = viewList,
                total = viewList.Count,
                success = true,
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ReadMainTask(string query)
        {
            var viewList = new List<MainTaskView>();

            using (var session = _sessionFactory.OpenStatelessSession())
            {
                query = query ?? string.Empty;

                var q = from p in session.Query<MainTask>()
                        where p.Desc.Contains(query)
                        select p;

                q = q.OrderBy(mt => mt.Desc);
                foreach (var p in q)
                {
                    viewList.Add(new MainTaskView
                    {
                        ID = p.ID,
                        Name = p.Desc,
                    });
                }
            }

            var result = new
            {
                data = viewList,
                total = viewList.Count,
                success = true,
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveTimesheet(TimesheetView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var me = TimesheetService.GetCurrentLoginUser(session);

                var startDate = DateTime.ParseExact(model.StartDateText,
                    ViewModelConverter.DateFormat,
                    ViewModelConverter.CultureInfoForDate);

                // ActualHourUsed guard
                var totalHourUsed = (from t in session.Query<Timesheet>()
                                     where t.User == me
                                     && t.ActualStartDate == startDate
                                     select t.ActualHourUsed).ToList().Sum();

                if (totalHourUsed + model.HourUsed > 24)
                {
                    return Json(new 
                    { 
                        success = false, 
                        message = "ท่านเพิ่มเวลาที่ใช้ในการทำงานเกิน 24 ชั่วโมง/วัน แล้ว" 
                    }, JsonRequestBehavior.AllowGet);
                }
                // end

                var project = (from p in session.Query<Project>()
                               where p.ID == model.ProjectID
                               select p).Single();

                ProjectRole projectRole = null;
                if (!project.IsNonProject)
                {
                    projectRole = (from m in session.Query<ProjectRole>()
                                   where m.NameTH == me.Position.NameTH
                                   select m).Single();
                }
                else
                {
                    projectRole = (from m in session.Query<ProjectRole>()
                                   where m.IsNonRole
                                   select m).FirstOrDefault();
                }

                var phase = (from ph in session.Query<Phase>()
                             where ph.ID == model.PhaseID
                             select ph).Single();

                var taskType = (from tt in session.Query<TaskType>()
                                where tt.ID == model.TaskTypeID
                                select tt).Single();

                var newTimesheet = new Timesheet(project, projectRole, me)
                {
                    ActualStartDate = startDate,
                    Phase = phase,
                    TaskType = taskType,
                    SubTask = model.SubTaskDesc,
                    MainTask = model.MainTaskDesc,
                    ActualHourUsed = model.HourUsed,
                    IsOT = model.IsOT,
                };

                project.TimeSheets.Add(newTimesheet);

                transaction.Commit();
                return Json(new
                {
                    success = true,
                    id = newTimesheet.ID,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPut]
        public JsonResult UpdateTimesheet(TimesheetView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var me = TimesheetService.GetCurrentLoginUser(session);

                var startDate = DateTime.ParseExact(model.StartDateText,
                    ViewModelConverter.DateFormat,
                    ViewModelConverter.CultureInfoForDate);

                // ActualHourUsed guard
                var totalHourUsed = (from t in session.Query<Timesheet>()
                                     where t.User == me
                                     && t.ActualStartDate == startDate
                                     && t.ID != model.GuidID
                                     select t.ActualHourUsed).ToList().Sum();

                if (totalHourUsed + model.HourUsed > 24)
                {
                    return Json(new 
                    { 
                        success = false,
                        message = "ท่านเพิ่มเวลาที่ใช้ในการทำงานเกิน 24 ชั่วโมง/วัน แล้ว" 
                    }, JsonRequestBehavior.AllowGet);
                }
                // end

                var oldTimesheetView = (from t in session.Query<Timesheet>()
                                        where t.ID == model.GuidID
                                        select t).Single();

                var phase = (from ph in session.Query<Phase>()
                             where ph.ID == model.PhaseID
                             select ph).Single();

                var taskType = (from tt in session.Query<TaskType>()
                                where tt.ID == model.TaskTypeID
                                select tt).Single();

                oldTimesheetView.ActualStartDate = startDate;
                oldTimesheetView.Phase = phase;
                oldTimesheetView.TaskType = taskType;
                oldTimesheetView.MainTask = model.MainTaskDesc;
                oldTimesheetView.SubTask = model.SubTaskDesc;
                oldTimesheetView.ActualHourUsed = model.HourUsed;
                oldTimesheetView.IsOT = model.IsOT;

                transaction.Commit();
                return Json(new
                {
                    success = true,
                    id = model.ID,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpDelete]
        public JsonResult DeleteTimesheet(TimesheetView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var d = (from x in session.Query<Timesheet>()
                         where x.ID == model.GuidID
                           select x).Single();

                session.Delete(d);
                transaction.Commit();
            }

            return Json(new
            {
                success = true,
                message = "",
            }, JsonRequestBehavior.AllowGet);
        }

        public bool IsStaff 
        {
            get
            {
                return Roles.IsUserInRole(ConstAppRoles.Staff);
            }
        }
    }
}
