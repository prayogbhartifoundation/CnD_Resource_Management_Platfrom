
function TopBar() {
  return (
    <div className="flex justify-between items-center text-sm px-4 py-1 bg-gray-100 border-b">
      <div className="flex space-x-2">
        <span>भारत सरकार</span>
        <span className="font-semibold">GOVERNMENT OF INDIA</span>
      </div>
      <div className="flex items-center space-x-3">
        <a href="#" className="hover:underline">
          SKIP TO MAIN CONTENT
        </a>
        <button className="text-lg">🔍</button>
        <button className="text-lg">A- A A+</button>
        <button className="text-lg">🌐</button>
        <select className="border rounded px-1 py-0.5 text-xs">
          <option>English</option>
          <option>Hindi</option>
        </select>
      </div>
    </div>
  );
}

export default TopBar;
