import express from "express";
import cors from "cors";
import { checkDBConnection } from "./src/utils/checkDBConnection.js";
import { startScheduler } from "./src/services/scheduler.service.js";
import { AuthRouter } from "./src/routes/auth.routes.js";
import { PostRouter } from "./src/routes/post.routes.js";
import { CampaignRouter } from "./src/routes/campaign.routes.js";
import { AnalyticsRouter } from "./src/routes/analytics.routes.js";
import { UserRouter } from "./src/routes/users.route.js";

const app = express();
const PORT = process.env.PORT || 6589;

app.use(express.json());
app.use(cors({
    origin:[
        "http://localhost:5173",
        "https://social-media-schedular-frontend.vercel.app"
    ]
}
));

app.get("/", (req, res) => {
    res.send("Social Media Scheduler API is live 🚀");
})

app.use("/auth", AuthRouter);
app.use("/posts", PostRouter);
app.use("/campaigns", CampaignRouter);
app.use("/analytics", AnalyticsRouter);
app.use("/users", UserRouter);

app.listen(PORT, async () => {
    await checkDBConnection();
    startScheduler(); // cron
    console.log(`Server running on http://localhost:${PORT}`);
})

