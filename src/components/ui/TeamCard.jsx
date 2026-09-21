// Apresentação de um especialista. Todo o conteúdo chega via `member`
// (src/data/vantPresentation.js); este componente não guarda texto de negócio.
function TeamCard({ member }) {
  const {
    name, role, description, skills = [],
    photo, photoAlt, photoWidth, photoHeight, objectPosition,
  } = member;

  return (
    <article className="vant-team-card">
      <div className="vant-team-card-image">
        <img
          src={photo}
          alt={photoAlt}
          loading="lazy"
          decoding="async"
          width={photoWidth}
          height={photoHeight}
          // Enquadramento por perfil: cada retrato tem o seu, sem corte global.
          style={objectPosition ? { objectPosition } : undefined}
        />
      </div>
      <div className="vant-team-card-content">
        <h3>{name}</h3>
        <p className="vant-team-card-role">{role}</p>
        <p className="vant-team-card-description">{description}</p>
        {skills.length > 0 ? (
          <ul className="vant-team-card-skills" aria-label={`Competências de ${name}`}>
            {skills.map((skill) => <li key={skill}>{skill}</li>)}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

export default TeamCard;
