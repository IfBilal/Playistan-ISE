import { Router } from "express";
import {
  allGrounds,
  filterGroundByCity,
  sortAscending,
  sortDescending,
} from "../controllers/ground.controllers.js";

const router = Router();

router.route("/").get(allGrounds);
router.route("/filter-by-city").post(filterGroundByCity);
router.route("/sort/asc").get(sortAscending);
router.route("/sort/desc").get(sortDescending);

export default router;
