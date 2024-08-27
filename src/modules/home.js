import supabaseClient from "../backend/supabase/index.js";

(async function getProducts() {
  const { data, error } = await supabaseClient.from("products").select();
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  console.log(data, error);
})();
