// Stories data structure
export interface Story {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  readingMinutes: number;
  featured?: boolean;
}

export const stories: Story[] = [
  {
    id: "1",
    slug: "renaissance-panel",
    title: "The Renaissance panel that tripled its estimate",
    excerpt: "How expert authentication and provenance research turned a forgotten piece into the highlight of our spring auction.",
    category: "Market Insight",
    tags: ["authentication", "provenance", "renaissance", "art"],
    coverImage: "/images/fine-art.jpg",
    author: {
      name: "Shahidul Islam",
    },
    publishedAt: "2024-09-15",
    readingMinutes: 5,
    featured: true,
    content: `
# The Renaissance panel that tripled its estimate

When Maria Gonzalez brought us what appeared to be a damaged 16th-century panel painting, she had modest expectations. The work, inherited from her grandmother, had been stored in an attic for decades, its surface darkened by age and neglect.

## Initial Assessment

Our specialists immediately recognized the quality of the underlying brushwork, despite the painting's poor condition. The composition, featuring a Madonna and Child, showed characteristics consistent with the Venetian school of the late Renaissance.

## The Investigation Begins

Dr. Elena Rossi, our Head of Old Master Paintings, initiated a comprehensive authentication process:

- **Technical analysis**: X-ray imaging revealed earlier compositions beneath the surface
- **Pigment analysis**: Confirmed the use of period-appropriate materials
- **Provenance research**: Traced the work through historical records

## A Remarkable Discovery

After months of research, we made an extraordinary discovery. The panel was attributed to a follower of Giovanni Bellini, one of the most influential Venetian painters of the Renaissance. 

The painting's provenance could be traced to a private collection in Venice, then to Paris in the early 20th century, before disappearing during World War II.

## Conservation and Restoration

Our conservation team spent six weeks carefully cleaning and restoring the panel. As layers of dirt and overpainting were removed, the true beauty of the work emerged. The Virgin's serene expression and the Christ child's delicate features revealed the hand of a master craftsman.

## Auction Day Results

The painting, originally estimated at $15,000-20,000, generated intense bidding from collectors worldwide. The final hammer price of $68,000 reflected not just the work's artistic merit, but the compelling story of its rediscovery.

## Lessons Learned

This case demonstrates the importance of professional evaluation for inherited artworks. What may appear damaged or insignificant could potentially be a masterpiece waiting to be rediscovered.

*If you have artworks you'd like evaluated, our specialists are available for confidential consultations.*
    `
  },
  {
    id: "2",
    slug: "collector-journey",
    title: "From inheritance to investment: A collector's journey",
    excerpt: "Meet Robert Chen, who transformed his grandfather's modest collection into a curated portfolio of contemporary art.",
    category: "Collector Profile",
    tags: ["collector", "contemporary", "investment", "strategy"],
    coverImage: "/images/jewelry.webp",
    author: {
      name: "Dr Yunus",
    },
    publishedAt: "2024-09-10",
    readingMinutes: 3,
    content: `
# From inheritance to investment: A collector's journey

Robert Chen never expected to become a serious art collector. When his grandfather passed away five years ago, Robert inherited a modest collection of mid-century ceramics and a few landscape paintings.

## The Awakening

"I was going to sell everything," Robert admits. "But my wife suggested we get them appraised first." That appraisal changed everything. One of the ceramics was by a renowned studio artist, worth significantly more than expected.

## Building Knowledge

Rather than selling immediately, Robert began researching. He attended gallery openings, read auction catalogs, and most importantly, started asking questions. "I realized collecting wasn't just about buying things you like – it's about understanding context, provenance, and market dynamics."

## Strategic Collecting

Over the next three years, Robert carefully sold pieces from his inherited collection and reinvested in contemporary works. His focus: emerging artists from his region with strong gallery representation.

"I learned to look for artists who were having museum shows, not just commercial success," he explains. "Long-term value comes from art historical significance."

## The Portfolio Approach

Today, Robert's collection has grown to over 40 pieces, with works ranging from $2,000 to $25,000. His strategy combines emotional connection with market analysis.

"Every piece should speak to you personally, but you also need to understand why others might value it in the future."

## Advice for New Collectors

Robert's recommendations for those starting their collecting journey:

1. **Start small**: Buy what you love within your budget
2. **Educate yourself**: Visit museums, read, attend talks
3. **Build relationships**: Connect with galleries and other collectors
4. **Think long-term**: Collecting is a marathon, not a sprint
5. **Trust professionals**: Work with reputable dealers and auction houses

*Interested in building your own collection? Our specialists can provide guidance on collecting strategies and market opportunities.*
    `
  },
  {
    id: "3",
    slug: "authentication-process",
    title: "The authentication process: From submission to sale",
    excerpt: "Take a behind-the-scenes look at how our experts verify authenticity and determine estimates for consigned works.",
    category: "Behind the Scenes",
    tags: ["authentication", "process", "expertise", "verification"],
    coverImage: "/images/watches.jpg",
    author: {
      name: "Ali Yusuf",
    },
    publishedAt: "2024-09-05",
    readingMinutes: 4,
    content: `
# The authentication process: From submission to sale

Ever wondered what happens when you consign a piece to auction? Our authentication process combines traditional connoisseurship with cutting-edge technology to ensure every lot meets our standards.

## Initial Consultation

When a potential consignment arrives, our specialists begin with a visual examination. We're looking for:

- **Style and technique**: Does it match the artist's known methods?
- **Materials**: Are they consistent with the period?
- **Condition**: What restoration or damage is evident?
- **Provenance**: What's the ownership history?

## Technical Analysis

For high-value works, we employ scientific analysis:

### Imaging Technologies
- **UV fluorescence**: Reveals restoration and overpainting
- **X-radiography**: Shows underlying compositions and structural changes
- **Infrared reflectography**: Exposes underdrawings and pentimenti

### Material Analysis
- **Pigment analysis**: Confirms period-appropriate materials
- **Canvas/support examination**: Verifies age and origin
- **Binding media analysis**: Identifies oil, tempera, or other techniques

## Research and Documentation

Our research team investigates:

- **Catalogue raisonnés**: Comprehensive records of an artist's work
- **Exhibition histories**: Museum and gallery show records
- **Literature references**: Publications mentioning the work
- **Auction records**: Previous sales and ownership changes

## Expert Consultation

Complex attributions may require external expertise:

- **Authentication boards**: Some artist estates maintain formal committees
- **Independent scholars**: Specialists with deep knowledge of specific artists
- **Museum curators**: Institutional experts who've studied similar works

## Condition Assessment

Our conservators provide detailed condition reports:

- **Structural integrity**: Canvas, panel, or sculptural stability
- **Surface condition**: Paint losses, discoloration, previous restoration
- **Treatment recommendations**: Necessary conservation before sale

## Estimate Setting

Based on all gathered information, we establish estimates considering:

- **Comparable sales**: Recent auction results for similar works
- **Market trends**: Current collector interest and demand
- **Rarity**: How often similar works appear at auction
- **Condition impact**: How condition affects value

## Final Approval

A committee of senior specialists reviews each consignment, ensuring:

- Authenticity is established beyond reasonable doubt
- Estimates reflect current market conditions
- Legal title is clear and undisputed
- The work meets our quality standards

## Ongoing Monitoring

Even after acceptance, we continue monitoring:

- **New research**: Scholarship that might affect attribution
- **Market changes**: Shifts in collector interest or values
- **Condition changes**: Environmental or handling effects

This rigorous process typically takes 2-4 weeks for most works, though complex cases may require additional time. Our goal is not just to sell art, but to maintain the trust that makes collecting possible.

*Considering consigning a work? Contact our specialists for a confidential consultation about our authentication and evaluation process.*
    `
  }
];

export function getStoryBySlug(slug: string): Story | undefined {
  return stories.find(story => story.slug === slug);
}

export function getFeaturedStories(): Story[] {
  return stories.filter(story => story.featured);
}

export function getStoriesByCategory(category: string): Story[] {
  return stories.filter(story => story.category === category);
}