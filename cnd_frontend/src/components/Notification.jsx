function Notification({notification}) {
  const vnn = localStorage.getItem("vnn") === "true";

  return (
    <div className="flex flex-col sm:flex-row items-center bg-orange-500 text-white overflow-hidden w-full">
      {/* Static label */}
      <div className="px-4 sm:px-6 py-2 font-bold bg-orange-600 whitespace-nowrap w-full sm:w-auto text-center sm:text-left">
        Notification
      </div>

      {/* Scrolling text */}
      <div className="flex-1 overflow-hidden w-full">
        <div className="flex animate-marquee">
          {vnn ? (
            <>
              <p className="whitespace-nowrap py-2 text-sm sm:text-base commonText">
                For C&D products related enquiry please contact Rahul Yadav 8059071176 or Hashmat Raza 8826826444
              </p>
              <p className="whitespace-nowrap py-2 text-sm sm:text-base ml-8 commonText">
                For C&D products related enquiry please contact Rahul Yadav 8059071176 or Hashmat Raza 8826826444
              </p>
            </>
          ) : (
            <>
              <p className="whitespace-nowrap py-2 text-sm sm:text-base commonText">
                {notification ? notification : "For C&D products related enquiry please contact Rahul Yadav 8059071176 or Hashmat Raza 8826826444 |"}
                {notification ? notification : "For C&D products related enquiry please contact Rahul Yadav 8059071176 or Hashmat Raza 8826826444 |"}
                {/* For C&D products related enquiry please contact Rahul Yadav 8059071176 or Hashmat Raza 8826826444 | */}
              </p>
              <p className="whitespace-nowrap py-2 text-sm sm:text-base ml-8 commonText">
                {notification ? notification : "For C&D products related enquiry please contact Rahul Yadav 8059071176 or Hashmat Raza 8826826444 |"}
                {notification ? notification : "For C&D products related enquiry please contact Rahul Yadav 8059071176 or Hashmat Raza 8826826444 |"}
                {/* For C&D products related enquiry please contact Rahul Yadav 8059071176 or Hashmat Raza 8826826444 |
                For C&D products related enquiry please contact Rahul Yadav 8059071176 or Hashmat Raza 8826826444 | */}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notification;
