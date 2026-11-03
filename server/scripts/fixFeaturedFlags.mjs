// Fix DB state: set featured=true on 3 treks with proper featuredOrder
// Also add some initial popularity data so sections aren't empty
import mongoose from 'mongoose';

await mongoose.connect('mongodb://127.0.0.1:27017/himalayan_adventure');
const Trek = mongoose.model('Trek', new mongoose.Schema({}, { strict: false }));

// Get all treks
const treks = await Trek.find({}).lean();
console.log(`Found ${treks.length} treks`);

// Set featured on top 3 by rating (EBC, Annapurna Circuit, Gokyo Lakes)
const featuredSlugs = ['everest-base-camp', 'annapurna-circuit', 'gokyo-lakes'];
const allSlugs = treks.map(t => t.slug);
console.log('All trek slugs:', allSlugs);

// Set featured=false on all first
await Trek.updateMany({}, { $set: { featured: false } });

// Set featured=true on selected ones
for (let i = 0; i < featuredSlugs.length; i++) {
  const slug = featuredSlugs[i];
  const result = await Trek.findOneAndUpdate(
    { slug },
    { $set: { featured: true, featuredOrder: i + 1 } },
    { new: true }
  );
  if (result) {
    console.log(`✅ Set featured: true on "${result.title}" (order: ${i+1})`);
  } else {
    console.log(`⚠️  Trek slug "${slug}" not found`);
  }
}

// Verify
const featuredTreks = await Trek.find({ featured: true }).lean();
console.log(`\nFeatured treks (${featuredTreks.length}):`);
featuredTreks.forEach(t => console.log(`  - ${t.title} (order: ${t.featuredOrder})`));

await mongoose.disconnect();
console.log('\n✅ Done');

