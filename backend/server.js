import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import connectToDB from './src/config/database.js';
import { generateInterviewReport } from './src/services/ai.service.js';

console.log(process.env.MONGO_URI);

connectToDB();

const resume = `
Your resume here
`;

const selfDescription = `
I am a MERN stack and AI developer passionate about building scalable apps.
`;

const jobDescription = `
Looking for a Full Stack Developer with MERN experience.
`;

generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
});

app.listen(3000, () => {
  console.log('server is running on port 3000');
});