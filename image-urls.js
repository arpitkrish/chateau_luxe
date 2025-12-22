// Image URLs for Chateau Luxe Hotel
// Copy these URLs and save the images to public/images/ folder

const imageUrls = {
  // General Images
  logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop&crop=center',
  'footer-logo': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop&crop=center',
  hotel: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=600&fit=crop&crop=center',
  room: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop&crop=center',
  food: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop&crop=center',
  'user-avatar': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',

  // Room Images
  'deluxe-room': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop&crop=center',
  suite: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&crop=center',
  'standard-room': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop&crop=center',
  'executive-suite': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop&crop=center',
  'presidential-suite': 'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=400&h=300&fit=crop&crop=center',
  'family-suite': 'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=400&h=300&fit=crop&crop=center',

  // Food Images (with working URLs)
  'butter-chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop&crop=center',
  'paneer-tikka': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop&crop=center',
  biryani: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop&crop=center',
  'ras-malai': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&crop=center',
  'masala-chai': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
  'palak-paneer': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop&crop=center',
  'chicken-65': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop&crop=center',
  'gulab-jamun': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&crop=center',
  'aloo-gobi': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&crop=center',
  lassi: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop&crop=center',
  'samosa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&crop=center',
  'pakora': 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop&crop=center',
  'chicken-tikka': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&crop=center',
  'fish-curry': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop&crop=center',
  'mutton-rogan-josh': 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=300&fit=crop&crop=center',
  'dal-makhani': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center',
  'chana-masala': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&crop=center',
  'pani-puri': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&crop=center',
  'kachori': 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop&crop=center',
  'jalebi': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&crop=center',
  'ras-gulla': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&crop=center',
  'kulfi': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&crop=center',
  'coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&crop=center',
  'fresh-juice': 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop&crop=center',
  'mocktail': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop&crop=center',
  'thandai': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop&crop=center',

  // Facility Images
  swimming: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop&crop=center',
  gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop&crop=center',
  spa: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop&crop=center',
  conference: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center',
  parking: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400&h=300&fit=crop&crop=center'
};

// Instructions:
// 1. Open each URL in your browser
// 2. Right-click and "Save image as..."
// 3. Save to the public/images/ folder with the corresponding filename
// 4. For example: logo URL -> save as public/images/logo.png

console.log('Image URLs for Chateau Luxe Hotel:');
Object.entries(imageUrls).forEach(([filename, url]) => {
  console.log(`${filename}: ${url}`);
});

module.exports = imageUrls;