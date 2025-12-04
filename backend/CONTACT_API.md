# 📧 Contact Form API Documentation

## Base URL
```
http://127.0.0.1:8000/api/contact/
```

---

## 🎯 Contact Form Features

✅ **Public Submission** - Anyone can submit (no login required)  
✅ **Message Tracking** - Track if messages are read  
✅ **Admin Management** - View submissions in admin panel  
✅ **Simple & Easy** - Straightforward submission process  

---

## 📝 Contact Form Endpoint

### Submit Contact Form

**Endpoint:** `POST /api/contact/`

**Description:** Submit a contact form message. No authentication required.

**Authentication:** Not Required (Public endpoint)

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone_number": "+1234567890",
  "subject": "Question about products",
  "message": "I would like to know more about your wellness products. Are they suitable for daily use?"
}
```

**Response (201 Created):**
```json
{
  "message": "Thank you for contacting us! We will get back to you soon.",
  "submission": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+1234567890",
    "subject": "Question about products",
    "message": "I would like to know more about your wellness products. Are they suitable for daily use?",
    "is_read": false,
    "created_at": "2025-01-27T10:30:00Z"
  }
}
```

**Validation Errors (400):**
```json
{
  "name": ["This field is required."],
  "email": ["Enter a valid email address."],
  "subject": ["This field is required."],
  "message": ["This field is required."]
}
```

**Field Requirements:**
- **name** - Required (max 200 characters)
- **email** - Required (valid email format)
- **phone_number** - Optional (max 15 characters)
- **subject** - Required (max 200 characters)
- **message** - Required (text field)

---

## 💡 Usage Examples

### Submit Contact Form (JavaScript)

```typescript
const submitContactForm = async (formData) => {
  const response = await fetch('http://127.0.0.1:8000/api/contact/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  
  if (!response.ok) {
    const errors = await response.json();
    throw new Error(JSON.stringify(errors));
  }
  
  return await response.json();
};

// Usage:
const contactData = {
  name: 'John Doe',
  email: 'john@example.com',
  phone_number: '+1234567890',
  subject: 'Question about products',
  message: 'I would like to know more about your wellness products.'
};

submitContactForm(contactData)
  .then(result => {
    alert(result.message);
    console.log('Submission ID:', result.submission.id);
  })
  .catch(error => {
    console.error('Error:', error.message);
    alert('Failed to submit. Please try again.');
  });
```

### React Hook Example

```typescript
import { useState } from 'react';

const useContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitForm = async (formData: {
    name: string;
    email: string;
    phone_number?: string;
    subject: string;
    message: string;
  }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errors = await response.json();
        throw new Error(JSON.stringify(errors));
      }

      const result = await response.json();
      setSuccess(true);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitForm, loading, error, success };
};

// Usage in component:
const ContactPage = () => {
  const { submitForm, loading, error, success } = useContactForm();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitForm(formData);
      // Form submitted successfully
      setFormData({ name: '', email: '', phone_number: '', subject: '', message: '' });
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Thank you! We'll get back to you soon.</div>}
    </form>
  );
};
```

### HTML Form Example

```html
<form id="contactForm">
  <input type="text" name="name" placeholder="Your Name" required>
  <input type="email" name="email" placeholder="Your Email" required>
  <input type="tel" name="phone_number" placeholder="Phone Number (optional)">
  <input type="text" name="subject" placeholder="Subject" required>
  <textarea name="message" placeholder="Your Message" required></textarea>
  <button type="submit">Send Message</button>
</form>

<script>
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await fetch('http://127.0.0.1:8000/api/contact/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      alert(result.message);
      e.target.reset();
    } else {
      alert('Failed to submit. Please check your inputs.');
    }
  } catch (error) {
    alert('Network error. Please try again.');
  }
});
</script>
```

---

## 🔑 Important Notes

### Public Access
- **No authentication required** - Anyone can submit contact forms
- **No rate limiting** - Consider adding if spam becomes an issue
- **Email validation** - Server validates email format

### Message Tracking
- New submissions have `is_read: false`
- Admin can mark messages as read in Django admin panel
- Useful for tracking unread inquiries

### Admin Access
- All submissions are stored in database
- View/manage in Django admin: `/admin/api/contactsubmission/`
- Can mark messages as read/unread
- Filter by date, email, subject, read status

### Data Storage
- All submissions are permanently stored
- Consider GDPR/privacy compliance
- May want to add data retention policies

---

## ✅ Features Implemented

- ✅ Public contact form submission
- ✅ Email validation
- ✅ Message tracking (read/unread)
- ✅ Admin panel integration
- ✅ Timestamp tracking
- ✅ Optional phone number field

---

**Contact API is ready to use!** 📧

