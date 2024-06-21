const { CohereClient } = require('cohere-ai');

const cohereApiKey = process.env.DIV_COHERE_API_KEY;

const cohere = new CohereClient({
  token: cohereApiKey,
});

// Provides implementation for classifying articles as deeply interesting or
// not deeply interesting based on the title
const articleClassifications = {
    "interesting": [
        "Bessemer Venture Partners' Anti-Portfolio",
        "Why does JavaScript need a style guide? (2013)",
        "How is science even possible?",
        "Why money can't buy happiness?",
        "Let's Write a Letter of Reconciliation",
        "Navy project brings promise of cloud to the middle of the ocean",
        "3D resume with infinite zoom",
        "Is Kotlin Multiplatform Replacing Flutter?",
        "Show HN: Eidos - Offline Alternative to Notion",
        "Zepto, a YC-backed 10-min delivery app in India, raises $665M at $3.6B valuation",

        // self-made examples
        "Understanding the Brain's GPS System",
        "The Untold Story of the World's Most Resilient Coral",
        "How Ancient Civilizations Kept Time",
        "The Science Behind Memory and Forgetting",
        "The Economic Impact of Quantum Computing",
        "How Machine Learning is Revolutionizing Healthcare",
        "The Future of Renewable Energy Technologies",
        "A Deep Dive into Blockchain and Its Applications",
        "The Role of AI in Climate Change Mitigation",
        "Exploring the Mysteries of Dark Matter",
        "The Evolution of Human Language",
        "How Autonomous Vehicles Will Change Urban Planning",
        "The History and Future of Space Exploration",
        "How Algorithms Shape Our World",
        "The Psychological Effects of Social Media",
        "How Deep Learning is Transforming Industries",
        "The Ethics of Artificial Intelligence",
        "How the Internet of Things is Changing Our Lives",
        "The Science of Happiness: What Really Makes Us Happy?",
        "The Impact of Globalization on Local Cultures",
        "How CRISPR is Changing the Future of Genetic Engineering"
    ],
    "not-interesting": [
        "South Korea will consider supplying arms to Ukraine",
        "I'm a non-technical founder looking for technical co-founder",
        "Hitchhiker's Guide to the Galaxy Text Adventure",
        "Show HN: My website's TOS is cooler than yours",
        "A Rant about Front-end Development",
        "US bans sales of Kaspersky antivirus software over Russia ties",
        "[dupe] Donald Sutherland Has Died",
        // Note that this was an actual article title on HackerNews
        "Elon Musk is trying to woo advertisers after telling them to 'go fuck yourself'",
        "Citing national security, US will ban Kaspersky anti-virus software in July",
        "Tesla owners file class-action alleging repair, parts monopoly",

        // self-made examples
        "Celebrity X spotted at Y event",
        "Top 10 Cutest Puppies of 2023",
        "Why This Famous Actor's Divorce is Making Headlines",
        "This Viral Video Will Make You Laugh Out Loud",
        "Top Fashion Trends This Summer",
        "Local Bakery Opens New Branch",
        "This Diet Will Help You Lose Weight Fast",
        "10 Amazing Facts About Cats",
        "You Won't Believe What This Politician Said",
        "Top 5 Beaches to Visit This Summer",
        "How to Take the Perfect Selfie",
        "The Best Recipes for Your Summer BBQ",
        "This New Phone Case is Taking the Market by Storm",
        "The Latest Celebrity Gossip",
        "Funny Memes That Will Make Your Day",
        "Why This TV Show is the Best Ever",
        "This New App Will Change Your Life",
        "Top 10 Vacation Spots for 2023",
        "This New Haircut is Trending Now",
        "How to Get More Followers on Social Media",
        "The Latest News on Your Favorite Reality TV Show"
    ]
}

// Converts articleClassifications to a format acceptable for the cohere.classify()
// method
function convertClassificationsToList(classifications) {
    const cohereClassifyList = [];
    for(const category in classifications) {
        const items = classifications[category];
        for(const item of items) {
            cohereClassifyList.push({
                text: item,
                label: category
            });
        }
    }
    return cohereClassifyList;
}

function classifyArticleTitles(articleTitles) {
    return cohere.classify({
        examples: convertClassificationsToList(articleClassifications),
        inputs: articleTitles
    });
}

// Meant for testing the classifyArticleTitles function
async function classifyArticleTitlesTest() {
    const classify = await classifyArticleTitles([
        "Actor Donald Sutherland dead at 88",
        "Brandon Sanderson on Writing Science Fiction and Fantasy",
        "Citing national security, US will ban Kaspersky anti-virus software in July",
        "Walking to combat back pain",
        "Documenting Software Architectures"
    ]);
    const results = classify.classifications.map((item) => item.prediction);
    console.log(results);
}

module.exports = classifyArticleTitles;