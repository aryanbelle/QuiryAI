const { Client, Databases, ID } = require('node-appwrite');

// Appwrite configuration
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const FORMS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_FORMS_COLLECTION_ID;
const RESPONSES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_RESPONSES_COLLECTION_ID;

// Your user ID (you'll need to get this from your account)
const USER_ID = 'your-user-id-here'; // We'll need to get this

// Sample forms data
const sampleForms = [
  {
    title: "Customer Satisfaction Survey",
    description: "Help us improve our services by sharing your feedback",
    fields: [
      { id: "name", type: "text", label: "Full Name", placeholder: "Enter your name", required: true },
      { id: "email", type: "email", label: "Email Address", placeholder: "your@email.com", required: true },
      { id: "rating", type: "radio", label: "Overall Satisfaction", required: true, options: ["Excellent", "Good", "Average", "Poor", "Very Poor"] },
      { id: "services", type: "checkbox", label: "Which services did you use?", options: ["Customer Support", "Product Quality", "Delivery", "Website Experience", "Pricing"] },
      { id: "feedback", type: "textarea", label: "Additional Comments", placeholder: "Share your thoughts..." },
      { id: "recommend", type: "radio", label: "Would you recommend us?", required: true, options: ["Definitely", "Probably", "Not Sure", "Probably Not", "Definitely Not"] }
    ],
    isActive: true
  },
  {
    title: "Employee Feedback Form",
    description: "Anonymous feedback to improve our workplace culture",
    fields: [
      { id: "department", type: "select", label: "Department", required: true, options: ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"] },
      { id: "experience", type: "radio", label: "Years of Experience", required: true, options: ["0-1 years", "2-5 years", "6-10 years", "10+ years"] },
      { id: "satisfaction", type: "radio", label: "Job Satisfaction", required: true, options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"] },
      { id: "worklife", type: "radio", label: "Work-Life Balance", required: true, options: ["Excellent", "Good", "Fair", "Poor"] },
      { id: "improvements", type: "checkbox", label: "Areas for Improvement", options: ["Communication", "Training", "Benefits", "Work Environment", "Management", "Career Growth"] },
      { id: "suggestions", type: "textarea", label: "Suggestions", placeholder: "How can we improve?" }
    ],
    isActive: true
  },
  {
    title: "Product Feedback Survey",
    description: "Tell us about your experience with our latest product",
    fields: [
      { id: "product", type: "select", label: "Which product?", required: true, options: ["Product A", "Product B", "Product C", "Product D"] },
      { id: "usage", type: "radio", label: "How often do you use it?", required: true, options: ["Daily", "Weekly", "Monthly", "Rarely"] },
      { id: "features", type: "checkbox", label: "Favorite Features", options: ["Easy to use", "Fast performance", "Great design", "Reliable", "Good value"] },
      { id: "rating", type: "radio", label: "Overall Rating", required: true, options: ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"] },
      { id: "issues", type: "textarea", label: "Any Issues?", placeholder: "Describe any problems..." },
      { id: "future", type: "radio", label: "Future Purchase Intent", options: ["Definitely will buy", "Probably will buy", "Might buy", "Probably won't buy", "Definitely won't buy"] }
    ],
    isActive: true
  },
  {
    title: "Event Registration Form",
    description: "Register for our upcoming tech conference",
    fields: [
      { id: "name", type: "text", label: "Full Name", required: true },
      { id: "email", type: "email", label: "Email", required: true },
      { id: "company", type: "text", label: "Company", required: true },
      { id: "role", type: "select", label: "Job Role", required: true, options: ["Developer", "Designer", "Manager", "CEO/Founder", "Student", "Other"] },
      { id: "experience", type: "radio", label: "Experience Level", required: true, options: ["Beginner", "Intermediate", "Advanced", "Expert"] },
      { id: "interests", type: "checkbox", label: "Session Interests", options: ["AI/ML", "Web Development", "Mobile Apps", "DevOps", "Cybersecurity", "Blockchain"] },
      { id: "dietary", type: "text", label: "Dietary Restrictions", placeholder: "Any dietary requirements?" }
    ],
    isActive: true
  },
  {
    title: "Website Usability Test",
    description: "Help us improve our website user experience",
    fields: [
      { id: "age", type: "select", label: "Age Group", required: true, options: ["18-25", "26-35", "36-45", "46-55", "55+"] },
      { id: "device", type: "radio", label: "Primary Device", required: true, options: ["Desktop", "Laptop", "Tablet", "Mobile Phone"] },
      { id: "ease", type: "radio", label: "Ease of Navigation", required: true, options: ["Very Easy", "Easy", "Neutral", "Difficult", "Very Difficult"] },
      { id: "design", type: "radio", label: "Design Rating", required: true, options: ["Love it", "Like it", "It's okay", "Don't like it", "Hate it"] },
      { id: "features", type: "checkbox", label: "Most Used Features", options: ["Search", "Navigation Menu", "Contact Form", "Product Pages", "Blog", "Support Chat"] },
      { id: "improvements", type: "textarea", label: "Suggested Improvements", placeholder: "What would make the website better?" }
    ],
    isActive: false
  }
];

// Generate realistic responses
function generateResponses(form, count = 50) {
  const responses = [];
  
  for (let i = 0; i < count; i++) {
    const response = {};
    
    form.fields.forEach(field => {
      switch (field.type) {
        case 'text':
          if (field.id === 'name') {
            response[field.id] = getRandomName();
          } else if (field.id === 'company') {
            response[field.id] = getRandomCompany();
          } else {
            response[field.id] = getRandomText(field.label);
          }
          break;
          
        case 'email':
          response[field.id] = getRandomEmail();
          break;
          
        case 'radio':
        case 'select':
          if (field.options) {
            response[field.id] = field.options[Math.floor(Math.random() * field.options.length)];
          }
          break;
          
        case 'checkbox':
          if (field.options) {
            const selectedCount = Math.floor(Math.random() * 3) + 1; // 1-3 selections
            const selected = [];
            for (let j = 0; j < selectedCount; j++) {
              const option = field.options[Math.floor(Math.random() * field.options.length)];
              if (!selected.includes(option)) {
                selected.push(option);
              }
            }
            response[field.id] = selected;
          }
          break;
          
        case 'textarea':
          response[field.id] = getRandomFeedback(field.label);
          break;
      }
    });
    
    // Add timestamp (spread over last 30 days)
    const daysAgo = Math.floor(Math.random() * 30);
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);
    
    responses.push({
      formId: '', // Will be set when form is created
      responses: response,
      submittedAt: timestamp.toISOString(),
      ipAddress: getRandomIP()
    });
  }
  
  return responses;
}

// Helper functions for generating realistic data
function getRandomName() {
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Chris', 'Emma', 'Alex', 'Maria', 'James', 'Anna', 'Robert', 'Emily', 'Michael'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function getRandomEmail() {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com'];
  const name = getRandomName().toLowerCase().replace(' ', '.');
  return `${name}@${domains[Math.floor(Math.random() * domains.length)]}`;
}

function getRandomCompany() {
  const companies = ['TechCorp', 'InnovateLab', 'DataSystems', 'CloudWorks', 'StartupHub', 'DigitalFlow', 'CodeCraft', 'WebSolutions', 'AppDev Inc', 'TechStart'];
  return companies[Math.floor(Math.random() * companies.length)];
}

function getRandomText(label) {
  const texts = {
    'dietary': ['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'No nuts', 'Lactose intolerant'],
    'default': ['Great experience', 'Good service', 'Could be better', 'Excellent work', 'Very satisfied']
  };
  
  const options = texts[label.toLowerCase()] || texts.default;
  return options[Math.floor(Math.random() * options.length)];
}

function getRandomFeedback(label) {
  const feedbacks = {
    'feedback': [
      'Great service overall, very satisfied with the experience.',
      'The product quality is excellent, but delivery could be faster.',
      'Customer support was very helpful and responsive.',
      'Good value for money, would recommend to others.',
      'The website is easy to use and navigate.',
      'Some features could be improved, but overall positive experience.',
      'Fast delivery and good packaging.',
      'The team was professional and knowledgeable.',
      'Could use more variety in product options.',
      'Excellent communication throughout the process.'
    ],
    'suggestions': [
      'More training opportunities would be great.',
      'Better communication between departments needed.',
      'Flexible working hours would improve work-life balance.',
      'More team building activities.',
      'Upgrade the office equipment and software.',
      'Regular feedback sessions with management.',
      'Career development programs.',
      'Better health and wellness benefits.',
      'More recognition for good work.',
      'Improved workspace environment.'
    ],
    'improvements': [
      'The search function could be more intuitive.',
      'Loading times are sometimes slow.',
      'Mobile version needs improvement.',
      'More detailed product descriptions needed.',
      'Better filtering options would help.',
      'The checkout process could be simplified.',
      'More payment options would be useful.',
      'Better customer support chat.',
      'More visual content and images.',
      'Clearer navigation structure.'
    ],
    'issues': [
      'Sometimes the app crashes on mobile.',
      'Loading times can be slow during peak hours.',
      'The search feature doesn\'t always work properly.',
      'Some buttons are hard to find.',
      'The interface could be more user-friendly.',
      'Occasional sync issues between devices.',
      'Some features are not intuitive.',
      'Performance issues on older devices.',
      'Limited customization options.',
      'Could use better error messages.'
    ]
  };
  
  const key = Object.keys(feedbacks).find(k => label.toLowerCase().includes(k)) || 'feedback';
  const options = feedbacks[key];
  return options[Math.floor(Math.random() * options.length)];
}

function getRandomIP() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

// Main seeding function
async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');
    
    // Create forms and responses
    for (const formData of sampleForms) {
      console.log(`📝 Creating form: ${formData.title}`);
      
      // Create form
      const form = await databases.createDocument(
        DATABASE_ID,
        FORMS_COLLECTION_ID,
        ID.unique(),
        {
          ...formData,
          userId: USER_ID,
          fields: JSON.stringify(formData.fields),
          createdAt: new Date().toISOString()
        }
      );
      
      console.log(`✅ Form created with ID: ${form.$id}`);
      
      // Generate and create responses
      const responses = generateResponses(formData, Math.floor(Math.random() * 30) + 20); // 20-50 responses per form
      
      console.log(`📊 Creating ${responses.length} responses...`);
      
      for (const responseData of responses) {
        responseData.formId = form.$id;
        
        await databases.createDocument(
          DATABASE_ID,
          RESPONSES_COLLECTION_ID,
          ID.unique(),
          {
            formId: responseData.formId,
            responses: JSON.stringify(responseData.responses),
            submittedAt: responseData.submittedAt,
            ipAddress: responseData.ipAddress
          }
        );
      }
      
      console.log(`✅ Created ${responses.length} responses for ${formData.title}`);
    }
    
    console.log('🎉 Data seeding completed successfully!');
    console.log(`📈 Created ${sampleForms.length} forms with realistic response data`);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

// Export for use
module.exports = { seedData };

// Run if called directly
if (require.main === module) {
  seedData();
}