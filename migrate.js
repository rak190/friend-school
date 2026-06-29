const { neon } = require('@neondatabase/serverless');

async function main() {
  const sql = neon("postgresql://neondb_owner:npg_C1Whu2BaOTLm@ep-polished-sunset-aomo4zva-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");
  
  try {
    await sql`ALTER TABLE classes ADD COLUMN IF NOT EXISTS grade_subjects text DEFAULT 'គណិតវិទ្យា'`;
    console.log("Added grade_subjects to classes");
    
    await sql`ALTER TABLE scores RENAME COLUMN subject_id TO subject_name`;
    console.log("Renamed subject_id to subject_name");

    await sql`ALTER TABLE scores DROP COLUMN IF EXISTS score_value`;
    console.log("Dropped score_value");
    
    await sql`ALTER TABLE scores ADD COLUMN IF NOT EXISTS homework_score integer DEFAULT 0`;
    console.log("Added homework_score to scores");

    await sql`ALTER TABLE scores ADD COLUMN IF NOT EXISTS exam_score integer DEFAULT 0`;
    console.log("Added exam_score to scores");

    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration error:", err);
  }
}

main();
