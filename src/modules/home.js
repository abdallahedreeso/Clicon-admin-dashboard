import supabaseClient from "../backend/supabase/index.js";

/**
 * this is an example of using our spuabase instance "supabaseClient"
 * here I'm logging "products" table in the console
 */
(async function getProducts() {
  const { data, error } = await supabaseClient.from("products").select();
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  console.log(data, error);
})();
