#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const localesDir = path.join(__dirname, '..', 'src', 'locales');

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function loadContent(locale) {
  const filePath = path.join(localesDir, `${locale}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function saveContent(locale, data) {
  const filePath = path.join(localesDir, `${locale}.json`);
  
  // Create backup
  const backupPath = path.join(localesDir, `${locale}.backup.${Date.now()}.json`);
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`📦 Backup created: ${backupPath}`);
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Saved: ${filePath}`);
}

async function addFAQ() {
  console.log('\n🔧 Adding new FAQ...\n');
  
  const enQuestion = await question('English Question: ');
  const enAnswer = await question('English Answer: ');
  const arQuestion = await question('Arabic Question (عربي): ');
  const arAnswer = await question('Arabic Answer (عربي): ');
  
  // Load both language files
  const enData = loadContent('en');
  const arData = loadContent('ar');
  
  if (!enData || !arData) {
    console.error('❌ Failed to load content files');
    return;
  }
  
  // Add new FAQ
  enData.pages.faq.questions.push({
    question: enQuestion,
    answer: enAnswer
  });
  
  arData.pages.faq.questions.push({
    question: arQuestion,
    answer: arAnswer
  });
  
  // Save both files
  saveContent('en', enData);
  saveContent('ar', arData);
  
  console.log('\n✅ FAQ added successfully!');
}

async function listFAQs() {
  console.log('\n📋 Current FAQs:\n');
  
  const enData = loadContent('en');
  if (!enData) return;
  
  enData.pages.faq.questions.forEach((faq, index) => {
    console.log(`${index + 1}. ${faq.question}`);
    console.log(`   ${faq.answer}\n`);
  });
}

async function deleteFAQ() {
  await listFAQs();
  
  const indexStr = await question('Enter FAQ number to delete (or 0 to cancel): ');
  const index = parseInt(indexStr) - 1;
  
  if (indexStr === '0') {
    console.log('❌ Cancelled');
    return;
  }
  
  const enData = loadContent('en');
  const arData = loadContent('ar');
  
  if (!enData || !arData) return;
  
  if (index < 0 || index >= enData.pages.faq.questions.length) {
    console.log('❌ Invalid FAQ number');
    return;
  }
  
  const confirm = await question(`Delete FAQ "${enData.pages.faq.questions[index].question}"? (y/N): `);
  
  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ Cancelled');
    return;
  }
  
  enData.pages.faq.questions.splice(index, 1);
  arData.pages.faq.questions.splice(index, 1);
  
  saveContent('en', enData);
  saveContent('ar', arData);
  
  console.log('✅ FAQ deleted successfully!');
}

async function backupContent() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '..', 'backups', timestamp);
  
  if (!fs.existsSync(path.dirname(backupDir))) {
    fs.mkdirSync(path.dirname(backupDir), { recursive: true });
  }
  fs.mkdirSync(backupDir, { recursive: true });
  
  ['en.json', 'ar.json'].forEach(file => {
    const srcPath = path.join(localesDir, file);
    const destPath = path.join(backupDir, file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  });
  
  console.log(`📦 Backup created: ${backupDir}`);
}

async function main() {
  console.log('🏥 Shwan Orthodontics Content Manager\n');
  
  while (true) {
    console.log('Available actions:');
    console.log('1. Add FAQ');
    console.log('2. List FAQs');
    console.log('3. Delete FAQ');
    console.log('4. Create Backup');
    console.log('5. Exit');
    
    const choice = await question('\nSelect an action (1-5): ');
    
    switch (choice) {
      case '1':
        await addFAQ();
        break;
      case '2':
        await listFAQs();
        break;
      case '3':
        await deleteFAQ();
        break;
      case '4':
        await backupContent();
        break;
      case '5':
        console.log('👋 Goodbye!');
        rl.close();
        return;
      default:
        console.log('❌ Invalid choice. Please select 1-5.');
    }
    
    console.log('\n' + '─'.repeat(50) + '\n');
  }
}

if (require.main === module) {
  main().catch(console.error);
}