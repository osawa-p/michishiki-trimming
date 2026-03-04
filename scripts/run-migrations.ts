/**
 * Supabase マイグレーション実行スクリプト
 * Supabase pg-meta API を使用してSQLを直接実行
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required");
  process.exit(1);
}

const migrationFiles = [
  "20240102000000_expand_schema.sql",
  "20240102000001_prefectures_cities.sql",
  "20240102000002_expand_breeds.sql",
];

async function executeSql(sql: string, label: string): Promise<boolean> {
  try {
    const res = await fetch(`${supabaseUrl}/pg-meta/default/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`,
        "x-connection-encrypted": "false",
      },
      body: JSON.stringify({ query: sql }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`  FAILED (${res.status}): ${text}`);
      return false;
    }

    const result = await res.json();
    // Check for error in the result
    if (result.error) {
      console.error(`  FAILED: ${result.error}`);
      return false;
    }
    console.log(`  OK`);
    return true;
  } catch (error) {
    console.error(`  FAILED:`, error);
    return false;
  }
}

async function main() {
  console.log("=== Supabase Migration Runner ===\n");

  for (const file of migrationFiles) {
    const filePath = path.join(__dirname, "..", "supabase", "migrations", file);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }

    const sql = fs.readFileSync(filePath, "utf-8");
    console.log(`Running: ${file}...`);
    const ok = await executeSql(sql, file);
    if (!ok) {
      console.error(`\nMigration failed at ${file}. Stopping.`);
      console.error("Please run the SQL manually in Supabase SQL Editor.");
      process.exit(1);
    }
  }

  console.log("\n=== All migrations completed successfully ===");
}

main().catch(console.error);
