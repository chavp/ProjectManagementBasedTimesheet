using PJ_CWN019.TM.PBM.Web.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PJ_CWN019.TM.PBM.Web.Controllers
{
    using Cwn.PM.BusinessModels.Entities;
    using NHibernate;
    using NHibernate.Linq;
    using PJ_CWN019.TM.PBM.Web.Models.Services;
    using System.Web.Security;
    using System.Web.SessionState;
    using WebMatrix.WebData;

    public class AppController : PbmController
    {
        public AppController(ISessionFactory sessionFactory) : 
            base(sessionFactory){}

        [AllowAnonymous]
        public ActionResult Main()
        {
            ViewBag.toDay = DateTime.Now.ToString(ViewModelConverter.DateFormat, ViewModelConverter.CultureInfoForDate);
            ViewBag.firstDayOfMonth = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1).ToString(ViewModelConverter.DateFormat, ViewModelConverter.CultureInfoForDate);
            ViewBag.firstDayOfWeek = ViewModelConverter.FirstDayOfWeek().ToString(ViewModelConverter.DateFormat, ViewModelConverter.CultureInfoForDate);
            ViewBag.lastDayOfWeek = ViewModelConverter.LastDayOfWeek().ToString(ViewModelConverter.DateFormat, ViewModelConverter.CultureInfoForDate);

            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        public JsonResult Login(LoginModel model, string returnUrl)
        {
            if (ModelState.IsValid &&
                WebSecurity.Login(model.UserName, model.Password, persistCookie: model.RememberMe))
            {
                return Json(new
                {
                    message = "",
                    returnUrl = returnUrl,
                    success = true,
                }, JsonRequestBehavior.AllowGet);
            }

            return Json(new
            {
                message = "กรุณาระบุรหัสพนักงาน หรือรหัสเข้าระบบให้ถูกต้อง",
                success = false,
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult LogOff()
        {
            WebSecurity.Logout();

            using (var session = _sessionFactory.OpenSession())
            {
                var user = (from u in session.Query<AppUser>()
                            where u.LoginName == WebSecurity.CurrentUserName
                            select u).FirstOrDefault();

                if (user != null)
                {
                    user.RefUser.LastLockoutIP = HttpContext.Request.UserHostAddress;
                    user.RefUser.LastLockoutDate = DateTime.Now;
                    user.RefUser.IsLockedOut = true;

                    session.Flush();
                }
            }

            return RedirectToAction("Main", "App");
        }

        [HttpPost]
        public JsonResult ChangePassword(string oldPassword, string newPassword, string confirmNewPassword, bool isFourceToChange = false)
        {
            var oldPasswordNotValid = "กรุณาระบุรหัสเข้าระบบเดิมให้ถูกต้อง";
            var strong8PasswordNotValid = "กรุณาระบุรหัสเข้าระบบใหม่ตั้งแต่ 8 ตัวอักษรขึ้นไป";
            var newPasswordNotValid = "กรุณาระบุรหัสเข้าระบบใหม่ไม่ให้ตรงกับรหัสพนักงาน";
            var sameDefaultPasswordNotValid = "ห้ามเปลี่ยนเป็นรหัสเข้าระบบตั่งต้น";

            var success = false;
            var msg = string.Empty;

            var isValidOldPassword = WebSecurity.Login(WebSecurity.CurrentUserName, oldPassword);
            if (!isValidOldPassword)
            {
                msg = oldPasswordNotValid;
            }
            else if (newPassword.Length < 8)
            {
                // http://windows.microsoft.com/en-us/windows-vista/tips-for-creating-a-strong-password
                msg = strong8PasswordNotValid;
            }
            else if (newPassword == ConstAppRoles.DefaultPassword)
            {
                msg = sameDefaultPasswordNotValid;
            }
            else
            {
                using (var session = _sessionFactory.OpenSession())
                {
                    var user = TimesheetService.GetCurrentLoginUser(session);

                    user.SetPassword(newPassword);
                    user.LastPasswordChangedDate = DateTime.Now;
                    session.Flush();
                }
                msg = "แก้ไขรหัสเข้าระบบเสร็จสมบูรณ์";
                success = true;
            }
            return Json(new { success = success, message = msg }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Authorize(Roles = ConstAppRoles.Admin)]
        public JsonResult ResetPassword(int empoyeeID)
        {
            var success = false;
            var msg = string.Empty;
            using (var session = _sessionFactory.OpenSession())
            {
                var user = (from u in session.Query<User>()
                            where u.EmployeeID == empoyeeID
                            select u).First();

                user.SetPassword(ConstAppRoles.DefaultPassword);
                user.LastPasswordChangedDate = null;
                session.Flush();
            }
            msg = "คืนค่าเริ่มต้นรหัสเข้าระบบผู้ใช้งานเสร็จสมบูรณ์";
            success = true;

            return Json(new { success = success, message = msg }, JsonRequestBehavior.AllowGet);
        }
    }
}
