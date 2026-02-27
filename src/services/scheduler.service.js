import cron from "node-cron";
import supabase from "../configs/supabase.config.js";

export const startScheduler = () => {

  cron.schedule("* * * * *", async () => {
    console.log("⏳ Checking scheduled posts...");

    try {
      const now = new Date();
      console.log("Server time (ISO):", now.toISOString());

      // 1️⃣ Fetch all scheduled posts
      const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "scheduled");

      if (error) {
        console.error("Fetch error:", error.message);
        return;
      }

      if (!posts || posts.length === 0) {
        console.log("No scheduled posts found.");
        return;
      }

      // 2️⃣ Filter posts ready to publish
      const readyToPublish = posts.filter(
        (post) => new Date(post.scheduled_time) <= now
      );

      if (readyToPublish.length === 0) {
        console.log("No posts ready to publish.");
        return;
      }

      console.log("Posts ready to publish:", readyToPublish.length);

      // 3️⃣ Publish & insert analytics
      for (const post of readyToPublish) {

        // Update post status
        const { error: updateError } = await supabase
          .from("posts")
          .update({ status: "published" })
          .eq("id", post.id);

        if (updateError) {
          console.error("Update error:", updateError.message);
          continue;
        }

        // 🔥 Generate mock analytics
        const likes = Math.floor(Math.random() * 100);
        const comments = Math.floor(Math.random() * 50);
        const shares = Math.floor(Math.random() * 20);

        const engagementRate =
          ((likes + comments + shares) / 1000) * 100;

        const { error: analyticsError } = await supabase
          .from("analytics")
          .insert({
            post_id: post.id,
            likes,
            comments,
            shares,
            engagement_rate: engagementRate,
          });

        if (analyticsError) {
          console.error("Analytics insert error:", analyticsError.message);
        }

        console.log(`✅ Post ${post.id} published with analytics`);
      }

    } catch (err) {
      console.error("Scheduler error:", err.message);
    }

  });

};