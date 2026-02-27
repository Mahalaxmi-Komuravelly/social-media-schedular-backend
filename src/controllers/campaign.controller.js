import supabase from "../configs/supabase.config.js";

export const createCampaign = async (req, res) => {
    try {
        const { name, description, start_date, end_date } = req.body || {};

        if (!name || !start_date || !end_date) {
            return res.status(400).json({
                success: false,
                message: "Name, start_date and end_date are required",
            });
        }

        // Validate date logic
        if (new Date(end_date) < new Date(start_date)) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date",
            });
        }

        const payload = {
            name,
            start_date,
            end_date,
            user_id: req.user.id,
            description: description || null,
        };

        const { data, error } = await supabase
            .from("campaigns")
            .insert(payload)
            .select()
            .single();

        if (error) {
            return res.status(500).json({
                success: false,
                message: "Error while creating campaign",
                error: error.message,
            });
        }

        return res.status(201).json({
            success: true,
            message: "Campaign created successfully",
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

// Get Campaigns

export const getCampaigns = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("campaigns")
            .select()
            .eq("user_id", req.user.id)
            .order("created_at", { ascending: false });

        if (error) {
            return res.status(500).json({
                success: false,
                message: "Error while fetching campaigns",
                error: error.message,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Campaigns fetched successfully",
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


// Update Campaign

export const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: existing, error: campaignError } = await supabase
            .from("campaigns")
            .select("*")
            .eq("id", id)
            .eq("user_id", req.user.id)
            .maybeSingle();

        if (campaignError) {
            return res.status(500).json({
                success: false,
                message: "Error while checking campaign",
                error: campaignError.message,
            });
        }

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Campaign not found or unauthorized",
            });
        }

        // Block updates for completed campaigns

        const today = new Date();
        const campaignEnd = new Date(existing.end_date);
        campaignEnd.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (today > campaignEnd) {
            return res.status(400).json({
                success: false,
                message: "Completed campaigns cannot be updated",
            });
        }

        const { name, description, start_date, end_date } = req.body || {};

        if (!name && !description && !start_date && !end_date) {
            return res.status(400).json({
                success: false,
                message: "No fields provided for update",
            });
        }

        const payload = {};

        if (name) payload.name = name;
        if (description) payload.description = description;

        const newStartDate = start_date ? new Date(start_date) : new Date(existing.start_date);
        const newEndDate = end_date ? new Date(end_date) : new Date(existing.end_date);

        if (newEndDate < newStartDate) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date",
            });
        }

        if (start_date) payload.start_date = start_date;
        if (end_date) payload.end_date = end_date;

        const { data, error } = await supabase
            .from("campaigns")
            .update(payload)
            .eq("id", id)
            .eq("user_id", req.user.id)
            .select()
            .single();

        if (error) {
            return res.status(500).json({
                success: false,
                message: "Error while updating campaign",
                error: error.message,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Campaign updated successfully",
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

// Delete Campaign
export const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("campaigns")
            .delete()
            .eq("id", id)
            .eq("user_id", req.user.id)
            .select();

        if (error) {
            return res.status(500).json({
                success: false,
                message: "Error while deleting campaign",
                error: error.message,
            });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Campaign not found or unauthorized",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Campaign deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
