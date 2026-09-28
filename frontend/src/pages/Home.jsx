import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <img
          className="hero-photo"
          src="/media/portada.jpg"
          alt="Primer plano de un perro pug"
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow">UNA SEGUNDA OPORTUNIDAD. TODA UNA VIDA.</p>
          <h1 id="hero-title">
            Él nunca te
            <br />
            abandonaría.
            <br />
            <em>
              Tú puedes cambiar
              <br className="desktop-break" /> su vida.
            </em>
          </h1>
          <p className="hero-description">
            Hay un corazón de cuatro patas esperando encontrar su lugar. Quizá ese lugar esté a tu
            lado.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/animales">
              Quiero adoptar <Icon name="arrow" />
            </Link>
            <a className="quiet-link" href="#como-adoptar">
              Conoce el proceso
            </a>
          </div>
        </div>
        <div className="hero-bottom">
          <span>
            <Icon /> Adopta un corazón, para siempre.
          </span>
          <span>AMOR QUE SE QUEDA</span>
        </div>
      </section>
      <section className="intro section">
        <p className="eyebrow">MUCHO MÁS QUE UNA ADOPCIÓN</p>
        <div className="intro-grid">
          <h2>
            Un hogar para él.
            <br />
            <em>
              Un nuevo comienzo
              <br />
              para los dos.
            </em>
          </h2>
          <div>
            <p>
              Adoptar es hacer sitio en tu vida. En los paseos de cada día, en los planes que
              cambian y en ese rincón del sofá que pronto tendrá dueño.
            </p>
            <p>
              Queremos ayudarte a encontrar un compañero al que puedas cuidar con tiempo, paciencia
              y cariño. Conoce su historia antes de dar el paso.
            </p>
            <Link className="text-link" to="/animales">
              Encuentra a tu compañero <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>
      <section id="como-adoptar" className="process section">
        <p className="eyebrow">PASO A PASO, CON RESPONSABILIDAD</p>
        <h2>Así empieza vuestra historia.</h2>
        <div className="steps">
          {[
            [
              '01',
              'Conócelo',
              'Explora las fichas y piensa en su edad, sus necesidades y el tiempo que puedes dedicarle.',
            ],
            [
              '02',
              'Cuéntanos sobre ti',
              'Crea tu cuenta y envía una solicitud. Queremos conocer el hogar y la vida que puedes ofrecerle.',
            ],
            [
              '03',
              'Da el siguiente paso',
              'Consulta el estado en tu cuenta. La solicitud es el comienzo: una adopción requiere conocerse y valorar cada caso.',
            ],
          ].map(([n, title, text]) => (
            <article key={n}>
              <span className="step-number">{n}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="commitment section">
        <Icon />
        <h2>
          Que el amor del primer día
          <br />
          <em>dure toda su vida.</em>
        </h2>
        <p>
          Antes de adoptar, piensa en los cuidados, el espacio y los gastos que necesitará. Su
          confianza merece un compromiso para siempre.
        </p>
        <Link className="button" to="/animales">
          Estoy listo para conocerlos <Icon name="arrow" />
        </Link>
      </section>
    </>
  );
}
