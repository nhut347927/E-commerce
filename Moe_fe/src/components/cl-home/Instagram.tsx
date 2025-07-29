import ig1 from "../../assets/img/instagram/instagram-1.jpg";
import ig2 from "../../assets/img/instagram/instagram-2.jpg";
import ig3 from "../../assets/img/instagram/instagram-3.jpg";
import ig4 from "../../assets/img/instagram/instagram-4.jpg";
import ig5 from "../../assets/img/instagram/instagram-5.jpg";
import ig6 from "../../assets/img/instagram/instagram-6.jpg";

const Instagram = () => {
  const images = [ig1, ig2, ig3, ig4, ig5, ig6];

  return (
    <section>
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-16 ">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="w-full sm:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-3">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="aspect-square w-full sm:w-60 bg-center bg-cover"
                  style={{ backgroundImage: `url(${img})` }}
                />
              ))}
            </div>
          </div>
          <div className="w-full sm:w-1/3 flex">
            <div className="my-auto">
              <h2 className="text-3xl font-bold">Instagram</h2>
              <p className="text-gray-700 mt-6 mb-12">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <h3 className="text-2xl text-red-600 font-normal">#Male_Fashion</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Instagram;
