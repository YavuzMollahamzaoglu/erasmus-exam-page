import { Router } from "express";
import authRoutes from "./auth.routes";
import questionsRoutes from "./questions.routes";
import seriesRoutes from "./series.routes";
import categoriesRoutes from "./categories.routes";
import testsRoutes from "./tests.routes";
import historyRoutes from "./history.routes";
import rankingsRoutes from "./rankings.routes";
import commentsRouter from "./comments.routes";
import tokenRoutes from "./token.routes";
import adminRoutes from "./admin.routes";
import essayRoutes from "./essay.routes";
import gamesRoutes from "./games.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/questions", questionsRoutes);
router.use("/series", seriesRoutes);
router.use("/categories", categoriesRoutes);
router.use("/tests", testsRoutes);
router.use("/history", historyRoutes);
router.use("/rankings", rankingsRoutes);
router.use("/comments", commentsRouter);
router.use("/token", tokenRoutes);
router.use("/admin", adminRoutes);
router.use("/essays", essayRoutes);
router.use("/games", gamesRoutes);

router.use("/questions", questionsRoutes);
router.use("/series", seriesRoutes);
router.use("/categories", categoriesRoutes);
router.use("/tests", testsRoutes);
router.use("/history", historyRoutes);
router.use("/rankings", rankingsRoutes);
router.use("/token", tokenRoutes);
export default router;
