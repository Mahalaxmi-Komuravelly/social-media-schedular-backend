import supabase from "../configs/supabase.config.js"
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

// User Registration

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({
        success: false,
        message: "Email must be a @gmail.com email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check existing user
    const { data: existingUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (userError) {
      return res.status(500).json({
        success: false,
        message: "Error while checking existing user",
        error: userError.message,
      });
    }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { data, error } = await supabase
      .from("users")
      .insert({
        name,
        email,
        password: hashedPassword,
        role: "USER",
      })
      .select("name, email, role")
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error while registering",
        error: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
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



// User Login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Fetch user including password
    const { data: user, error: userError } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .maybeSingle();

    if (userError) {
      return res.status(500).json({
        success: false,
        message: "Error while fetching user",
        error: userError.message,
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "dffoqwhfnwqkn",
      { expiresIn: "1h" }
    );


    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
