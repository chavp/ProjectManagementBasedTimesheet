using PJ_CWN019.TM.PBM.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PJ_CWN019.TM.PBM.Web.Controllers
{
    using NHibernate;
    using NHibernate.Linq;
    using Cwn.PM.BusinessModels.Entities;

    public class CustomerController : PbmController
    {
        string _dupCustIDValidationMessage = "พบชื่อลูกค้านี้ซ้ำในระบบแล้ว กรุณาระบุใหม่";

        public CustomerController(ISessionFactory sessionFactory): 
            base(sessionFactory){}

        public JsonResult ReadCustomer(int start, int limit, string sort, string query = "")
        {
            var viewList = new List<CustomerView>();

            using (var session = _sessionFactory.OpenSession())
            {
                var custs = (from c in session.Query<Customer>()
                             orderby c.Name
                                   let totalProject = (from p in session.Query<Project>() 
                                                       where p.Customer == c select p).Count()
                                    select new CustomerView
                                   {
                                       ID = c.ID,
                                       Name = c.Name,
                                       ContactChannel = c.ContactChannel,
                                       TotalProject = totalProject,
                                   });

                viewList = custs.ToList();
            }

            var result = new
            {
                data = viewList,
                success = true,
            };

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveCustomer(CustomerView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var validateResult = validateCustomerName(model, session);
                if (validateResult != null) return validateResult;

                var newCus = new Customer
                {
                    Name = model.Name,
                    ContactChannel = model.ContactChannel
                };

                session.Save(newCus);
                transaction.Commit();
                return Json(new
                {
                    success = true,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPut]
        public JsonResult UpdateCustomer(CustomerView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var oldCust = (from c in session.Query<Customer>()
                               where c.ID == model.ID
                              select c).Single();

                if (oldCust.Name != model.Name)
                {
                    var validateResult = validateCustomerName(model, session);
                    if (validateResult != null) return validateResult;

                    oldCust.Name = model.Name;
                }

                oldCust.ContactChannel = model.ContactChannel;

                transaction.Commit();
                return Json(new
                {
                    success = true,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpDelete]
        public JsonResult DeleteCustomer(CustomerView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var oldCust = (from c in session.Query<Customer>()
                               where c.ID == model.ID
                               select c).Single();

                session.Delete(oldCust);
                transaction.Commit();

                return Json(new
                {
                    success = true,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }

        private JsonResult validateCustomerName(CustomerView model, ISession session)
        {
            var cQuery = from c in session.Query<Customer>()
                         where c.Name == model.Name
                         select c;

            if (cQuery.Count() > 0)
            {
                return Json(new
                {
                    success = false,
                    id = model.ID,
                    message = _dupCustIDValidationMessage,
                }, JsonRequestBehavior.AllowGet);
            }

            return null;
        }
    }
}
