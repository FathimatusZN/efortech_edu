import { useParams } from "next/navigation";

const TrainingDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Detail Artikel {id}</h1>
      <p>Isi artikel dengan ID {id}...</p>
    </div>
  );
};

export default TrainingDetail;