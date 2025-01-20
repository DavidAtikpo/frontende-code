import TrainingEditClient from './TrainingEditClient';

interface TrainingEditPageProps {
  params: {
    id: string;
  };
}

const TrainingEditPage = ({ params }: TrainingEditPageProps) => {
  return <TrainingEditClient params={params} />;
};

export default TrainingEditPage; 