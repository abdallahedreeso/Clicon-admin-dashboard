import { SUPABASE_URL, SUPABASE_KEY } from "../../../keys.mjs";

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

export default supabaseClient;
