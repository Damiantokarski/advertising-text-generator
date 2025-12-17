import express from "express";
import login from "./login";
import logout from "./logout";
import signup from "./signup";
import session from "./session";
import refresh from "./refresh";

const router = express.Router();

router.use(login);
router.use(logout);
router.use(signup);
router.use(session);
router.use(refresh);

export default router;
