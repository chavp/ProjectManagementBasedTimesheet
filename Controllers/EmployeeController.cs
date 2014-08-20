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
    using System.Globalization;
    using System.Web.Security;

    [Authorize(Roles = ConstAppRoles.Admin + "," + ConstAppRoles.Manager)]
    public class EmployeeController : PbmController
    {
        string _dupEmpIDValidationMessage = "พบรหัสพนักงานท่านนี้ซ้ำในระบบแล้ว กรุณาระบุใหม่";
        string _dupEmailValidationMessage = "พบอีเมล์พนักงานท่านนี้อยู่ในระบบแล้ว กรุณาระบุใหม่";
        string _dupFullNameValidationMessage = "พบชื่อและ นามสกุลพนักงานท่านนี้อยู่ในระบบแล้ว กรุณาระบุใหม่";
        string _dupValidateAdminRoleMessage = "ท่านไม่สามารถเปลี่ยนหน้าที่นี้ได้ เนื่องจากเป็น Admin คนสุดท้ายของระบบแล้ว";

        string _dateFormat = ViewModelConverter.DateFormat;

        public EmployeeController(ISessionFactory sessionFactory) : 
            base(sessionFactory){}

        public JsonResult ReadEmployee(int start, int limit, string sort, string query = "")
        {
            var viewList = new List<EmployeeView>();

            int count = 0;
            using (var session = _sessionFactory.OpenSession())
            {
                var bu5Div = (from div in session.Query<Division>()
                              where div.NameTH == "BU5"
                              select div).Single();

                var user = TimesheetService.GetCurrentLoginUser(session);

                var selectUser = from u in session.Query<User>()
                                 select u;

                if (Roles.IsUserInRole(ConstAppRoles.Manager))
                {
                    selectUser = selectUser.Where(x => x.Department == user.Department);
                }

                viewList = (from u in selectUser
                            join au in session.Query<AppUser>() on u equals au.RefUser
                            orderby u.EmployeeID
                            where u.Department.Division == bu5Div
                            || u.EmployeeID.ToString().Contains(query)
                            || u.FirstNameEN.Contains(query)
                            || u.FirstNameTH.Contains(query)
                            || u.LastNameEN.Contains(query)
                            || u.LastNameTH.Contains(query)
                            let startDate = u.StartDate.HasValue ? u.StartDate.Value.ToString(_dateFormat, ViewModelConverter.CultureInfoForDate) : ""
                            let roleName = (from aR in session.Query<AppRole>()
                                            where aR.AppUsers.Contains(au)
                                            select aR.Name).FirstOrDefault()
                            let totalTimesheet = (from t in session.Query<Timesheet>() where t.User == u select t).Count()
                                    select new EmployeeView
                                    {
                                        ID = u.ID,
                                        EmployeeID = u.EmployeeID,
                                        NameTH = u.FirstNameTH,
                                        LastTH = u.LastNameTH,
                                        NameEN = u.FirstNameEN,
                                        LastEN = u.LastNameEN,
                                        Department = u.Department.NameTH,
                                        DepartmentID = u.Department.ID,
                                        Position = u.Position.NameTH,
                                        PositionID = u.Position.ID,
                                        Nickname = u.Nickname,
                                        Email = u.Email,
                                        StartDate = startDate,
                                        AppRole = roleName,
                                        TotalTimesheet = totalTimesheet,
                                    }).ToList();


            }

            var result = new
            {
                data = viewList,
                total = count,
                success = true,
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Authorize(Roles = ConstAppRoles.Admin)]
        public JsonResult SaveEmployee(EmployeeView updateModel)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                // [validate Employee Guard]
                var validateResult = validateEmployeeID(updateModel, session);
                if (validateResult != null) return validateResult;

                validateResult = validateEmployeeEmail(updateModel, session);
                if (validateResult != null) return validateResult;

                validateResult = validateEmployeeFullName(updateModel, session);
                if (validateResult != null) return validateResult;

                var dept = (from de in session.Query<Department>()
                            where de.ID == updateModel.DepartmentID
                            select de).Single();

                var position = (from po in session.Query<Position>()
                                where po.ID == updateModel.PositionID
                                select po).Single();

                var startDate = DateTime.ParseExact(updateModel.StartDate, _dateFormat, ViewModelConverter.CultureInfoForDate);
                var newEmp = new User
                {
                    EmployeeID = updateModel.EmployeeID,
                    FirstNameTH = updateModel.NameTH,
                    LastNameTH = updateModel.LastTH,
                    FirstNameEN = updateModel.NameEN,
                    LastNameEN = updateModel.LastEN,
                    Department = dept,
                    Position = position,
                    Email = updateModel.Email,
                    Nickname = updateModel.Nickname,
                    StartDate = startDate,
                };

                newEmp.SetPassword(ConstAppRoles.DefaultPassword);

                session.Save(newEmp);

                // manage App Role
                ManageAppRole(newEmp, updateModel, session);

                transaction.Commit();
                return Json(new
                {
                    success = true,
                    validate = true,
                    id = newEmp.ID,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPut]
        [Authorize(Roles = ConstAppRoles.Admin)]
        public JsonResult UpdateEmployee(EmployeeView updateModel)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var user = TimesheetService.GetCurrentLoginUser(session);

                var oldEmp = (from emp in session.Query<User>()
                               where emp.ID == updateModel.ID
                               select emp).Single();


                // [validate Employee Guard]
                if (oldEmp.EmployeeID != updateModel.EmployeeID)
                {
                    var validateResult = validateEmployeeID(updateModel, session);
                    if (validateResult != null) return validateResult;
                }

                if (oldEmp.Email != updateModel.Email)
                {
                    var validateResult = validateEmployeeEmail(updateModel, session);
                    if (validateResult != null) return validateResult;

                    oldEmp.Email = updateModel.Email;

                    var appRole = (from ar in session.Query<AppUser>()
                                   where ar.RefUser == oldEmp
                                   select ar).Single();

                    appRole.LoginName = oldEmp.Email;
                }

                if (oldEmp.FirstNameTH != updateModel.NameTH
                                   || oldEmp.LastNameTH != updateModel.LastTH
                                   || oldEmp.FirstNameEN != updateModel.NameEN
                                   || oldEmp.LastNameEN != updateModel.LastEN)
                {
                    var validateResult = validateEmployeeFullName(updateModel, session);
                    if (validateResult != null) return validateResult;
                }

                if (!string.IsNullOrEmpty(updateModel.AppRole))
                {
                    if (!updateModel.AppRole.Contains(ConstAppRoles.Admin)
                        && oldEmp.ID == user.ID)
                    {
                        var validateResult = validateAdminRole(session);
                        if (validateResult != null) return validateResult;
                    }
                }
                var dept = (from de in session.Query<Department>()
                            where de.ID == updateModel.DepartmentID
                            select de).SingleOrDefault();

                var position = (from po in session.Query<Position>()
                                where po.ID == updateModel.PositionID
                                select po).SingleOrDefault();

                var startDate = DateTime.ParseExact(updateModel.StartDate, _dateFormat, ViewModelConverter.CultureInfoForDate);

                // change Role
                oldEmp.EmployeeID = updateModel.EmployeeID;
                oldEmp.FirstNameTH = updateModel.NameTH;
                oldEmp.LastNameTH = updateModel.LastTH;
                oldEmp.FirstNameEN = updateModel.NameEN;
                oldEmp.LastNameEN = updateModel.LastEN;
                if (dept != null)
                {
                    oldEmp.Department = dept;
                }
                if (position != null)
                {
                    oldEmp.Position = position;
                }
                
                oldEmp.Nickname = updateModel.Nickname;
                oldEmp.StartDate = startDate;

                // manage App Role
                ManageAppRole(oldEmp, updateModel, session);

                transaction.Commit();
                return Json(new
                {
                    success = true,
                    id = updateModel.ID,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpDelete]
        [Authorize(Roles = ConstAppRoles.Admin)]
        public JsonResult DeleteEmployee(EmployeeView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var emp = (from u in session.Query<User>()
                               where u.ID == model.ID
                               select u).Single();

                var appUser = (from x in session.Query<AppUser>()
                                      where x.RefUser == emp
                               select x).Single();

                var appRoles = (from x in session.Query<AppRole>()
                                     where x.AppUsers.Contains(appUser)
                                     select x).ToList();

                foreach (var appRole in appRoles)
                {
                    appRole.AppUsers.Remove(appUser);
                }

                session.Delete(appUser);
                session.Delete(emp);

                transaction.Commit();
            }

            return Json(new
            {
                success = true,
                message = "",
            }, JsonRequestBehavior.AllowGet);
        }

        private JsonResult validateEmployeeID(EmployeeView updateModel, ISession session)
        {
            var empQuery = from emp in session.Query<User>()
                           where emp.EmployeeID == updateModel.EmployeeID
                           select emp;

            if (empQuery.Count() > 0)
            {
                return Json(new
                {
                    success = false,
                    id = updateModel.ID,
                    message = _dupEmpIDValidationMessage,
                }, JsonRequestBehavior.AllowGet);
            }

            return null;
        }
        private JsonResult validateEmployeeEmail(EmployeeView updateModel, ISession session)
        {
            var empEmailQuery = from emp in session.Query<User>()
                                where emp.Email == updateModel.Email
                                select emp;
            if (empEmailQuery.Count() > 0)
            {
                return Json(new
                {
                    success = false,
                    id = updateModel.ID,
                    message = _dupEmailValidationMessage,
                }, JsonRequestBehavior.AllowGet);
            }

            return null;
        }
        private JsonResult validateEmployeeFullName(EmployeeView updateModel, ISession session)
        {
            var empFullNameQuery = from emp in session.Query<User>()
                                   where emp.FirstNameTH == updateModel.NameTH
                                   && emp.LastNameTH == updateModel.LastTH
                                   && emp.FirstNameEN == updateModel.NameEN
                                   && emp.LastNameEN == updateModel.LastEN
                                   select emp;

            if (empFullNameQuery.Count() > 0)
            {
                return Json(new
                {
                    success = false,
                    id = updateModel.ID,
                    message = _dupFullNameValidationMessage,
                }, JsonRequestBehavior.AllowGet);
            }

            return null;
        }
        private JsonResult validateAdminRole(ISession session)
        {
            var countAdminQuery = from ar in session.Query<AppRole>()
                                   where ar.Name == ConstAppRoles.Admin
                                   select ar;

            if (countAdminQuery.Count() == 1)
            {
                return Json(new
                {
                    success = false,
                    message = _dupValidateAdminRoleMessage,
                }, JsonRequestBehavior.AllowGet);
            }

            return null;
        }

        protected void ManageAppRole(User oldEmp, EmployeeView updateModel, ISession session)
        {
            if (!string.IsNullOrEmpty(updateModel.AppRole))
            {
                // manage App Role
                var currentAppUser = (from x in session.Query<AppUser>()
                                      where x.RefUser == oldEmp
                                      select x).FirstOrDefault();

                var updateAppRole = (from x in session.Query<AppRole>()
                                     where x.Name == updateModel.AppRole
                                     select x).Single();

                if (currentAppUser == null)
                {
                    currentAppUser = new AppUser
                    {
                        LoginName = oldEmp.Email,
                        RefUser = oldEmp
                    };

                    session.Save(currentAppUser);
                    updateAppRole.AppUsers.Add(currentAppUser);
                }
                else
                {
                    var oldAppRole = (from x in session.Query<AppRole>()
                                      where x.AppUsers.Contains(currentAppUser)
                                      select x).Single();

                    oldAppRole.AppUsers.Remove(currentAppUser);
                    updateAppRole.AppUsers.Add(currentAppUser);
                }
            }
        }
    }
}
