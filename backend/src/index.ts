import { PORT, WELCOME_MESSAGE } from "./constants/api.constants";
import app from "./app";

app.listen(PORT, () => {
  console.log(WELCOME_MESSAGE);
});