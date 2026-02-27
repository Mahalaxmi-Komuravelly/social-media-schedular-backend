import supabase from "../configs/supabase.config.js";

// Create Post

export const createPost = async (req, res) => {
    try {
        const { caption, media_url, platform, scheduled_time, campaign_id } = req.body || {};

        if (!platform) {
            return res.status(400).json({
                success: false,
                message: "Platform is required",
            });
        }

        if (!caption) {
            return res.status(400).json({
                success: false,
                message: "Caption is required"
            });
        }

        const payload = {
            user_id: req.user.id,
            platform,
            caption: caption || null,
            media_url: media_url || null,
            campaign_id: campaign_id || null,
            scheduled_time: scheduled_time
                ? new Date(scheduled_time).toISOString()
                : null,
            status: scheduled_time ? "scheduled" : "draft",
        };

        const { data, error } = await supabase
            .from("posts")
            .insert(payload)
            .select()
            .single();

        if (error) {
            return res.status(500).json({
                success: false,
                message: "Error while creating post",
                error: error.message,
            });
        }

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            data,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

// Fetch Posts

export const getPosts = async (req, res) => {
    try {
        const { status, platform, campaign_id } = req.query;

        let query = supabase
            .from("posts")
            .select(`
        *,
        campaigns (
          id,
          name
        )
      `)
            .eq("user_id", req.user.id);

        // ✅ Apply filters dynamically
        if (status) {
            query = query.eq("status", status);
        }

        if (platform) {
            query = query.eq("platform", platform);
        }

        if (campaign_id) {
            query = query.eq("campaign_id", campaign_id);
        }

        const { data, error } = await query.order("created_at", {
            ascending: false,
        });

        if (error) {
            return res.status(500).json({
                success: false,
                message: "Error while fetching posts",
                error: error.message,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            data,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

// Update Post

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if post exists and belongs to user
        const { data: existing, error: postError } = await supabase
            .from("posts")
            .select("*")
            .eq("id", id)
            .eq("user_id", req.user.id)
            .maybeSingle();

        if (postError) {
            return res.status(500).json({
                success: false,
                message: "Error while checking post",
                error: postError.message,
            });
        }

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Post not found or unauthorized",
            });
        }

        //  Block updates if already published
        if (existing.status === "published") {
            return res.status(400).json({
                success: false,
                message: "Cannot update a published post",
            });
        }

        const { caption, media_url, platform, scheduled_time, campaign_id } = req.body || {};

        if (!caption && !media_url && !platform && !scheduled_time && !campaign_id) {
            return res.status(400).json({
                success: false,
                message: "No fields provided for update",
            });
        }

        const payload = {};

        if (caption) payload.caption = caption;
        if (media_url) payload.media_url = media_url;
        if (platform) payload.platform = platform;
        if (campaign_id) payload.campaign_id = campaign_id;

        if (scheduled_time) {
            payload.scheduled_time = scheduled_time
                ? new Date(scheduled_time).toISOString()
                : null,
                payload.status = scheduled_time ? "scheduled" : "draft";
        }

        const { data, error } = await supabase
            .from("posts")
            .update(payload)
            .eq("id", id)
            .eq("user_id", req.user.id)
            .select()
            .single();

        if (error) {
            return res.status(500).json({
                success: false,
                message: "Error while updating post",
                error: error.message,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase.from("posts").delete().eq("id", id).eq("user_id", req.user.id).select();
        if (error) {
            return res.status(500).json({
                success: false,
                message: "Error while deleting post",
                error: error.message,
            })
        }
        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Post not found or unauthorized",
            });
        }
        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}