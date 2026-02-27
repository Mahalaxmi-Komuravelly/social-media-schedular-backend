import supabase from "../configs/supabase.config.js";

export const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // 🔥 Prevent admin from changing their own role
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    const allowedRoles = ["USER", "MANAGER", "ADMIN"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    // Get target user
    const { data: targetUser } = await supabase
      .from("users")
      .select("role")
      .eq("id", id)
      .single();

    // Count current admins
    const { count } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "ADMIN");

    // If target is admin and changing to non-admin
    if (
      targetUser.role === "ADMIN" &&
      role !== "ADMIN" &&
      count <= 1
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one admin must exist",
      });
    }

    const { data, error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        message: "Error while updating user role",
        error: error.message
      })
    };

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};