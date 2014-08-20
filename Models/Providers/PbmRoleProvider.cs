using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;

namespace PJ_CWN019.TM.PBM.Web.Models.Providers
{
    using NHibernate;
    using NHibernate.Linq;
    using Cwn.PM.BusinessModels.Entities;
    using WebMatrix.WebData;
   
    public class PbmRoleProvider : RoleProvider
    {
        ISessionFactory _sessionFactory = null;
        public PbmRoleProvider()
        {
            _sessionFactory = MvcApplication.CreateMSSQLSessionFactory();
        }

        public override void AddUsersToRoles(string[] usernames, string[] roleNames)
        {
            throw new NotImplementedException();
        }

        public override string ApplicationName
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override void CreateRole(string roleName)
        {
            throw new NotImplementedException();
        }

        public override bool DeleteRole(string roleName, bool throwOnPopulatedRole)
        {
            throw new NotImplementedException();
        }

        public override string[] FindUsersInRole(string roleName, string usernameToMatch)
        {
            throw new NotImplementedException();
        }

        public override string[] GetAllRoles()
        {
            throw new NotImplementedException();
        }

        public override string[] GetRolesForUser(string username)
        {
            //throw new NotImplementedException();
            var roles = new List<string>();

            using (var session = _sessionFactory.OpenSession())
            {
                var owner = (from u in session.Query<AppUser>()
                             where u.LoginName == username
                             select u).SingleOrDefault();

                if (owner != null)
                {
                    roles = (from r in session.Query<AppRole>()
                             where r.AppUsers.Contains(owner)
                             select r.Name).ToList();
                }
            }
            return roles.ToArray();
        }

        public override string[] GetUsersInRole(string roleName)
        {
            throw new NotImplementedException();
        }

        public override bool IsUserInRole(string username, string roleName)
        {
            throw new NotImplementedException();
        }

        public override void RemoveUsersFromRoles(string[] usernames, string[] roleNames)
        {
            throw new NotImplementedException();
        }

        public override bool RoleExists(string roleName)
        {
            throw new NotImplementedException();
        }
    }
}