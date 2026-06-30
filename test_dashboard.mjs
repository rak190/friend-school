import { db } from './src/db/index.js';
import { users, classes, students, attendance, scores } from './src/db/schema.js';
import { eq, inArray, and, desc } from 'drizzle-orm';

async function test() {
  try {
    const teacherId = 1; // Assuming 1 is a teacher
    const filterClassId = null;
    const filterSemester = null;

    let teacherClassesQuery = db.select({ id: classes.id }).from(classes).where(eq(classes.teacherId, teacherId));
    
    if (filterClassId && filterClassId !== 'all') {
      teacherClassesQuery = db.select({ id: classes.id }).from(classes).where(and(eq(classes.id, Number(filterClassId)), eq(classes.teacherId, teacherId)));
    }
    
    const teacherClasses = await teacherClassesQuery;
    const classIds = teacherClasses.map(c => c.id);
    const totalClasses = classIds.length;
    console.log('Total Classes:', totalClasses);

    if (totalClasses === 0) return;

    const teacherStudents = await db.select({ 
      id: students.id, 
      gender: students.gender 
    }).from(students).where(inArray(students.classId, classIds));
    
    const studentIds = teacherStudents.map(s => s.id);
    const totalStudents = studentIds.length;
    console.log('Total Students:', totalStudents);

    if (totalStudents === 0) return;

    const allAttendance = await db.select({
      status: attendance.status
    }).from(attendance).where(inArray(attendance.studentId, studentIds));

    console.log('Success');
  } catch(e) {
    console.error('Error:', e);
  }
}
test();
