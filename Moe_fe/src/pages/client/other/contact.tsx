import React, { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<Errors>({});

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    const requiredFields: (keyof FormData)[] = ['name', 'email', 'message'];

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field cannot be empty';
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };



  return (
    <div>
    
      {/* Map Section */}
      <div className="w-full h-[500px] mb-20">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111551.9926412813!2d-90.27317134641879!3d38.606612219170856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54eab584e432360b%3A0x1c3bb99243deb742!2sUnited%20States!5e0!3m2!1sen!2sbd!4v1597926938024!5m2!1sen!2sbd"
          className="w-full h-full border-0"
          allowFullScreen
          aria-hidden="false"
          tabIndex={0}
        ></iframe>
      </div>

      {/* Contact Section */}
      <section className="max-w-7xl w-full mx-auto px-3 sm:px-16 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            <div className="text-left">
              <span className="text-sm text-red-600 uppercase tracking-widest">Information</span>
              <h2 className="text-4xl font-bold text-gray-800 my-6">Contact Us</h2>
              <p className="text-sm text-gray-600 leading-loose">
                As you might expect of a company that began as a high-end interiors contractor, we pay strict attention.
              </p>
            </div>
            <ul className="mt-6 space-y-6 ">
              <li>
                <h4 className="text-xl font-semibold text-gray-800">America</h4>
                <p className="text-sm text-gray-600 leading-loose">
                  195 E Parker Square Dr, Parker, CO 801 <br /> +43 982-314-0958
                </p>
              </li>
              <li>
                <h4 className="text-xl font-semibold text-gray-800">France</h4>
                <p className="text-sm text-gray-600 leading-loose">
                  109 Avenue Léon, 63 Clermont-Ferrand <br /> +12 345-423-9893
                </p>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div>
            <form  className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className={`h-12 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className={`h-12 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
              <div>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Message"
                  className={`min-h-44 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                    errors.message ? 'border-red-500' : ''
                  }`}
                  rows={5}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
              <Button
                type="submit"
                className="h-12 w-full bg-black hover:bg-black/70 uppercase tracking-widest text-white rounded-none"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;