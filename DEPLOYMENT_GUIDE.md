# 🚀 សៀវភៅណែនាំការដាក់ឱ្យដំណើរការប្រព័ន្ធ (Deployment Guide)

សៀវភៅណែនាំនេះត្រូវបានសរសេរឡើងយ៉ាងសាមញ្ញបំផុតសម្រាប់អ្នកចាប់ផ្តើមដំបូង ដើម្បីជួយអ្នកក្នុងការយកប្រព័ន្ធគ្រប់គ្រងសាលារៀននេះ ទៅដាក់លើអ៊ីនធឺណិត (Hosting) និងភ្ជាប់ជាមួយមូលដ្ឋានទិន្នន័យ (Database) ពិតប្រាកដ។

---

## ជំហានទី 1៖ ការបង្កើតមូលដ្ឋានទិន្នន័យ (Database)

យើងនឹងប្រើប្រាស់ **Neon.tech** ដែលជាសេវាកម្ម PostgreSQL ឥតគិតថ្លៃ និងងាយស្រួលបំផុត។

1. ចូលទៅកាន់គេហទំព័រ [https://neon.tech](https://neon.tech) 
2. ចុចប៊ូតុង **"Sign Up"** ដើម្បីបង្កើតគណនី (អាចប្រើ Google Account របស់អ្នកបាន)។
3. ក្រោយពេលចូលរួច សូមចុចប៊ូតុង **"Create Project"**។
4. បំពេញឈ្មោះ Project (ឧ. `school-system-db`) រួចចុច **Create**។
5. វានឹងបង្ហាញផ្ទាំងមួយដែលមានអក្សរ `postgres://...` ច្រើន។ នេះគឺជា **Database URL** របស់អ្នក។ សូម Copy វាទុក! (វាមើលទៅប្រហែលបែបនេះ៖ `postgresql://neondb_owner:xxxxxx@ep-xxxx-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`)

---

## ជំហានទី 2៖ ការភ្ជាប់ Database ទៅនឹងកូដរបស់អ្នក

1. ត្រលប់មកកូដរបស់អ្នកវិញ សូមបើកឯកសារឈ្មោះ `.env.local` នៅក្នុង Folder `school-management-system`។ (ប្រសិនបើអត់មាន សូមបង្កើតវា)
2. បញ្ចូលកូដនេះទៅក្នុងឯកសារ `.env.local`:
   ```text
   DATABASE_URL="ដាក់_LINK_ដែលអ្នកបាន_COPY_ពី_NEON_នៅទីនេះ"
   ```
3. ឧទាហរណ៍៖ `DATABASE_URL="postgresql://neondb_owner:abc12345@ep-holy-snow-1234.aws.neon.tech/neondb?sslmode=require"`

---

## ជំហានទី 3៖ ការបញ្ចូលរចនាសម្ព័ន្ធទិន្នន័យ (Push Schema)

ដើម្បីប្រាប់ Database ថាបច្ចុប្បន្នយើងមាន Table អ្វីខ្លះ (Users, Students, Classes...):

1. បើក **Terminal** (ឬ Command Prompt) នៅក្នុងកុំព្យូទ័ររបស់អ្នក ក្នុងទីតាំង Folder `school-management-system`។
2. វាយពាក្យបញ្ជានេះ៖
   ```bash
   npm run db:push
   ```
3. បន្ទាប់ពីវាដើរចប់ វាយពាក្យបញ្ជាមួយទៀត ដើម្បីបង្កើតទិន្នន័យសាកល្បង (Admin, Principal, Teacher) ចូលទៅក្នុង Database៖
   ```bash
   npm run db:seed
   ```
   *(បញ្ជាក់៖ អ្នកនឹងឃើញពាក្យថា Seeded database successfully!)*

---

## ជំហានទី 4៖ បញ្ជូនកូដទៅកាន់ GitHub

ដើម្បីអាចបង្ហោះ (Host) ទៅលើអ៊ីនធឺណិតបាន អ្នកត្រូវដាក់កូដរបស់អ្នកទៅក្នុង GitHub សិន។

1. ចូលទៅកាន់ [https://github.com](https://github.com) រួចបង្កើតគណនីប្រសិនបើអ្នកមិនទាន់មាន។
2. ចុចសញ្ញា **+ (New Repository)** ដើម្បីបង្កើតឃ្លាំងផ្ទុកកូដថ្មី។
3. ដាក់ឈ្មោះវា (ឧ. `school-system`) ហើយចុច **Create repository**។
4. បើក Terminal កុំព្យូទ័ររបស់អ្នក ហើយវាយតាមលំដាប់នេះ៖
   ```bash
   git init
   git add .
   git commit -m "First commit"
   git branch -M main
   git remote add origin ដាក់_LINK_GITHUB_របស់អ្នកទីនេះ
   git push -u origin main
   ```

---

## ជំហានទី 5៖ ការបង្ហោះប្រព័ន្ធទៅលើអ៊ីនធឺណិត (Hosting)

យើងនឹងប្រើប្រាស់ **Vercel.com** ដែលជាសេវាកម្ម Hosting ឥតគិតថ្លៃ និងបង្កើតឡើងសម្រាប់ Next.js ផ្ទាល់តែម្តង។

1. ចូលទៅកាន់ [https://vercel.com](https://vercel.com) 
2. ចុច **Sign Up** ដោយជ្រើសរើសយកពាក្យ **Continue with GitHub** ដើម្បីឱ្យវាភ្ជាប់ទៅកាន់គណនី GitHub របស់អ្នក។
3. បន្ទាប់ពីចូលរួច សូមចុចប៊ូតុង **"Add New..."** រួចជ្រើសរើសយក **"Project"**។
4. វានឹងបង្ហាញបញ្ជី Project ដែលអ្នកមាននៅក្នុង GitHub។ សូមចុចប៊ូតុង **Import** នៅលើឈ្មោះ Project `school-system` របស់អ្នក។
5. **សំខាន់ណាស់!** នៅកន្លែងរៀបចំ (Configure Project) សូមចុចលើពាក្យ **Environment Variables**:
   - ត្រង់ប្រអប់ **Name** វាយពាក្យ៖ `DATABASE_URL`
   - ត្រង់ប្រអប់ **Value** វាយបញ្ចូល៖ `Link Database ដែលអ្នកបានពី Neon (postgresql://...)`
   - ចុចប៊ូតុង **Add**។
6. ចុងក្រោយ សូមចុចប៊ូតុង **Deploy** ពណ៌ខ្មៅនៅខាងក្រោមគេ។
7. រង់ចាំប្រហែល 1 ទៅ 2 នាទី... វានឹងចេញផ្កាយព្រោងព្រាត 🎉។
8. ចុចលើផ្ទាំងរូបភាពនោះ អ្នកនឹងឃើញ Website ប្រព័ន្ធគ្រប់គ្រងសាលារបស់អ្នកដំណើរការនៅលើអ៊ីនធឺណិតពិតប្រាកដ (ឧទាហរណ៍៖ `school-system.vercel.app`)!

---

### 🎉 អបអរសាទរ! 
ឥឡូវនេះប្រព័ន្ធរបស់អ្នកគឺ Live នៅលើអ៊ីនធឺណិត ហើយអ្នកអាចប្រើទូរស័ព្ទ ឬកុំព្យូទ័រណាក៏បានដើម្បីចូលទៅកាន់ប្រព័ន្ធនេះ ព្រមទាំងមាន Database ពិតប្រាកដដែលអាចរក្សាទុកទិន្នន័យបានជារៀងរហូត។
