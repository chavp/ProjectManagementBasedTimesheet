using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebMatrix.WebData;

namespace PJ_CWN019.TM.PBM.Web.Models.Services
{
    using Cwn.PM.BusinessModels.Entities;
    using NHibernate;
    using NHibernate.Linq;

    public static class TimesheetService
    {
        public static User GetCurrentLoginUser(ISession session)
        {
            var apUser = (from u in session.Query<AppUser>()
                      where u.LoginName == WebSecurity.CurrentUserName
                      select u).Single();

            return apUser.RefUser;
        }
    }
}