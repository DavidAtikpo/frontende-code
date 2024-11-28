// components/Popup.tsx
import React from "react";

interface PopupProps {
  name: string;
  email: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ name, email, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Inscription réussie</h2>
        <p className="text-sm mb-2">
          Merci <span className="font-bold">{name}</span> pour votre inscription !
        </p>
        <p className="text-sm mb-4">
          Un lien de vérification a été envoyé à <span className="font-bold">{email}</span>.
        </p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Popup;
