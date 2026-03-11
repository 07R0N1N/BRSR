/**
 * Create the first Master user. Run once after applying migrations.
 * Loads .env.local; requires NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Usage: npm run seed:master -- <email> <password>
 */

import { resolve } from "path";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];
if (!email || !password) {
  console.error("Usage: npx tsx scripts/seed-master.ts <email> <password>");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: roles } = await supabase.from("roles").select("id").eq("slug", "master").limit(1);
  const masterRoleId = roles?.[0]?.id;
  if (!masterRoleId) {
    console.error("Run migrations first so that the 'master' role exists.");
    process.exit(1);
  }

  const { data: user, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError) {
    console.error("Auth create failed:", authError.message);
    process.exit(1);
  }
  if (!user.user) {
    console.error("User not returned");
    process.exit(1);
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.user.id,
    email,
    org_id: null,
    role_id: masterRoleId,
  });
  if (profileError) {
    console.error("Profile insert failed:", profileError.message);
    await supabase.auth.admin.deleteUser(user.user.id);
    process.exit(1);
  }

  console.log("Master user created:", email);
}

main();
