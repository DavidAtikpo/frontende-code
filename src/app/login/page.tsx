export default function Login() {
    return (
      <div>
        <h1>Connexion</h1>
        <form>
          <label>Email :</label>
          <input type="email" name="email" />
          <label>Mot de passe :</label>
          <input type="password" name="password" />
          <button type="submit">Se connecter</button>
        </form>
      </div>
    );
  }
  