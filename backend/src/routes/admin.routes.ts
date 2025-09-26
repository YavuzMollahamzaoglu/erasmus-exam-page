import { Router } from "express";
import AdminController from "../controllers/AdminController";
const router = Router();

router.get("/dashboard", AdminController.dashboard);
router.get("/users", AdminController.getUsers);
router.delete("/users/:id", AdminController.deleteUser);
// Previews management
router.get("/previews", AdminController.listPreviews);
router.post("/previews/recompute", AdminController.recomputePreviews);

export default router;
