import { Router, type IRouter } from "express";
import healthRouter from "./health";
import pagesRouter from "./pages";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/pages", pagesRouter);
router.use("/admin", adminRouter);

export default router;
