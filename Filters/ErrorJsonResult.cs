using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PJ_CWN019.TM.PBM.Web.Filters
{
    public class ErrorJsonResultAttribute : FilterAttribute, IExceptionFilter
    {
        public void OnException(ExceptionContext filterContext)
        {
            filterContext.Result = new JsonResult
            {
                Data = new
                {
                    success = false,
                    message = filterContext.Exception.Message,
                },

                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

            filterContext.ExceptionHandled = true;
        }
    }
}