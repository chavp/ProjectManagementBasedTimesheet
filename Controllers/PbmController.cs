using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PJ_CWN019.TM.PBM.Web.Controllers
{
    using Cwn.PM.BusinessModels.Entities;
using NHibernate;
using PJ_CWN019.TM.PBM.Web.Filters;
using System.Web.SessionState;

    [Authorize]
    [ErrorJsonResult]
    [SessionState(SessionStateBehavior.Disabled)]
    public abstract class PbmController : Controller
    {
        protected readonly ISessionFactory _sessionFactory = null;

        public PbmController(ISessionFactory sessionFactory)
        {
            _sessionFactory = sessionFactory;
        }
    }
}
