
function WelcomeSection() {
  return (
    <section className="px-6 py-6 flex">
      <div className="flex-1">
        <h2 className="font-bold text-lg">
          Welcome to{" "}
          <span className="text-orange-800">Ministry/Department</span>
        </h2>
        <p className="mt-2 text-gray-700">
          An informative text section that outlines the work portfolio of the
          ministry and the initiatives/ schemes and other useful purpose that the
          ministry website serves. An informative text section that outlines the
          work portfolio of the ministry and the initiatives/ schemes and other
          useful...
        </p>
      </div>
      <div className="ml-6">
        <div className="w-[135px] h-[154px] bg-gray-200 flex items-center justify-center text-gray-500">
          135 x 154
        </div>
      </div>
    </section>
  );
}

export default WelcomeSection;
