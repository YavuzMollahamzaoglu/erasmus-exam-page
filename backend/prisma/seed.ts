import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Word Hunt Questions
  const wordHuntQuestions = [
    {
      turkish: "okul",
      english: "school",
      wrongOption: "hospital",
      alternatives: JSON.stringify(["university", "library", "office"]),
      level: "A1",
    },
    {
      turkish: "masa",
      english: "table",
      wrongOption: "chair",
      alternatives: JSON.stringify(["desk", "shelf", "window"]),
      level: "A1",
    },
    {
      turkish: "kitap",
      english: "book",
      wrongOption: "pen",
      alternatives: JSON.stringify(["magazine", "newspaper", "notebook"]),
      level: "A1",
    },
    {
      turkish: "ev",
      english: "house",
      wrongOption: "car",
      alternatives: JSON.stringify(["building", "apartment", "hotel"]),
      level: "A1",
    },
    {
      turkish: "araba",
      english: "car",
      wrongOption: "bus",
      alternatives: JSON.stringify(["bicycle", "motorcycle", "truck"]),
      level: "A1",
    },
    {
      turkish: "anne",
      english: "mother",
      wrongOption: "father",
      alternatives: JSON.stringify(["sister", "brother", "family"]),
      level: "A1",
    },
    {
      turkish: "su",
      english: "water",
      wrongOption: "milk",
      alternatives: JSON.stringify(["juice", "coffee", "tea"]),
      level: "A1",
    },
    {
      turkish: "güneş",
      english: "sun",
      wrongOption: "moon",
      alternatives: JSON.stringify(["star", "cloud", "sky"]),
      level: "A1",
    },
    {
      turkish: "kedi",
      english: "cat",
      wrongOption: "dog",
      alternatives: JSON.stringify(["bird", "fish", "rabbit"]),
      level: "A1",
    },
    {
      turkish: "kahve",
      english: "coffee",
      wrongOption: "tea",
      alternatives: JSON.stringify(["milk", "water", "juice"]),
      level: "A1",
    },
  ];

  // Writing Questions
  const writingQuestions = [
    { turkish: "masa", english: "table", level: "A1" },
    { turkish: "kitap", english: "book", level: "A1" },
    { turkish: "okul", english: "school", level: "A1" },
    { turkish: "ev", english: "house", level: "A1" },
    { turkish: "araba", english: "car", level: "A1" },
    { turkish: "anne", english: "mother", level: "A1" },
    { turkish: "baba", english: "father", level: "A1" },
    { turkish: "su", english: "water", level: "A1" },
    { turkish: "kedi", english: "cat", level: "A1" },
    { turkish: "köpek", english: "dog", level: "A1" },
    { turkish: "güneş", english: "sun", level: "A1" },
    { turkish: "ay", english: "moon", level: "A1" },
    { turkish: "gece", english: "night", level: "A1" },
    { turkish: "gündüz", english: "day", level: "A1" },
    { turkish: "mavi", english: "blue", level: "A1" },
  ];

  // Paragraph Questions
  const paragraphQuestions = [
    {
      title: "Technology and Communication",
      text: "Technology has dramatically changed the way we communicate with each other. Social media platforms have made it possible to connect with people from all around the world ______. However, some experts argue that digital communication lacks the ______ connection that face-to-face interactions provide. Despite this concern, many businesses have successfully adapted to remote work environments. The ability to collaborate ______ has become essential in today's global economy. As we move forward, finding the right balance between digital and ______ communication will be crucial for maintaining healthy relationships.",
      options: JSON.stringify([
        "instantly",
        "emotional",
        "remotely",
        "personal",
        "gradually",
      ]),
      correctAnswers: JSON.stringify([
        "instantly",
        "emotional",
        "remotely",
        "personal",
      ]),
      level: "B1",
    },
    {
      title: "Environmental Protection",
      text: "Climate change has become one of the most ______ challenges facing humanity today. Scientists around the world are working tirelessly to develop ______ energy solutions. Renewable sources like solar and wind power are becoming increasingly ______ and efficient. Many countries have committed to reducing their carbon emissions significantly over the next decade. Individual actions, such as recycling and using public transportation, also play a ______ role in protecting our environment for future generations.",
      options: JSON.stringify([
        "urgent",
        "sustainable",
        "affordable",
        "crucial",
        "optional",
      ]),
      correctAnswers: JSON.stringify([
        "urgent",
        "sustainable",
        "affordable",
        "crucial",
      ]),
      level: "B1",
    },
    {
      title: "Education in the Digital Age",
      text: "Online learning has ______ transformed the educational landscape in recent years. Students can now access high-quality courses from universities around the world without leaving their homes. This flexibility has made education more ______ to people from diverse backgrounds and circumstances. However, traditional classroom environments still offer unique benefits such as direct ______ with teachers and peers. The future of education will likely combine the best aspects of both online and ______ learning methods to create comprehensive educational experiences.",
      options: JSON.stringify([
        "rapidly",
        "accessible",
        "interaction",
        "traditional",
        "expensive",
      ]),
      correctAnswers: JSON.stringify([
        "rapidly",
        "accessible",
        "interaction",
        "traditional",
      ]),
      level: "B1",
    },
    {
      title: "Healthy Lifestyle",
      text: "Maintaining a healthy lifestyle requires ______ effort and dedication. Regular exercise is essential for keeping our bodies strong and our minds ______. A balanced diet consisting of fruits, vegetables, and whole grains provides the necessary nutrients for optimal health. Getting enough sleep is equally important, as it allows our bodies to ______ and repair themselves. By making these healthy choices consistently, we can significantly improve our ______ of life.",
      options: JSON.stringify([
        "consistent",
        "sharp",
        "recover",
        "quality",
        "temporary",
      ]),
      correctAnswers: JSON.stringify([
        "consistent",
        "sharp",
        "recover",
        "quality",
      ]),
      level: "A2",
    },
    {
      title: "Travel and Culture",
      text: "Traveling to different countries offers ______ opportunities to experience new cultures and traditions. When we immerse ourselves in unfamiliar environments, we often discover that people from different backgrounds share many ______ values and aspirations. Learning about local customs and trying traditional foods can be incredibly ______ and educational. These experiences help us become more open-minded and develop a greater ______ for diversity in our global community.",
      options: JSON.stringify([
        "incredible",
        "similar",
        "rewarding",
        "appreciation",
        "boring",
      ]),
      correctAnswers: JSON.stringify([
        "incredible",
        "similar",
        "rewarding",
        "appreciation",
      ]),
      level: "B2",
    },
  ];

  console.log("🌱 Seeding game data...");

  // Create Word Hunt Questions
  for (const question of wordHuntQuestions) {
    await prisma.wordHuntQuestion.create({
      data: question,
    });
  }
  console.log("✅ Word Hunt questions created");

  // Create Writing Questions
  for (const question of writingQuestions) {
    await prisma.writingQuestion.create({
      data: question,
    });
  }
  console.log("✅ Writing questions created");

  // Create Paragraph Questions
  for (const question of paragraphQuestions) {
    await prisma.paragraphQuestion.create({
      data: question,
    });
  }
  console.log("✅ Paragraph questions created");

  console.log("🎉 Game seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
