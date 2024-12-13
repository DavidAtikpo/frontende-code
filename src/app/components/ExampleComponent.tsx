import { api } from '@/utils/api';

const ExampleComponent = () => {
  const handleSubmit = async (data: any) => {
    try {
      const response = await api.post('/api/some-endpoint', data);
      // Traiter la réponse
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    // ... votre JSX
  );
};

export default ExampleComponent; 