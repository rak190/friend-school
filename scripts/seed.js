import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import * as schema from '../src/db/schema.js';
import { config } from 'dotenv';

config({ path: '.env.local' });

// Initialize DB
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is missing. Please add it to .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // 1. Seed Users (Roles)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    const usersToInsert = [
      { username: 'admin', password: hashedPassword, role: 'admin' },
      { username: 'principal', password: hashedPassword, role: 'principal' },
      { username: 'teacher', password: hashedPassword, role: 'teacher' },
    ];

    console.log('Seeding users...');
    for (const u of usersToInsert) {
      // Use onConflictDoNothing in case they already exist (Postgres)
      await db.insert(schema.users).values(u).onConflictDoUpdate({
        target: schema.users.username,
        set: { password: hashedPassword, role: u.role }
      }).catch(async (e) => {
        // Fallback if unique constraint isn't properly defined or something
        // just insert normally and catch error
        try {
          await db.insert(schema.users).values(u);
        } catch (err) {
          // ignore duplicate
        }
      });
    }

    // Get the teacher user to assign classes
    const teacherUser = await db.select().from(schema.users).where(eq(schema.users.role, 'teacher')).limit(1);
    const teacherId = teacherUser.length > 0 ? teacherUser[0].id : null;

    // 2. Seed Classes
    console.log('Seeding classes...');
    const classData = [
      { className: 'ថ្នាក់ទី 8C', academicYear: '2025-2026', subject: 'គណិតវិទ្យា', schedule: 'ច័ន្ទ, ពុធ, សុក្រ (8:00 - 9:30 ព្រឹក)', progress: 65, color: 'bg-brand-blue', teacherId: teacherId },
      { className: 'ថ្នាក់ទី 9A', academicYear: '2025-2026', subject: 'រូបវិទ្យា', schedule: 'អង្គារ, ព្រហស្បតិ៍ (10:00 - 11:30 ព្រឹក)', progress: 40, color: 'bg-brand-yellow', teacherId: teacherId },
      { className: 'ថ្នាក់ទី 7B', academicYear: '2025-2026', subject: 'គណិតវិទ្យា', schedule: 'ច័ន្ទ, ពុធ (2:00 - 3:30 រសៀល)', progress: 75, color: 'bg-emerald-500', teacherId: teacherId },
    ];
    // clear data first to avoid duplicates
    await db.delete(schema.attendance);
    await db.delete(schema.scores);
    await db.delete(schema.students);
    await db.delete(schema.classes);
    
    let insertedClasses = await db.insert(schema.classes).values(classData).returning();

    // 3. Seed Students
    if (insertedClasses.length > 0) {
      console.log('Seeding students...');
      const studentsData = [
        { firstName: 'សុវណ្ណ', lastName: 'មករា', gender: 'ប្រុស', classId: insertedClasses[0].id },
        { firstName: 'ចាន់', lastName: 'រិទ្ធី', gender: 'ប្រុស', classId: insertedClasses[0].id },
        { firstName: 'សុខ', lastName: 'លីដា', gender: 'ស្រី', classId: insertedClasses[1].id },
        { firstName: 'សាន', lastName: 'ពិសិដ្ឋ', gender: 'ប្រុស', classId: insertedClasses[2].id },
        { firstName: 'កែវ', lastName: 'ចិន្តា', gender: 'ស្រី', classId: insertedClasses[2].id },
      ];
      await db.insert(schema.students).values(studentsData);
    }

    console.log('✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seed();
