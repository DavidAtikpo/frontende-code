import TrainingDetailsClient from './TrainingDetailsClient';

interface TrainingDetailsPageProps {
  params: {
    id: string;
  };
}

const TrainingDetailsPage = ({ params }: TrainingDetailsPageProps) => {
  return <TrainingDetailsClient params={params} />;
};

export default TrainingDetailsPage; 