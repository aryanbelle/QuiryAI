import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases as databases, DATABASE_ID, FORMS_COLLECTION_ID, RESPONSES_COLLECTION_ID, ID } from '@/lib/appwrite-server';

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
  }
];

// Helper functions for generating realistic data
function getRandomName() {
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Chris', 'Emma', 'Alex', 'Maria'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function getRandomEmail() {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const name = getRandomName().toLowerCase().replace(' ', '.');
  return `${name}@${domains[Math.floor(Math.random() * domains.length)]}`;
}

function getRandomFeedback(type: string) {
  const feedbacks: Record<string, string[]> = {
    'feedback': [
      'Great service overall, very satisfied with the experience.',
      'The product quality is excellent, but delivery could be faster.',
      'Customer support was very helpful and responsive.',
      'Good value for money, would recommend to others.',
      'The website is easy to use and navigate.'
    ],
    'suggestions': [
      'More training opportunities would be great.',
      'Better communication between departments needed.',
      'Flexible working hours would improve work-life balance.',
      'More team building activities.',
      'Career development programs.'
    ],
    'issues': [
      'Sometimes the app crashes on mobile.',
      'Loading times can be slow during peak hours.',
      'The search feature doesn\'t always work properly.',
      'Some buttons are hard to find.',
      'Performance issues on older devices.'
    ]
  };
  
  const options = feedbacks[type] || feedbacks['feedback'];
  return options[Math.floor(Math.random() * options.length)];
}

function generateResponses(form: any, count: number) {
  const responses = [];
  
  for (let i = 0; i < count; i++) {
    const response: Record<string, any> = {};
    
    form.fields.forEach((field: any) => {
      switch (field.type) {
        case 'text':
          if (field.id === 'name') {
            response[field.id] = getRandomName();
          } else {
            response[field.id] = 'Sample text response';
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
            const selectedCount = Math.floor(Math.random() * 3) + 1;
            const selected: string[] = [];
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
          const feedbackType = field.id.includes('feedback') ? 'feedback' : 
                              field.id.includes('suggestion') ? 'suggestions' : 'issues';
          response[field.id] = getRandomFeedback(feedbackType);
          break;
      }
    });
    
    // Add timestamp (spread over last 30 days)
    const daysAgo = Math.floor(Math.random() * 30);
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);
    
    responses.push({
      responses: response,
      submittedAt: timestamp.toISOString(),
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`
    });
  }
  
  return responses;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('🌱 Starting data seeding for user:', userId);
    
    const createdForms = [];
    
    // Create forms and responses
    for (const formData of sampleForms) {
      console.log(`📝 Creating form: ${formData.title}`);
      
      // Create form
      const form = await databases.createDocument(
        DATABASE_ID,
        FORMS_COLLECTION_ID,
        ID.unique(),
        {
          title: formData.title,
          description: formData.description,
          fields: JSON.stringify(formData.fields),
          isActive: formData.isActive,
          userId: userId
        }
      );
      
      console.log(`✅ Form created with ID: ${form.$id}`);
      createdForms.push(form);
      
      // Generate and create responses
      const responseCount = Math.floor(Math.random() * 20) + 15; // 15-35 responses per form
      const responses = generateResponses(formData, responseCount);
      
      console.log(`📊 Creating ${responses.length} responses...`);
      
      for (const responseData of responses) {
        await databases.createDocument(
          DATABASE_ID,
          RESPONSES_COLLECTION_ID,
          ID.unique(),
          {
            formId: form.$id,
            responses: JSON.stringify(responseData.responses),
            submittedAt: responseData.submittedAt,
            ipAddress: responseData.ipAddress
          }
        );
      }
      
      console.log(`✅ Created ${responses.length} responses for ${formData.title}`);
    }
    
    console.log('🎉 Data seeding completed successfully!');
    
    return NextResponse.json({
      success: true,
      message: `Created ${sampleForms.length} forms with realistic response data`,
      forms: createdForms.map(f => ({ id: f.$id, title: f.title }))
    });
    
  } catch (error: any) {
    console.error('❌ Error seeding data:', error);
    return NextResponse.json(
      { error: 'Failed to seed data', details: error.message },
      { status: 500 }
    );
  }
}