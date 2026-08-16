import emailIcon from "../assets/email.png";
import phoneIcon from "../assets/phone.png";

const Contact = () => {
  return (
    <div className=" bg-white flex flex-col items-center py-16 px-4">
      {/* Title */}
      <h2 className="text-4xl font-bold text-center text-green-600 mb-6">
        Get in Touch
      </h2>

      {/* Contact Form */}
      <div className="flex items-stretch justify-center">
      <div className="w-full max-w-lg bg-[#029054] p-8 rounded-xl shadow-md mb-10">
        <form className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Business Email*"
            required
            className="p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex">
            <span className="flex items-center px-3 bg-gray-100 border border-gray-300 rounded-l-md">
              +91
            </span>
            <input
              type="tel"
              placeholder="Phone Number"
              className="flex-1 p-3 bg-gray-100 rounded-r-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <textarea
            placeholder="Please describe what you need*"
            required
            className="p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
          ></textarea>
          <button
            type="submit"
            className="bg-orange-500 text-white py-3 rounded-md hover:bg-orange-700 transition font-semibold"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Email + Contact Info */}
      <div className="flex flex-col md:flex-row items-center justify-end gap-6 flex-wrap mt-6">
        {/* Email Card */}
        <a
          href="mailto:info.cnd@everenviro.com"
          className="flex flex-col items-center justify-center bg-[#029054] p-6 rounded-xl shadow-md w-full sm:w-64 text-center cursor-pointer transition-transform duration-300"
        >
          <div className="group transition-transform duration-300 hover:scale-110">
            <img
              src={emailIcon}
              alt="Email Icon"
              className="w-10 h-10 object-contain mb-2 mx-auto"
            />
            <h3 className="mt-2 text-gray-200 font-bold">Email Us</h3>
            <p className="text-gray-100">info.cnd@everenviro.com</p>
          </div>
        </a>

        {/* Contact Card */}
        <a
          href="tel:+918059071176"
          className="flex flex-col items-center justify-center bg-[#029054] p-6 rounded-xl shadow-md w-full sm:w-64 text-center cursor-pointer transition-transform duration-300"
        >
          <div className="group transition-transform duration-300 hover:scale-110">
            <img
              src={phoneIcon}
              alt="Phone Icon"
              className="w-10 h-10 object-contain mb-2 mx-auto"
            />
            <h3 className="mt-2 text-gray-200 font-bold">Contact Us</h3>
            <p className="text-gray-100">+91 80590 71176</p>
          </div>
        </a>
      </div>
      
      </div>
    </div>
  );
};

export default Contact;
