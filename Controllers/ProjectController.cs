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
    using System.Globalization;
    using System.Web.Security;

    public class ProjectController : PbmController
    {
        string _dateFormat = "dd/MM/yyyy";
        string _cultureInfo = "en-US";
        
        string _projectStatusOpenName = "Open";

        string _dupPrjCodeValidationMessage = "พบรหัสโปรเจ็กต์ท่านนี้ซ้ำในระบบแล้ว กรุณาระบุใหม่";
        string _haveTimesheetInPrjMessage = "ไม่สามารถลบโปรเจ็กต์นี้ออกจากระบบได้ เนื่องจากพบการบันทึกเวลาทำงานของโปรเจ็กต์นี้ในระบบ";

        public ProjectController(ISessionFactory sessionFactory) : 
            base(sessionFactory){}

        public JsonResult ReadProject(string projectCode, string projectName,
            int start, int limit, string sort, string query = "", string includeAll = null, bool isTimesheet = false)
        {
            var viewList = new List<ProjectView>();
            if (!string.IsNullOrEmpty(includeAll))
            {
                viewList.Add(new ProjectView
                {
                    ID = -1,
                    Code = "",
                    Name = "ทั้งหมด",
                });
            }

            int count = 0;

            using (var session = _sessionFactory.OpenSession())
            {
                var prjList = (from prj in session.Query<Project>()
                               orderby prj.StartDate descending
                               where prj.Code.Contains(projectCode)
                               && prj.NameTH.Contains(projectName)
                               && prj.NameEN.Contains(projectName)
                                   select prj);

                if (isTimesheet)
                {
                    prjList = prjList.Where(p => p.Status.ID == 1);
                }

                bool isStaff = Roles.IsUserInRole(ConstAppRoles.Staff);
                prjList.ForEach(prj =>
                {
                    long? customerID = null;
                    if (prj.Customer != null)
                    {
                        customerID = prj.Customer.ID;
                    }
                    var newView = new ProjectView
                    {
                        ID = prj.ID,
                        Code = prj.Code,
                        Name = prj.NameTH,
                        CustomerID = customerID,
                        StartDate = prj.ContractStartDate,
                        EndDate = prj.ContractEndDate,
                        ProjectStatusID = prj.Status.ID,
                        ProjectStatusName = prj.Status.Name,
                        IsNonProject = prj.IsNonProject,
                    };

                    if (!isStaff)
                    {
                        newView.EstimateProjectValue = prj.EstimateProjectValue;
                        newView.TotalTimesheet = prj.TimeSheets.Count();
                    }

                    if (prj.Status != null)
                    {
                        newView.ProjectStatusID = prj.Status.ID;
                        newView.ProjectStatusName = prj.Status.Name;
                    }

                    if (prj.ContractStartDate.HasValue)
                    {
                        newView.StringStartDate = prj.ContractStartDate.Value.ToString(ViewModelConverter.DateFormat);
                    }
                    if (prj.ContractEndDate.HasValue)
                    {
                        newView.StringEndDate = prj.ContractEndDate.Value.ToString(ViewModelConverter.DateFormat);
                    }

                    viewList.Add(newView);
                });
            }

            var result = new
            {
                data = viewList,
                total = count,
                success = true,
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ReadProjectStatus(int start, int limit, string sort, string query = "")
        {
            var viewList = new List<ProjectStatusView>();

            int count = 0;

            using (var session = _sessionFactory.OpenSession())
            {
                var prjList = (from prj in session.Query<ProjectStatus>()
                               orderby prj.ID ascending
                               select prj).ToList();

                prjList.ForEach(prj =>
                {
                    viewList.Add(new ProjectStatusView
                    {
                        ID = prj.ID,
                        Name = prj.Name
                    });
                });
            }

            var result = new
            {
                data = viewList,
                total = count,
                success = true,
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = ConstAppRoles.Admin + "," + ConstAppRoles.Manager)]
        [HttpPost]
        public JsonResult SaveProject(ProjectView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                // [validate Project Guard]
                var validateResult = validateProjectCode(model, session);
                if (validateResult != null) return validateResult;

                var prjStatus = (from x in session.Query<ProjectStatus>()
                                 where x.ID == model.ProjectStatusID
                                 select x).FirstOrDefault();

                var customer = (from x in session.Query<Customer>()
                                where x.ID == model.CustomerID
                                select x).FirstOrDefault();

                DateTime startDate;
                DateTime endDate;
                var newEmp = new Project
                {
                    Code = model.Code,
                    NameEN = model.Name,
                    NameTH = model.Name,
                    Customer = customer,
                    Status = prjStatus,
                    EstimateProjectValue = model.EstimateProjectValue
                };

                if (DateTime.TryParseExact(model.StringStartDate, _dateFormat, new CultureInfo(_cultureInfo), DateTimeStyles.None, out startDate))
                {
                    newEmp.ContractStartDate = startDate;
                    newEmp.StartDate = startDate;
                }

                if (DateTime.TryParseExact(model.StringEndDate, _dateFormat, new CultureInfo(_cultureInfo), DateTimeStyles.None, out endDate))
                {
                    newEmp.ContractEndDate = endDate;
                    newEmp.EndDate = endDate;
                }
                session.Save(newEmp);

                transaction.Commit();
                return Json(new
                {
                    success = true,
                    id = newEmp.ID,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [Authorize(Roles = ConstAppRoles.Admin + "," + ConstAppRoles.Manager)]
        [HttpDelete]
        public JsonResult DeleteProject(ProjectView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var validateResult = validateHaveTimesheetInProjectCode(model, session);
                if (validateResult != null) return validateResult;

                var prj = (from x in session.Query<Project>()
                           where x.ID == model.ID
                           select x).Single();

                session.Delete(prj);
                transaction.Commit();
            }

            return Json(new
            {
                success = true,
                message = "",
            }, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = ConstAppRoles.Admin + "," + ConstAppRoles.Manager)]
        [HttpPut]
        public JsonResult UpdateProject(ProjectView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var oldPrj = (from x in session.Query<Project>()
                              where x.ID == model.ID
                              select x).Single();


                // [validate Project Guard]
                if (oldPrj.Code != model.Code)
                {
                    var validateResult = validateProjectCode(model, session);
                    if (validateResult != null) return validateResult;
                }


                DateTime startDate;
                if (DateTime.TryParseExact(model.StringStartDate, _dateFormat, new CultureInfo(_cultureInfo), DateTimeStyles.None, out startDate))
                {
                    oldPrj.StartDate = startDate;
                    oldPrj.ContractStartDate = startDate;
                }

                DateTime endDate;
                if (DateTime.TryParseExact(model.StringEndDate, _dateFormat, new CultureInfo(_cultureInfo), DateTimeStyles.None, out endDate))
                {
                    oldPrj.EndDate = endDate;
                    oldPrj.ContractEndDate = endDate;
                }

                var prjStatus = (from x in session.Query<ProjectStatus>()
                                 where x.ID == model.ProjectStatusID
                                 select x).FirstOrDefault();

                var customer = (from x in session.Query<Customer>()
                                where x.ID == model.CustomerID
                                select x).FirstOrDefault();

                // change Role
                oldPrj.Code = model.Code;
                oldPrj.NameTH = model.Name;
                oldPrj.NameEN = model.Name;
                oldPrj.Customer = customer;
                oldPrj.Status = prjStatus;
                oldPrj.EstimateProjectValue = model.EstimateProjectValue;

                transaction.Commit();
                return Json(new
                {
                    success = true,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }

        private JsonResult validateProjectCode(ProjectView updateModel, ISession session)
        {
            var prjQuery = from x in session.Query<Project>()
                           where x.Code == updateModel.Code
                           select x;

            if (prjQuery.Count() > 0)
            {
                return Json(new
                {
                    success = false,
                    id = updateModel.ID,
                    message = _dupPrjCodeValidationMessage,
                }, JsonRequestBehavior.AllowGet);
            }

            return null;
        }
        private JsonResult validateHaveTimesheetInProjectCode(ProjectView model, ISession session)
        {
            var countTimesheet = (from t in session.Query<Timesheet>()
                                  where t.Project.ID == model.ID
                                  select t).Count();

            if (countTimesheet > 0)
            {
                return Json(new
                {
                    success = false,
                    id = model.ID,
                    message = _haveTimesheetInPrjMessage,
                }, JsonRequestBehavior.AllowGet);
            }

            return null;
        }
    }
}
