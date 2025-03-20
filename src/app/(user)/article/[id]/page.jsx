import { articles } from "../data";

export default function ArticleDetail({ params }) {
  const article = articles.find((a) => a.id === parseInt(params.id));

  if (!article) return <h1 className="text-center mt-10">Artikel tidak ditemukan</h1>;

  return (
    <div className="max-w-screen w-full relative">
      {/* Shadow Biru di Bawah Gambar */}
      <div className="relative">
        <img src={article.image} alt={article.title} className="w-full h-[534px] object-cover" />
        <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-[100%] h-5 bg-mainBlue blur-xl opacity-100"></div>
      </div>

      {/* Judul */}
      <h1 className="text-3xl font-bold mt-6 text-center py-4 text-secondBlue">
        {article.title}
      </h1>

      {/* Penulis & Tanggal Terbit */}
      <div className="flex justify-between text-mainGrey text-sm px-8">
        <span>Written by {article.author}</span>
        <span>{article.date}</span>
      </div>

      {/* Deskripsi Artikel */}
      <p className="text-black text-justify pb-8 px-16 mt-4">{article.description}</p>

      {/* Sumber & Tags */}
      <div className="border-t border-gray-300 py-4 px-8">
        <div className="px-8 pb-4 flex gap-2 flex-wrap">
          <span className="text-md text-black ">Sumber :</span>
          <span className="bg-mainBlue text-white text-sm px-3 py-1 rounded-full">
            {article.source}
          </span>
        </div>

        <div className="px-8 pb-8 flex gap-2 flex-wrap">
          <span className="text-md text-black ">Tags : </span>
            {article.tags.map((tag, index) => (
              <span
              key={index}
              className={`border text-sm font-semibold px-3 py-1 rounded-full ${
                index % 2 === 0
                  ? "border-mainBlue text-mainBlue"
                  : "border-mainOrange text-mainOrange"
              }`}
              >
                {tag}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}