export default function Register() {
    return (
      <div>
        <h1>Inscription</h1>
        <form>
          <label>Nom :</label>
          <input type="text" name="name" />
          <label>Email :</label>
          <input type="email" name="email" />
          <label>Mot de passe :</label>
          <input type="password" name="password" />
          <button type="submit">S'inscrire</button>
        </form>
      </div>
    );
  }
  