import React from 'react';

const HomeView = () => {
  return (
    <div className="mx-auto max-w-4xl p-6 font-sans">
      {/* Header Section */}
      <header className="mb-10">
        <h1>Welcome to Our Platform</h1>
        <h1 className="uppercase">Welcome to Our Platform</h1>
        <p>Your one-stop solution for all your needs. Simple, intuitive, and powerful.</p>
      </header>

      {/* Content Hierarchy Section */}
      <section className="mb-12">
        <h2 className="mb-6 border-b pb-2 text-2xl font-semibold text-gray-800">
          Content Structure Examples
        </h2>

        <div className="mb-8 space-y-2">
          <h1>Main Heading (h1)</h1>
          <p>Primary page title - used only once per page</p>
        </div>

        <div className="ml-4 space-y-3">
          <div>
            <h2>Section Title (h2)</h2>
            <p>Major section headings for content organization</p>
          </div>

          <div className="ml-6">
            <h3>Subsection (h3)</h3>
            <p>For grouping related content under h2 sections</p>
          </div>

          <div className="ml-8">
            <h4>Topic (h4)</h4>
            <p>Further content categorization</p>
          </div>

          <div className="ml-10">
            <h5>Subtopic (h5)</h5>
            <p>Detailed content headings</p>
          </div>

          <div className="ml-12">
            <h6>Minor Heading (h6)</h6>
            <p>Lowest level headings for fine details</p>
          </div>
        </div>
      </section>

      {/* Text Content Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Text Elements</h2>

        <div className="space-y-4">
          <p>
            This is a regular paragraph with readable line height and comfortable spacing. Good
            typography improves comprehension and user experience significantly.
          </p>

          <p>
            Another paragraph demonstrating proper spacing between content blocks. Notice how
            sufficient margin and padding make content more scannable.
          </p>

          <a
            href="#learn-more"
            className="inline-block font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800 hover:underline"
          >
            Learn more about our features →
          </a>
        </div>
      </section>

      {/* Interactive Elements Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Interactive Components</h2>

        {/* Buttons */}
        <div className="mb-8">
          <h3 className="mb-4 text-xl font-medium text-gray-800">Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
              Primary Action
            </button>
            <button className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
              Secondary Action
            </button>
            <button className="rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none">
              Tertiary Action
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="mb-8">
          <h3 className="mb-4 text-xl font-medium text-gray-800">Form Inputs</h3>

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                placeholder="Enter your first name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-shadow duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                placeholder="Enter your last name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-shadow duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Dropdown Select */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">Choose an Option</label>
            <select className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-shadow duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="" disabled selected>
                Select an option
              </option>
              <option value="option1">Premium Package</option>
              <option value="option2">Standard Package</option>
              <option value="option3">Basic Package</option>
            </select>
          </div>

          {/* Textarea */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Additional Comments
            </label>
            <textarea
              placeholder="Enter any additional comments or feedback here..."
              rows="4"
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 transition-shadow duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Additional Elements */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Additional Elements</h2>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h6>Quick Tips</h6>
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>Use proper heading hierarchy for accessibility</li>
            <li>Ensure sufficient contrast for readability</li>
            <li>Provide clear labels for form elements</li>
            <li>Maintain consistent spacing throughout</li>
            <li>Make interactive elements clearly identifiable</li>
          </ul>
        </div>
      </section>

      <br />
      <div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
        <p>
          Need help?{' '}
          <a href="#contact" className="text-blue-600 hover:underline">
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
};

export default HomeView;
