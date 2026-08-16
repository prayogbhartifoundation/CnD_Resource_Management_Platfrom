import makeInIndiaImg from "../assets/make_in_india.png";
import digitalIndiaImg from "../assets/digital_india.png";
import incredibleIndiaImg from "../assets/incredible_india.png";
import image from "../assets/image.png";

const cards = [
  {
    title: "Make in India",
    text: "This initiative was introduced to encourage multinational and national companies.",
    img: makeInIndiaImg
  },
  {
    title: "Digital India",
    text: "This program focuses on transforming India into a digitally empowered society.",
    img: digitalIndiaImg
  },
  {
    title: "Incredible India",
    text: "This is a marketing campaign to promote tourism in India.",
    img: incredibleIndiaImg
  },
];

const newsArticles = [
  {
    title: "EverEnviro inaugurates India’s largest C&D Material Recycling Facility",
    description: "EverEnviro opens India’s largest construction and demolition material recycling facility — setting a new standard in sustainable waste management.",
    img: "https://storage.googleapis.com/realtyplusmag-news-photo/news-photo/112454.EverEnviro-inaugurates-India%E2%80%99s-largest-C&D-material-recycling-facility-in-Delhi-new.jpg", // You can replace this with a screenshot or image URL
    link: "https://www.rprealtyplus.com/allied/everenviro-inaugurates-indias-largest-cd-material-recycling-facility-112454.html"
  },
  // {
  //   title: "India’s largest C&D waste processing plant powered by CFLO Technology unveiled",
  //   description: "Delhi CM Arvind Kejriwal inaugurates India’s largest C&D waste processing plant, featuring CFLO technology to boost recycling efficiency.",
  //   img: "https://cfloworld.com/media/r54fp4ff/featured-1200.jpg?v=1da0b9a20ada150", // Replace with screenshot if needed
  //   link: "https://cfloworld.com/news-events/news/2023/oct/indias-largest-cd-waste-processing-plant-powered-by-cflo-technology-unveiled-by-delhi-cm-arvind-kejriwal/"
  // },
  {
  title: "DPCC – Construction & Demolition Waste", 
  description: "Delhi Pollution Control Committee page on construction demolition waste regulations and guidelines.", 
  img: image,  // or external image
  link: "https://www.dpcc.delhigovt.nic.in/construction_demolition_waste#gsc.tab=0"
}
];


function Development() {
  return (
    <div className="px-6 py-12 bg-blue-50 text-center">
      {/* <h2 className="text-lg font-bold text-blue-700">More Development Endeavours</h2> */}
      <h3 className="text-2xl font-bold mb-6">C&D Offtake NCR Media Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {newsArticles.map((article, index) => (
    <a
      key={index}
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden transition-transform transform hover:-translate-y-1"
    >
      <img
        src={article.img}
        alt={article.title}
        className="h-48 w-full object-cover"
      />
      <div className="p-4 text-left">
        <h4 className="font-semibold text-lg mb-2 text-gray-800">{article.title}</h4>
        <p className="text-sm text-gray-600 line-clamp-3">{article.description}</p>
        <span className="text-orange-600 font-semibold text-sm mt-3 inline-block">
          Read More →
        </span>
      </div>
    </a>
  ))}
</div>
    </div>
  );
}

export default Development;
