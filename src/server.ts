import App from "@/app";
import IndexRoute from "@routes/index.route";
import validateEnv from "@utils/validateEnv";
import subscribe from "@/subscribe";

validateEnv();
try {
  subscribe();
} catch (e) {
  console.log(e);
}

const app = new App([new IndexRoute()]);

app.listen();
