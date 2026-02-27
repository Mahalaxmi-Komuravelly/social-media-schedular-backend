import supabase from "../configs/supabase.config.js";

export const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = supabase
      .from("analytics")
      .select(`
        id,
        likes,
        comments,
        shares,
        engagement_rate,
        created_at,
        posts!inner (
          caption,
          platform,
          user_id
        )
      `)
      .eq("posts.user_id", req.user.id); // 🔐 CRITICAL SECURITY FILTER

    if (startDate && startDate !== "undefined") {
      query = query.gte("created_at", `${startDate}T00:00:00`);
    }

    if (endDate && endDate !== "undefined") {
      query = query.lte("created_at", `${endDate}T23:59:59`);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    res.status(200).json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};