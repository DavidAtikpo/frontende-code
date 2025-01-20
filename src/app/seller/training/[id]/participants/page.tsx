import ParticipantsClient from './ParticipantsClient';

interface ParticipantsPageProps {
  params: {
    id: string;
  };
}

const ParticipantsPage = ({ params }: ParticipantsPageProps) => {
  return <ParticipantsClient params={params} />;
};

export default ParticipantsPage; 