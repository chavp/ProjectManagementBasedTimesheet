using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace PJ_CWN019.TM.PBM.Web
{
    using Cwn.PM.BusinessModels.Entities;
    using Cwn.PM.FluentMapping.Mappings;
    using FluentNHibernate.Cfg;
    using FluentNHibernate.Cfg.Db;
    using NHibernate;
    using NHibernate.Linq;
    using NHibernate.Tool.hbm2ddl;
    using PJ_CWN019.TM.PBM.Web.Models;
    using System.Globalization;
    using System.IO;
    using Nh = NHibernate.Cfg;

    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        string _projectStatusOpenName = "Open";
        string _projectStatusCloseName = "Close";

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            // Initialization of our Unity container
            Bootstrapper.Initialise();

            InitialExportFolder();
            InitialDBMaster();
        }

        protected void InitialExportFolder()
        {
            string fullFilepath = Server.MapPath(@"~\Export\");
            if (Directory.Exists(fullFilepath))
            {
                Directory.Delete(fullFilepath, true);
            }

            Directory.CreateDirectory(fullFilepath);
        }

        List<string> _appRoles = new List<string> 
        { 
            ConstAppRoles.Staff, 
            ConstAppRoles.Manager, 
            ConstAppRoles.Executive, ConstAppRoles.Admin 
        };
        protected void InitialDBMaster()
        {
            using (var session = CreateMSSQLSessionFactory().OpenSession())
            using (var tran = session.BeginTransaction())
            {
                // init AppRole
                AppRole admin = null;
                foreach (var appRoleText in _appRoles)
                {
                    var appRole = (from ar in session.Query<AppRole>()
                                   where ar.Name == appRoleText
                                     select ar).FirstOrDefault();
                    if (appRole == null)
                    {
                        appRole = new AppRole
                        {
                            Name = appRoleText,
                        };
                        session.Save(appRole);
                    }

                    if (appRoleText == "Admin")
                    {
                        admin = appRole;
                    }
                }

                // init Root System
                var systemDiv = (from div in session.Query<Division>()
                                 where div.NameTH == "__SYSTEM__"
                              select div).FirstOrDefault();
                if (systemDiv == null)
                {
                    systemDiv = new Division
                    {
                        NameTH = "__SYSTEM__",
                        NameEN = "__SYSTEM__",
                    };
                    session.Save(systemDiv);
                }
                var systemDepartment = (from dept in session.Query<Department>()
                                        where dept.NameTH == "__SYSTEM__"
                                        select dept).FirstOrDefault();
                if (systemDepartment == null)
                {
                    systemDepartment = new Department
                    {
                        NameTH = "__SYSTEM__",
                        NameEN = "__SYSTEM__",
                    };
                    session.Save(systemDepartment);
                }
                systemDiv.Departments.Add(systemDepartment);

                var rootPosition = (from p in session.Query<Position>()
                                    where p.NameEN == "__ROOT__"
                                        select p).FirstOrDefault();
                if (rootPosition == null)
                {
                    rootPosition = new Position
                    {
                        NameEN = "__ROOT__",
                        NameTH = "__ROOT__",
                        NameAbbrEN = "__ROOT__",
                        NameAbbrTH = "__ROOT__",
                    };
                    //systemDepartment.Positions.Add(rootPosition);
                    session.Save(rootPosition);
                }
                // add __ROOT__ Project Role
                var rootRole = (from p in session.Query<ProjectRole>()
                                where p.NameTH == rootPosition.NameTH
                               select p).FirstOrDefault();
                if (rootRole == null)
                {
                    rootRole = new ProjectRole
                    {
                        NameTH = rootPosition.NameTH,
                        NameEN = rootPosition.NameEN,
                        IsNonRole = false,
                        Order = 99998
                    };
                    session.Save(rootRole);
                }

                //add Root Admin
                var rootAdmin = (from u in session.Query<User>()
                                 where u.FirstNameTH == "admin"
                                 select u).FirstOrDefault();
                if (rootAdmin == null)
                {
                    rootAdmin = new User
                    {
                        FirstNameTH = "admin",
                        FirstNameEN = "admin",
                        LastNameTH = "system",
                        LastNameEN = "system",
                        Department = systemDepartment,
                        Position = rootPosition,
                        EmployeeID = 999999999,
                        Email = "admin@pbmtimesheet.com",
                        StartDate = DateTime.Now
                    };

                    rootAdmin.SetPassword(ConstAppRoles.DefaultPassword);
                    session.Save(rootAdmin);

                    var rootAdminUser = new AppUser
                    {
                        LoginName = rootAdmin.Email,
                        RefUser = rootAdmin,
                    };
                    session.Save(rootAdminUser);

                    admin.AppUsers.Add(rootAdminUser);
                }

                //session.Save(rootPosition);
                //systemDepartment.Positions.Add(rootPosition);

                // init PBM organization
                var bu5Div = (from div in session.Query<Division>()
                              where div.NameTH == "BU5"
                              select div).FirstOrDefault();

                if (bu5Div == null)
                {
                    bu5Div = new Division
                    {
                        NameTH = "BU5",
                        NameEN = "BU5",
                    };
                    session.Save(bu5Div);
                }

                var pbmOrg = (from org in session.Query<Organization>()
                              where org.ShortName == "PBM"
                              select org).FirstOrDefault();

                if (pbmOrg == null)
                {
                    pbmOrg = new Organization
                    {
                        Name = "xxxxxxxxxxxxx",
                        ShortName = "PBM",
                    };

                    pbmOrg.Divisions.Add(bu5Div);
                    session.Save(pbmOrg);
                }

                var prjOpenStatus = (from x in session.Query<ProjectStatus>()
                                 where x.ID == 1
                                 select x).SingleOrDefault();
                if (prjOpenStatus == null)
                {
                    prjOpenStatus = new ProjectStatus
                    {
                        Name = _projectStatusOpenName,
                    };

                    session.Save(prjOpenStatus);
                }

                var prjCloseStatus = (from x in session.Query<ProjectStatus>()
                                      where x.ID == 2
                                     select x).SingleOrDefault();

                if (prjCloseStatus == null)
                {
                    prjCloseStatus = new ProjectStatus
                    {
                        Name = _projectStatusCloseName,
                    };

                    session.Save(prjCloseStatus);
                }

                // add Non-Role
                var nonRole = (from p in session.Query<ProjectRole>()
                               where p.IsNonRole
                                select p).FirstOrDefault();
                if (nonRole == null)
                {
                    nonRole = new ProjectRole
                    {
                        NameTH = "Non-Role",
                        NameEN = "Non-Role",
                        IsNonRole = true,
                        Order = 99999
                    };
                    session.Save(nonRole);
                }
                // add Non-Project
                var nonProject = (from p in session.Query<Project>()
                               where p.IsNonProject
                               select p).FirstOrDefault();
                if (nonProject == null)
                {
                    nonProject = new Project
                    {
                        Code = "PJ-PBM000",
                        NameTH = "Non-Project",
                        NameEN = "Non-Project",
                        CustomerName = "PBM",
                        Status = prjOpenStatus,
                        IsNonProject = true
                    };
                    session.Save(nonProject);
                }

                // create Phase
                //initDefaultPhase(session);

                // create Task Types
                //initDefaultTaskTypes(session);

                // create Main Tasks
                //initDefaultMainTasks(session);

                tran.Commit();
            }
        }

        private void initDefaultPhase(ISession session)
        {
            var initPhases = new List<Phase>
            {
                new Phase{
                    Order = 1,
                    NameTH = "Sale / Presale / Demo",
                    NameEN = "Sale / Presale / Demo"
                },

                new Phase{
                    Order = 2,
                    NameTH = "Design / Creative / Pre-Prodution",
                    NameEN = "Design / Creative / Pre-Prodution"
                },

                new Phase{
                    Order = 3,
                    NameTH = "Production / Post-Production / Develop",
                    NameEN = "Production / Post-Production / Develop"
                },

                new Phase{
                    Order = 4,
                    NameTH = "Maintenance",
                    NameEN = "Maintenance"
                },

                new Phase{
                    Order = 9999,
                    NameTH = "Non-Phase",
                    NameEN = "Non-Phase"
                },
            };
            foreach (var item in initPhases)
            {
                var query = from x in session.Query<Phase>()
                            where x.NameTH == item.NameTH
                            select x;
                if (query.Count() == 0)
                {
                    session.Save(item);
                }
            }
        }
        private void initDefaultTaskTypes(ISession session)
        {
            var initTaskTypes = new List<TaskType>
            {
                new TaskType{
                    Order = 1,
                    NameTH = "New",
                    NameEN = "New"
                },
            };
            foreach (var item in initTaskTypes)
            {
                var query = from x in session.Query<TaskType>()
                            where x.NameTH == item.NameTH
                            select x;
                if (query.Count() == 0)
                {
                    session.Save(item);
                }
            }
        }
        private void initDefaultMainTasks(ISession session)
        {
            var initMainTasks = new List<MainTask>
            {
                new MainTask{
                    Desc = "Testing",
                },
                new MainTask{
                    Desc = "ส่งมอบ",
                },
                new MainTask{
                    Desc = "Meeting",
                },
                new MainTask{
                    Desc = "Storyboard / Script",
                },
                new MainTask{
                    Desc = "Get Brief",
                },
                new MainTask{
                    Desc = "Research",
                },
                new MainTask{
                    Desc = "Graphic / Motion",
                },
                new MainTask{
                    Desc = "Shooting",
                },
                new MainTask{
                    Desc = "Contact",
                },
                new MainTask{
                    Desc = "Present",
                },
                new MainTask{
                    Desc = "จัดซื้อ",
                },
                new MainTask{
                    Desc = "Media",
                },
                new MainTask{
                    Desc = "Programing",
                },
                new MainTask{
                    Desc = "Document",
                },
                new MainTask{
                    Desc = "System Analysis",
                },
                new MainTask{
                    Desc = "Event",
                },
                new MainTask{
                    Desc = "Installation",
                },
                new MainTask{
                    Desc = "อื่นๆ",
                },
            };
            foreach (var item in initMainTasks)
            {
                var query = from x in session.Query<MainTask>()
                            where x.Desc == item.Desc
                            select x;
                if (query.Count() == 0)
                {
                    session.Save(item);
                }
            }
        }

        public static ISessionFactory CreateMSSQLSessionFactory()
        {
            return Fluently.Configure()
                .Database(MsSqlConfiguration.MsSql2012
                .ConnectionString(c => c
                .Server("xxx.xxx.xxx.xxx")
                .Username("xxxx")
                .Password("xxxx")
                .Database("XXXX")))
                .Mappings(m => m.FluentMappings.AddFromAssemblyOf<UserMap>())
                .ExposeConfiguration(TreatConfiguration)
                .BuildSessionFactory();
        }

        public static void TreatConfiguration(Nh.Configuration configuration)
        {
            var update = new SchemaUpdate(configuration);
            update.Execute(false, true);
        }

        private static void BuildMSSQLSchema(Nh.Configuration config)
        {
            new SchemaExport(config).Create(false, true);
        }
    }
}