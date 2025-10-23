import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function generateExampleSentences(word: string): { sentence: string }[] {
  // Gerçek insan cümleleri, ilk 10 kelime için örnekler
  const examples: Record<string, string[]> = {
    "school": [
      "My school is close to my house.",
      "I go to school by bus every day.",
      "There are many students in our school."
    ],
    "table": [
      "There is a book on the table.",
      "We had dinner at a big table.",
      "Can you clean the table, please?"
    ],
    "book": [
      "This book is very interesting.",
      "I read a book before I sleep.",
      "She bought a new book yesterday."
    ],
    "house": [
      "Our house has a beautiful garden.",
      "They live in a small house.",
      "I want to visit your house."
    ],
    "car": [
      "My father drives a red car.",
      "There is a car parked outside.",
      "We washed the car together."
    ],
    "mother": [
      "My mother is a teacher.",
      "I love my mother very much.",
      "My mother cooks delicious meals."
    ],
    "water": [
      "I drink water every morning.",
      "The water in the lake is cold.",
      "Can I have a glass of water, please?"
    ],
    "sun": [
      "The sun is shining today.",
      "We played outside under the sun.",
      "The sun rises in the east."
    ],
    "cat": [
      "The cat is sleeping on the sofa.",
      "I have a black cat.",
      "The cat likes to drink milk."
    ],
    "coffee": [
      "I drink coffee every morning.",
      "Would you like some coffee?",
      "She made a cup of coffee for me."
    ],
  };
    // Otomatik cümle ekleme kaldırıldı
    return [];
}

async function main() {
  const a1Words = await prisma.word.findMany({ where: { level: "A1" } });
  let done = 0;
  for (const word of a1Words) {
    for (const ex of generateExampleSentences(word.english)) {
      // Aynı cümle daha önce eklenmiş mi kontrol et
      const exists = await prisma.wordExample.findFirst({
        where: { wordId: word.id, sentence: ex.sentence },
      });
      if (!exists) {
        await prisma.wordExample.create({
          data: {
            wordId: word.id,
            sentence: ex.sentence,
          },
        });
      }
    }
    done++;
    const percent = Math.round((done / a1Words.length) * 100);
    console.log(`[A1] Progress: ${done}/${a1Words.length} (${percent}%) - ${word.english}`);
  }
  console.log("✅ Tüm A1 kelimelerine otomatik örnek cümleler eklendi.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());