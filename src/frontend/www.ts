import * as express from "express";
import {join} from "path";

const www = () => {
  const app = express();
  
  app.use('/static', express.static(join(process.cwd(), 'src', 'frontend', 'dist')));

  app.get('/', (req, res) => {
    res.sendFile(join(process.cwd(), 'src', 'frontend', 'index.html'));
  });
  
  app.listen(8000)
}

export default www;