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
    using PJ_CWN019.TM.PBM.Web.Models;

    [Authorize(Roles = ConstAppRoles.Admin + "," + ConstAppRoles.Manager)]
    public class ProjectActivitiesController : PbmController
    {
        string _dupPhaseNameValidationMessage = "พบชื่อช่วงโปรเจกต์นี้ซ้ำในระบบแล้ว กรุณาระบุใหม่";
        string _dupTaskTypeNameValidationMessage = "พบชื่อประเภทงานนี้ซ้ำในระบบแล้ว กรุณาระบุใหม่";
        string _dupMainTaskNameValidationMessage = "พบชื่องานที่ทำนี้ซ้ำในระบบแล้ว กรุณาระบุใหม่";

        public ProjectActivitiesController(ISessionFactory sessionFactory) : 
            base(sessionFactory){}

        [HttpPost]
        public JsonResult SavePhase(PhaseView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var validateResult = validatePhaseName(model, session);
                if (validateResult != null) return validateResult;

                var newModel = new Phase(model.Name, model.Order);

                session.Save(newModel);
                transaction.Commit();
                return Json(new
                {
                    success = true,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPut]
        public JsonResult UpdatePhase(PhaseView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var oldModel = (from c in session.Query<Phase>()
                               where c.ID == model.ID
                               select c).Single();

                if (oldModel.NameTH != model.Name)
                {
                    var validateResult = validatePhaseName(model, session);
                    if (validateResult != null) return validateResult;

                    oldModel.NameTH = model.Name;
                    oldModel.NameEN = model.Name;
                }

                oldModel.Order = model.Order;

                transaction.Commit();
                return Json(new
                {
                    success = true,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpDelete]
        public JsonResult DeletePhase(PhaseView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var oldModel = (from c in session.Query<Phase>()
                               where c.ID == model.ID
                               select c).Single();

                session.Delete(oldModel);
                transaction.Commit();

                return Json(new
                {
                    success = true,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult SaveTaskType(TaskTypeView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var validateResult = validateTaskTypeName(model, session);
                if (validateResult != null) return validateResult;

                var newModel = new TaskType(model.Name, model.Order);

                session.Save(newModel);
                transaction.Commit();
                return Json(new
                {
                    success = true,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPut]
        public JsonResult UpdateTaskType(TaskTypeView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var oldModel = (from c in session.Query<TaskType>()
                                where c.ID == model.ID
                                select c).Single();

                if (oldModel.NameTH != model.Name)
                {
                    var validateResult = validateTaskTypeName(model, session);
                    if (validateResult != null) return validateResult;

                    oldModel.NameTH = model.Name;
                    oldModel.NameEN = model.Name;
                }

                oldModel.Order = model.Order;

                transaction.Commit();
                return Json(new
                {
                    success = true,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpDelete]
        public JsonResult DeleteTaskType(TaskTypeView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var oldModel = (from c in session.Query<TaskType>()
                               where c.ID == model.ID
                               select c).Single();

                session.Delete(oldModel);
                transaction.Commit();

                return Json(new
                {
                    success = true,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult SaveMainTask(MainTaskView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var validateResult = validateMainTaskName(model, session);
                if (validateResult != null) return validateResult;

                var newModel = new MainTask(model.Name);

                session.Save(newModel);
                transaction.Commit();
                return Json(new
                {
                    success = true,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPut]
        public JsonResult UpdateMainTask(MainTaskView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var oldModel = (from c in session.Query<MainTask>()
                                where c.ID == model.ID
                                select c).Single();

                if (oldModel.Desc != model.Name)
                {
                    var validateResult = validateMainTaskName(model, session);
                    if (validateResult != null) return validateResult;

                    oldModel.Desc = model.Name;
                }

                transaction.Commit();
                return Json(new
                {
                    success = true,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpDelete]
        public JsonResult DeleteMainTask(MainTaskView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var oldModel = (from c in session.Query<MainTask>()
                               where c.ID == model.ID
                               select c).Single();

                session.Delete(oldModel);
                transaction.Commit();

                return Json(new
                {
                    success = true,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }

        private JsonResult validatePhaseName(PhaseView model, ISession session)
        {
            var cQuery = from c in session.Query<Phase>()
                         where c.NameTH == model.Name
                         select c;

            if (cQuery.Count() > 0)
            {
                return Json(new
                {
                    success = false,
                    id = model.ID,
                    message = _dupPhaseNameValidationMessage,
                }, JsonRequestBehavior.AllowGet);
            }

            return null;
        }
        private JsonResult validateTaskTypeName(TaskTypeView model, ISession session)
        {
            var cQuery = from c in session.Query<TaskType>()
                         where c.NameTH == model.Name
                         select c;

            if (cQuery.Count() > 0)
            {
                return Json(new
                {
                    success = false,
                    id = model.ID,
                    message = _dupTaskTypeNameValidationMessage,
                }, JsonRequestBehavior.AllowGet);
            }

            return null;
        }
        private JsonResult validateMainTaskName(MainTaskView model, ISession session)
        {
            var cQuery = from c in session.Query<MainTask>()
                         where c.Desc == model.Name
                         select c;

            if (cQuery.Count() > 0)
            {
                return Json(new
                {
                    success = false,
                    id = model.ID,
                    message = _dupMainTaskNameValidationMessage,
                }, JsonRequestBehavior.AllowGet);
            }

            return null;
        }
    }
}
