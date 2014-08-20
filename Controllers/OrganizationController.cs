using Cwn.PM.BusinessModels.Entities;
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
    using PJ_CWN019.TM.PBM.Web.Filters;

    public class OrganizationController : PbmController
    {
        public OrganizationController(ISessionFactory sessionFactory) : 
            base(sessionFactory){}

        public JsonResult ReadDepartment(int start, int limit, string sort, string query = "")
        {
            var viewList = new List<DepartmentView>();
            
            int count = 0;

            using (var session = _sessionFactory.OpenSession())
            {
                var bu5Div = (from div in session.Query<Division>()
                              where div.NameTH == "BU5"
                              select div).Single();

                var departments = (from dept in session.Query<Department>()
                                   where dept.Division == bu5Div
                                   let totalPerson = (from p in session.Query<User>() where p.Department == dept select p).Count()
                                   select new
                                   {
                                       ID = dept.ID,
                                       NameEN = dept.NameEN,
                                       NameTH = dept.NameTH,
                                       Department = dept.NameTH,
                                       TotalPerson = totalPerson
                                   });

                departments.ForEach(dept =>
                {
                    //var prjRole = (from pr in session.Query<ProjectRole>()
                    //           where pr.NameTH == dept.NameTH
                    //           select pr).FirstOrDefault();

                    //decimal cost = 0;
                    //if (prjRole != null)
                    //{
                    //    cost = prjRole.ProjectRoleRates
                    //        .OrderByDescending( prr => prr.EffectiveStart )
                    //        .Select(prr => prr.Cost)
                    //        .FirstOrDefault();
                    //}
                    viewList.Add(new DepartmentView
                    {
                        ID = dept.ID,
                        NameEN = dept.NameEN,
                        NameTH = dept.NameTH,
                        DepartmentID = dept.ID,
                        Department = dept.Department,
                        TotalPerson = dept.TotalPerson
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

        public JsonResult ReadPosition(int start, int limit, string sort, string query = "")
        {
            var viewList = new List<PositionView>();

            int count = 0;

            using (var session = _sessionFactory.OpenSession())
            {

                var poList = (from p in session.Query<Position>()
                              where !p.NameEN.Contains("__ROOT__")
                              let totalPerson = (from u in session.Query<User>() where u.Position == p select u).Count()
                              select new { Position = p, TotalPerson = totalPerson }).ToList();

                poList.ForEach(po =>
                {

                    var prjRole = (from pr in session.Query<ProjectRole>()
                                   where pr.NameTH == po.Position.NameTH
                                   select pr).Single();

                    decimal cost = prjRole.ProjectRoleRates
                            .OrderByDescending(prr => prr.EffectiveStart)
                            .Select(prr => prr.Cost)
                            .FirstOrDefault();

                    //var depID = (po.Department != null) ? po.Department.ID : 0; 
                    viewList.Add(new PositionView
                    {
                        PositionID = po.Position.ID,
                        PositionName = po.Position.NameTH,
                        ProjectRoleRateCost = cost,
                        Order = prjRole.Order,
                        TotalPerson = po.TotalPerson,
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

        public JsonResult ReadDepartmentTree(string node, long departmentID)
        {
            var viewList = new List<DepartmentTreeView>();

            using (var session = _sessionFactory.OpenSession())
            {
                var bu5Div = (from div in session.Query<Division>()
                              where div.NameTH == "BU5"
                              select div).Single();

                var depts = (from dept in session.Query<Department>()
                             where dept.Division == bu5Div
                            select dept).ToList();

                foreach (var dept in depts)
                {
                    var newDeptView = new DepartmentTreeView
                    {
                        ID = dept.ID.ToString(),
                        DepartmentID = dept.ID,
                        Department = dept.NameTH,
                        leaf = true,
                        expanded = (dept.ID == departmentID) ? true : false,
                    };

                    viewList.Add(newDeptView);

                    //foreach (var po in dept.Positions)
                    //{
                    //    string id = string.Format("{0}-{1}", dept.ID, po.ID);

                    //    var prjRole = (from pr in session.Query<ProjectRole>()
                    //                   where pr.NameTH == po.NameTH
                    //                   select pr).FirstOrDefault();

                    //    decimal cost = 0;
                    //    if (prjRole != null)
                    //    {
                    //        cost = prjRole.ProjectRoleRates
                    //            .OrderByDescending(prr => prr.EffectiveStart)
                    //            .Select(prr => prr.Cost)
                    //            .FirstOrDefault();
                    //    }

                    //    newDeptView.children.Add(new DepartmentTreeView
                    //    {
                    //        ID = id,
                    //        DepartmentID = dept.ID,
                    //        leaf = true,
                    //        Position = po.NameTH,
                    //        PositionID = po.ID,
                    //        ProjectRoleRateCost = cost,
                    //    });
                    //}
                }
                return Json(new
                {
                    children = viewList,
                    text = ".",
                    success = true,
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult SaveDepartment(DepartmentView updateModel)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var department = (from dept in session.Query<Department>()
                                  where dept.NameTH == updateModel.NameTH
                                  select dept).FirstOrDefault();

                if (department != null)
                {
                    return Json(new
                    {
                        success = false,
                        validate = false,
                        message = "ชื่อแผนกนี้ซ้ำในระบบแล้วกรุณาระบุชื่อใหม่",
                    }, JsonRequestBehavior.AllowGet);
                }

                // add Position & Project Role
                //var position = new Position
                //{
                //    NameTH = updateModel.NameTH,
                //    NameEN = updateModel.NameTH,
                //    NameAbbrEN = updateModel.NameTH,
                //    NameAbbrTH = updateModel.NameTH,
                //};
                //session.Save(position);

                //var prjRole = new ProjectRole
                //{
                //    NameTH = updateModel.NameTH,
                //    NameEN = updateModel.NameTH,
                //};
                //var prjRate = new ProjectRoleRate
                //{
                //    Cost = updateModel.ProjectRoleCost,
                //};
                //prjRole.ProjectRoleRates.Add(prjRate);
                //session.Save(prjRole);

                var bu5Div = (from div in session.Query<Division>()
                              where div.NameTH == "BU5"
                              select div).Single();

                department = new Department
                {
                    NameTH = updateModel.NameTH,
                    NameEN = updateModel.NameTH,
                };


                bu5Div.Departments.Add(department);
                session.Save(department);

                transaction.Commit();
                return Json(new
                {
                    success = true,
                    id = department.ID,
                    message = "",
                }, JsonRequestBehavior.AllowGet);

            }
        }

        [HttpPut]
        public JsonResult UpdateDepartment(DepartmentView updateModel)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var oldDept = (from dept in session.Query<Department>()
                               where dept.ID == updateModel.ID
                               select dept).Single();

                if (oldDept.NameTH != updateModel.NameTH)
                {
                    var queryDepartment = (from dept in session.Query<Department>()
                                           where dept.NameTH == updateModel.NameTH
                                           select dept);
                    if (queryDepartment.Count() > 0)
                    {
                        return Json(new
                        {
                            success = false,
                            validate = false,
                            id = updateModel.ID,
                            message = "ชื่อแผนกนี้ซ้ำในระบบแล้วกรุณาระบุชื่อใหม่",
                        }, JsonRequestBehavior.AllowGet);
                    }
                }

                //var prjRole = (from pr in session.Query<ProjectRole>()
                //               where pr.NameTH == oldDept.NameTH
                //               select pr).Single();

                //var prjRoleRate = prjRole.ProjectRoleRates
                //        .OrderByDescending(prr => prr.EffectiveStart)
                //        .FirstOrDefault();

                //if (prjRoleRate.Cost != updateModel.ProjectRoleCost)
                //{
                //    prjRoleRate.Cost = updateModel.ProjectRoleCost;
                //}

                if (oldDept.NameTH != updateModel.NameTH)
                {
                    //prjRole.NameTH = updateModel.NameTH;
                    //prjRole.NameEN = updateModel.NameEN;

                    //var position = (from pr in session.Query<Position>()
                    //                where pr.NameTH == oldDept.NameTH
                    //                select pr).Single();
                    //position.NameTH = updateModel.NameTH;
                    //position.NameEN = updateModel.NameEN;

                    //var div = (from d in session.Query<Division>()
                    //           where d.NameTH == oldDept.NameTH
                    //           select d).Single();
                    //div.NameTH = updateModel.NameTH;
                    //div.NameEN = updateModel.NameEN;

                    oldDept.NameTH = updateModel.NameTH;
                    oldDept.NameEN = updateModel.NameTH;
                }

                transaction.Commit();
            }

            return Json(new
            {
                success = true,
                id = updateModel.ID,
                message = "",
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        public JsonResult DeleteDepartment(string id)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                long departmentID;
                if (long.TryParse(id, out departmentID))// delete Department
                {
                    var oldDept = (from dept in session.Query<Department>()
                                   where dept.ID == departmentID
                                   select dept).Single();

                    //var poCount = (from p in session.Query<Position>()
                    //               where p.Department == oldDept
                    //               select p).Count();
                    //if (poCount > 0)
                    //{
                    //    return Json(new
                    //    {
                    //        success = false,
                    //        id = id,
                    //        message = "ไม่สามารถลบแผนกนี้ออกจากระบบได้ เนื่องจากพบต่ำแหน่งในแผนกนี้ กรุณาลบต่ำแหน่งในแผนกนี้ออกทั้งหมดก่อน",
                    //    }, JsonRequestBehavior.AllowGet);
                    //}

                    var countUser = (from u in session.Query<User>()
                                     where u.Department == oldDept
                                     select u).Count();
                    if (countUser > 0)
                    {
                        return Json(new
                        {
                            success = false,
                            id = id,
                            message = "ไม่สามารถลบแผนกนี้ออกจากระบบได้ เนื่องจากพบพนักงานในแผนกนี้ กรุณาลบพนักงานในแผนกนี้ออกทั้งหมดก่อน",
                        }, JsonRequestBehavior.AllowGet);
                    }

                    session.Delete(oldDept);

                    transaction.Commit();
                }
                else // delete Postition
                {
                    var idList = id.Split('-');
                    long positionID;
                    long.TryParse(idList[0], out departmentID);
                    long.TryParse(idList[1], out positionID);

                    var position = (from p in session.Query<Position>()
                                    where p.ID == positionID
                                    select p).Single();

                    var countUser = (from u in session.Query<User>()
                                     where u.Position == position
                                     select u).Count();

                    if (countUser > 0)
                    {
                        return Json(new
                        {
                            success = false,
                            id = id,
                            message = "ไม่สามารถลบตำแหน่งนี้ออกจากระบบได้ เนื่องจากพบพนักงานในตำแหน่งนี้ กรุณาลบพนักงานในตำแหน่งนี้ออกทั้งหมดก่อน",
                        }, JsonRequestBehavior.AllowGet);
                    }

                    var prjRole = (from p in session.Query<ProjectRole>()
                                   where p.NameTH == position.NameTH
                                    select p).Single();
                    foreach (var rate in prjRole.ProjectRoleRates)
                    {
                        session.Delete(rate);
                    }
                    session.Delete(prjRole);
                    session.Delete(position);

                    transaction.Commit();
                }

                return Json(new
                {
                    success = true,
                    validate = true,
                    id = id,
                    message = "",
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult SavePosition(PositionView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                //var department = (from dept in session.Query<Department>()
                //                  where dept.ID == model.DepartmentID
                //                  select dept).Single();

                var checkPositionCount = (from p in session.Query<Position>()
                                          where p.NameTH == model.PositionName
                                          || p.NameEN == model.PositionName
                                          select p).Count();
                if (checkPositionCount > 0)
                {
                    return Json(new
                    {
                        success = false,
                        message = "ชื่อตำแหน่งนี้ซ้ำในระบบแล้วกรุณาระบุชื่อใหม่",
                    }, JsonRequestBehavior.AllowGet);
                }

                var newPosition = new Position
                {
                    NameTH = model.PositionName,
                    NameEN = model.PositionName,
                    NameAbbrEN = model.PositionName,
                    NameAbbrTH = model.PositionName,
                };

                var prjRole = new ProjectRole
                {
                    NameTH = model.PositionName,
                    NameEN = model.PositionName,
                    Order = model.Order
                };
                var prjRate = new ProjectRoleRate
                {
                    Cost = model.ProjectRoleRateCost,
                };
                prjRole.ProjectRoleRates.Add(prjRate);
                session.Save(prjRole);

                session.Save(newPosition);

                //department.Positions.Add(newPosition);

                transaction.Commit();
                return Json(new
                {
                    success = true,
                    message = "",
                }, JsonRequestBehavior.AllowGet);

            }
        }

        [HttpPut]
        public JsonResult UpdatePosition(PositionView model)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var oldPo = (from p in session.Query<Position>()
                             where p.ID == model.PositionID
                               select p).Single();

                if (oldPo.NameTH != model.PositionName)
                {
                    var queryPo = (from po in session.Query<Position>()
                                   where po.NameTH == model.PositionName
                                   select po);
                    if (queryPo.Count() > 0)
                    {
                        return Json(new
                        {
                            success = false,
                            message = "ชื่อตำแหน่งนี้ซ้ำในระบบแล้วกรุณาระบุชื่อใหม่",
                        }, JsonRequestBehavior.AllowGet);
                    }
                }

                var prjRole = (from pr in session.Query<ProjectRole>()
                               where pr.NameTH == oldPo.NameTH
                               select pr).Single();

                var prjRoleRate = prjRole.ProjectRoleRates
                        .OrderByDescending(prr => prr.EffectiveStart)
                        .FirstOrDefault();

                if (prjRoleRate.Cost != model.ProjectRoleRateCost)
                {
                    prjRoleRate.Cost = model.ProjectRoleRateCost;
                }

                if (oldPo.NameTH != model.PositionName)
                {
                    prjRole.NameTH = model.PositionName;
                    prjRole.NameEN = model.PositionName;

                    oldPo.NameTH = model.PositionName;
                    oldPo.NameEN = model.PositionName;
                }

                transaction.Commit();
            }

            return Json(new
            {
                success = true,
                id = model.PositionID,
                message = "",
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpDelete]
        public JsonResult DeletePosition(long positionID)
        {
            using (var session = _sessionFactory.OpenSession())
            using (var transaction = session.BeginTransaction())
            {
                var position = (from p in session.Query<Position>()
                                where p.ID == positionID
                                select p).Single();

                var countUser = (from u in session.Query<User>()
                                 where u.Position == position
                                 select u).Count();

                if (countUser > 0)
                {
                    return Json(new
                    {
                        success = false,
                        message = "ไม่สามารถลบตำแหน่งนี้ออกจากระบบได้ เนื่องจากพบพนักงานในตำแหน่งนี้ กรุณาลบพนักงานในตำแหน่งนี้ออกทั้งหมดก่อน",
                    }, JsonRequestBehavior.AllowGet);
                }

                var prjRole = (from p in session.Query<ProjectRole>()
                               where p.NameTH == position.NameTH
                               select p).Single();
                foreach (var rate in prjRole.ProjectRoleRates)
                {
                    session.Delete(rate);
                }
                session.Delete(prjRole);
                session.Delete(position);

                transaction.Commit();
            }

            return Json(new
            {
                success = true,
                message = "",
            }, JsonRequestBehavior.AllowGet);
        }

    }
}
