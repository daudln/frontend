import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory("/"),
  linkActiveClass: "!border-emerald-500 !text-emerald-500 border-b border-transparent border-b-2 border-emerald-300",
  linkExactActiveClass: "!border-emerald-500 !text-emerald-500",
  routes: [
    {
      path: "/",
      component: () => import("./views/Landing.vue"),
      name: "Home",
      meta: { requiredAuth: true, role: "admin" }
    },
    {
      path: "/login",
      component: () => import("./views/Login.vue"),
      name: "Login",
    },
    {
      path: "/register",
      component: () => import("./views/Register.vue"),
      name: "Register",
    },
    {
      path: "/profile",
      component: () => import("./views/Profile.vue"),
      name: "Profile",
    },
    {
      path: "/settings",
      component: () => import("./views/Setting.vue"),
      name: "Settings",
    },
    {
      path: "/jobs",
      component: () => import("./views/Jobs.vue"),
      name: "Jobs",
      children: [
        {
          path: ":id",
          component: () => import("./views/Job.vue"),
          name: "Job",
          children: [
            {
              path: "apply",
              component: () => import("./views/ApplyJob.vue"),
              name: "ApplyJob",
            },
          ],
        },
        {
          path: "create",
          component: () => import("./views/CreateJob.vue"),
          name: "CreateJob",
        },
      ],
    },
    {
      path: "/my-applications",
      component: () => import("./views/MyApplications.vue"),
      name: "My Applications",
    },
    {
      path: "/:catchAll(.*)",
      component: () => import("./views/NotFound.vue"),
      name: "NotFound",
    },
  ],
});

router.beforeEach((to, from, next) => {
  // const userStore = useUserStore()
  const userStore = JSON.parse(localStorage.getItem("user") ?? "")
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return next({ name: 'home' })
  }
  if (to.meta.role && userStore.user?.role !== to.meta.role) {
    return next({ name: 'home' })
  }
  next()
})


export default router;
