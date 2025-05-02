// Run this script with: node app/community/[topicId]/sampleData.js
// Make sure you have 'firebase' installed: npm install firebase

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, setDoc, doc, addDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBax2WKSy4JZfCT75NLGb2Aj03ibiGAREI",
  authDomain: "autismcare-deef8.firebaseapp.com",
  projectId: "autismcare-deef8",
  storageBucket: "autismcare-deef8.firebasestorage.app",
  messagingSenderId: "702574842049",
  appId: "1:702574842049:web:79323cc224ce16c7b8c440",
  measurementId: "G-5C3HCQ54J5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const topics = [
  {
    id: "sensory_overload",
    title: "Coping strategies for sensory overload",
    author: "SensoryMom",
    replies: 15,
    messages: [
      { text: "Try using noise-cancelling headphones.", author: "ParentA" },
      { text: "Weighted blankets help my child relax.", author: "Therapist1" },
      { text: "We use a quiet corner at home.", author: "CaregiverX" },
      { text: "Dim lighting reduces stress for us.", author: "SensoryMom" },
      { text: "Chewing toys are great for oral needs.", author: "DadB" },
      { text: "Routine helps prevent overload.", author: "TeacherZ" },
    ],
  },
  {
    id: "educational_resources",
    title: "Educational resources for autistic children",
    author: "TeacherJohn",
    replies: 8,
    messages: [
      { text: "Check out Khan Academy Kids.", author: "TeacherJohn" },
      { text: "Visual schedules work wonders.", author: "ParentC" },
      { text: "We use ABCmouse for early learning.", author: "MomD" },
      { text: "Boardmaker is great for communication.", author: "SLP_Eve" },
    ],
  },
  {
    id: "occupational_therapy",
    title: "Experiences with occupational therapy",
    author: "TherapyDad",
    replies: 12,
    messages: [
      { text: "OT improved my son's handwriting.", author: "TherapyDad" },
      { text: "Sensory integration therapy was helpful.", author: "ParentE" },
      { text: "We saw progress after 3 months.", author: "CaregiverF" },
      { text: "Ask for home exercises!", author: "OT_Sam" },
    ],
  },
  {
    id: "vacation_ideas",
    title: "Autism-friendly vacation ideas",
    author: "TravelLover",
    replies: 20,
    messages: [
      { text: "We loved the sensory-friendly zoo day.", author: "TravelLover" },
      { text: "Look for hotels with quiet rooms.", author: "ParentG" },
      { text: "Disney has great accommodations.", author: "MomH" },
      { text: "Bring familiar snacks and toys.", author: "DadI" },
      { text: "Plan for downtime each day.", author: "Therapist2" },
    ],
  },
];

async function addSampleData() {
  for (const topic of topics) {
    const topicRef = doc(db, "community_topics", topic.id);
    await setDoc(topicRef, {
      title: topic.title,
      author: topic.author,
      replies: topic.replies,
    });
    for (const msg of topic.messages) {
      await addDoc(collection(db, "community_topics", topic.id, "messages"), {
        text: msg.text,
        author: msg.author,
        timestamp: serverTimestamp(),
      });
    }
    console.log(`Added topic: ${topic.title}`);
  }
  console.log("Sample data added.");
}

addSampleData().catch(console.error); 