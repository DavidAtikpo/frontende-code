const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};

const getFedaPayConfig = () => {
  return {
    publicKey: process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY,
    sandbox: process.env.NEXT_PUBLIC_FEDAPAY_SANDBOX === 'true'
  };
};

const getSiteUrl = () => {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
};

export { getApiUrl, getFedaPayConfig, getSiteUrl }; 