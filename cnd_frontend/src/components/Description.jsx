const Description = ({ vnn }) => {
  return (
    <>
      {!vnn && (
        // <section className="w-full overflow-x-hidden bg-white px-4 sm:px-6 lg:px-12">
        //   <div className="bg-white mx-auto my-4 p-4 sm:p-6 lg:p-8 rounded-lg italic text-center leading-relaxed shadow-sm border border-gray-200 max-w-5xl">
        //     <p className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl">
        //       {/* cndofftakencr.in */}
        //       This is a public portal for{" "}
        //       <strong className="not-italic font-semibold">
        //         Construction & Demolition (C&D) waste management
        //       </strong>{" "}
        //       in the NCR, showcasing offtake data and products made from recycled
        //       waste by leading agencies including{" "}
        //       <strong className="not-italic font-semibold">
        //         Indo Enviro Integrated Solutions (P) Ltd
        //       </strong>
        //       ,{" "}
        //       <strong className="not-italic font-semibold">
        //         Uttar Dilli C&D Waste Recycling (P) Ltd
        //       </strong>
        //       ,{" "}
        //       <strong className="not-italic font-semibold">
        //         Rise Eleven Delhi Waste Management Co.
        //       </strong>
        //       , and{" "}
        //       <strong className="not-italic font-semibold">
        //         Ramky Reclamation & Recycling Ltd.
        //       </strong>
        //     </p>
        //   </div>
        // </section>
        <section id="description" className="w-full bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg italic text-center leading-relaxed shadow-sm border border-gray-200">
              <p className="text-gray-700 text-[16px] ">
                This is a public portal for{" "}
                <strong className="not-italic font-semibold">
                  Construction & Demolition (C&D) waste management
                </strong>{" "}
                in the NCR, showcasing offtake data and products made from recycled
                waste by leading agencies including{" "}
                <strong className="not-italic font-semibold">
                  Indo Enviro Integrated Solutions (P) Ltd.
                </strong>
                ,{" "}
                <strong className="not-italic font-semibold">
                  Uttar Dilli C&D Waste Recycling (P) Ltd
                </strong>
                ,{" "}
                <strong className="not-italic font-semibold">
                  Rise Eleven Delhi Waste Management Co.
                </strong>
                , and{" "}
                <strong className="not-italic font-semibold">
                  Ramky Reclamation & Recycling Ltd.
                </strong>
                .
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Description;
