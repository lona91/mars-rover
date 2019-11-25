import * as express from "express";
import {join} from "path";

/**
 * @description Genera il server http per fornire le pagine dell'app frontend
 * @function www
 */
const www = () => {
  const app = express();

  app.use("/static", express.static(join(process.cwd(), "src", "frontend", "dist")));
  app.use("/docs", express.static(join(process.cwd(), "docs")));
  app.use("/test", express.static(join(process.cwd(), "coverage", "lcov-report")));

  app.get("/", (req, res) => {
    res.sendFile(join(process.cwd(), "src", "frontend", "index.html"));
  });

  app.listen(8000, () => {
    console.log(`http server listening @ http://0.0.0.0:8000`);
  });
};

export default www;
