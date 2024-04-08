// import express, { Router } from "express";
// import {
//   retrieveLogInfo,
//   deleteLogInfo,
//   signin,
//   updateServicePreference,
//   retrieveServicePreference,
//   getCommunities,
//   getCommunity,
//   addModerator,
//   removeModerator,
//   getModerators,
// } from "../controllers/admin.controller";

// import requireAdminAuth from "../middlewares/auth/auth";
// import {
//   configLimiter,
//   logLimiter,
//   signUpSignInLimiter,
// } from "../middlewares/limiter/limiter";

// const router: Router = express.Router();

// router.post("/signin", signUpSignInLimiter, signin);

// router.use(requireAdminAuth);

// router.get("/community/:communityId", getCommunity);
// router.get("/communities", getCommunities);
// router.get("/moderators", getModerators);

// router.patch("/add-moderators", addModerator);
// router.patch("/remove-moderators", removeModerator);

// router
//   .route("/preferences")
//   .get(configLimiter, retrieveServicePreference)
//   .put(configLimiter, updateServicePreference);
// router
//   .route("/logs")
//   .get(logLimiter, retrieveLogInfo)
//   .delete(logLimiter, deleteLogInfo);

// export default router;
