import { api } from '@/utils/api';

interface FormData {
  email: string;
  password: string;
}

const ExampleComponent = () => {
  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await api.post('/api/some-endpoint', formData);
      console.log('Succès:', result);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div>
      <h1>Example Component</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit({
          email: 'test@example.com',
          password: 'password123'
        });
      }}>
        {/* ... */}
      </form>
    </div>
  );
};

export default ExampleComponent; 