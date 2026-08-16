const PlantPage = ({propData}) => {
    return (
        <div className="flex flex-col min-h-screen min-w-[95%] p-4 font-sans box-border mx-auto">
  {/* Header Section */}
  <div className="text-[#325A58] text-center p-4 text-xl font-bold">
    {propData}Plant Name and Location
  </div>

  {/* Branding Section */}
  <section className="grid grid-cols-1 lg:grid-cols-[1fr_3fr_1fr] gap-4 my-4">
    <div className="bg-[#e7ebed] p-8 text-center rounded-lg font-bold text-black">
      <p>Plant Branding (Logo)</p>
    </div>
    <div className="bg-[#e7ebed] text-center rounded-lg text-black flex items-center justify-center p-8">
      <h3>Plant Branding Highlights, Messages</h3>
    </div>
    <div className="bg-[#e7ebed] p-8 text-center rounded-lg font-bold text-black">
      <p>Plant Incharge</p>
    </div>
  </section>

  {/* Waste Processing Section */}
  <h3 className="text-center text-[#325A58] text-xl font-bold mb-6">
    Waste Processing Details
  </h3>

  <section className="bg-[#54c0ca] p-4 rounded-lg mb-6">
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4">
      <div className="bg-[#e7ebed] p-10 text-center rounded-lg font-bold text-black">
        <p>Installed Waste Capacity</p>
      </div>
      <div className="bg-[#e7ebed] p-10 text-center rounded-lg font-bold text-black">
        <p>Processed Material Types and Quantities</p>
      </div>
      <div className="bg-[#e7ebed] p-10 text-center rounded-lg font-bold text-black">
        <p>Plant Contact Details</p>
      </div>
      <div className="bg-[#e7ebed] p-40 text-center rounded-lg font-bold text-black">
        <p>Operation Details</p>
      </div>
    </div>
  </section>

  {/* Compliance Section */}
  <section className="bg-white p-4 rounded-lg mb-6 text-center">
    <h3 className="text-[#325A58] text-xl font-bold mb-6">
      Compliance & Material Test Reports
    </h3>
    <div className="flex justify-center flex-wrap gap-4">
      <button className="bg-white p-24 border-none rounded-lg font-bold text-black text-center min-w-[150px] shadow-md hover:bg-[#d0d7db] transition">
        Doc Button Card
      </button>
      <button className="bg-white p-24 border-none rounded-lg font-bold text-black text-center min-w-[150px] shadow-md hover:bg-[#d0d7db] transition">
        Doc Button Card
      </button>
      <button className="bg-white p-24 border-none rounded-lg font-bold text-black text-center min-w-[150px] shadow-md hover:bg-[#d0d7db] transition">
        Doc Button Card
      </button>
    </div>
  </section>
</div>

    )
};

export default PlantPage;