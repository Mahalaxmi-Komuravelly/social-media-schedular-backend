import supabase from "../configs/supabase.config.js";
export const checkDBConnection = async () => {
    const { data, error } = await supabase
        .from("users")
        .select("id")
        .limit(1);

    if (error) {
        console.error("Database Error:", error);
        process.exit(1);
    }

    console.log("Database connected successfully");
};