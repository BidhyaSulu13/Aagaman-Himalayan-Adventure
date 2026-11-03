import mongoose from 'mongoose';
const conn = await mongoose.connect('mongodb://127.0.0.1:27017/himalayan_adventure');
const Trek = mongoose.model('Trek', new mongoose.Schema({}, { strict: false }));
const treks = await Trek.find({}, { title: 1, featured: 1, rating: 1, reviewCount: 1, isArchived: 1, popularityScore: 1 }).lean();
console.log(JSON.stringify(treks, null, 2));
await mongoose.disconnect();

