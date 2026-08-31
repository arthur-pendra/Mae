import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './privacy.module.css';

export const metadata: Metadata = {
  title: 'Privacyverklaring',
  description:
    'Hoe MAE omgaat met je persoonsgegevens: welke gegevens we verzamelen via het intakeformulier, waarvoor we ze gebruiken en welke rechten je hebt.',
  alternates: { canonical: '/privacy' },
};

const LAST_UPDATED = '31 augustus 2026';

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className="label label-dark">[ Privacy ]</span>
          <h1 className={`title-chaney ${styles.title}`}>
            <span className={styles.titleLine}>Privacy</span>
            <span className={styles.titleLine}>verklaring</span>
          </h1>
          <p className={`${styles.intro} par`}>
            MAE verwerkt persoonsgegevens als je contact met ons opneemt of het intakeformulier op
            deze website invult. Hieronder lees je precies welke gegevens dat zijn, waarvoor we ze
            gebruiken en welke rechten je hebt.
          </p>
          <p className={styles.updated}>Laatst bijgewerkt: {LAST_UPDATED}</p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.heading}>
            <span className={styles.number}>01</span> Wie is verantwoordelijk
          </h2>
          <p className="par">
            M.A.E. Coaching en Fysiotherapie is verantwoordelijk voor de verwerking van je
            persoonsgegevens zoals beschreven in deze verklaring.
          </p>
          <ul className={styles.list}>
            <li>Waalbroek 3, 6369 TE Simpelveld</li>
            <li>
              <a href="mailto:info@moveadaptevolve.nl" className={styles.link}>
                info@moveadaptevolve.nl
              </a>
            </li>
            <li>
              <a href="tel:+31614955827" className={styles.link}>
                +31 6 14 95 58 27
              </a>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>
            <span className={styles.number}>02</span> Welke gegevens we verzamelen
          </h2>
          <p className="par">
            Alleen wat je zelf invult in het intakeformulier of ons mailt. Concreet gaat het om:
          </p>
          <ul className={styles.list}>
            <li>Voor- en achternaam</li>
            <li>E-mailadres</li>
            <li>Telefoonnummer</li>
            <li>Het traject en doel dat je kiest (fysiotherapie of leefstijlcoaching)</li>
            <li>Je antwoorden op de verdiepingsvragen</li>
            <li>Wat je zelf invult bij het vrije tekstveld</li>
          </ul>
          <p className={`${styles.note} par`}>
            Vul in dat vrije tekstveld niet meer gezondheidsgegevens in dan nodig is om je vraag te
            begrijpen. De inhoudelijke bespreking doen we tijdens de intake, niet via het formulier.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>
            <span className={styles.number}>03</span> Waarvoor we ze gebruiken
          </h2>
          <p className="par">
            Uitsluitend om contact met je op te nemen over je aanvraag en om samen te bepalen welke
            begeleiding bij je past. We gebruiken je gegevens niet voor reclame, we verkopen ze niet
            en we sturen geen nieuwsbrief zonder dat je daar zelf om vraagt.
          </p>
          <p className="par">
            De grondslag hiervoor is je toestemming, die je geeft door het formulier te versturen,
            en het treffen van maatregelen op jouw verzoek voorafgaand aan een overeenkomst.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>
            <span className={styles.number}>04</span> Hoe lang we ze bewaren
          </h2>
          <p className="par">
            We bewaren je aanvraag zolang dat nodig is om hem af te handelen. Komt er geen traject
            uit voort, dan verwijderen we de aanvraag uiterlijk twaalf maanden na ons laatste
            contact. Word je cliënt, dan geldt voor je behandeldossier de wettelijke bewaartermijn
            uit de WGBO van twintig jaar. Dat dossier staat los van deze website.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>
            <span className={styles.number}>05</span> Wie je gegevens nog meer ziet
          </h2>
          <p className="par">
            We schakelen een paar dienstverleners in die nodig zijn om deze website te laten werken
            en je aanvraag bij ons te krijgen. Zij verwerken je gegevens uitsluitend in onze
            opdracht en mogen ze niet voor eigen doeleinden gebruiken.
          </p>
          <ul className={styles.list}>
            <li>
              <strong>Vercel</strong>, hosting van de website
            </li>
            <li>
              <strong>Resend</strong>, verzending van de e-mails met je aanvraag en je bevestiging
            </li>
            <li>
              <strong>Bunny CDN</strong>, uitlevering van de afbeeldingen en video
            </li>
            <li>
              <strong>unpkg en lottie.host</strong>, de animatie in het menu
            </li>
          </ul>
          <p className={`${styles.note} par`}>
            Als je de site bezoekt, ziet je browser deze partijen automatisch je IP-adres. Dat is
            technisch onvermijdelijk bij het laden van een webpagina.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>
            <span className={styles.number}>06</span> Cookies
          </h2>
          <p className="par">
            Deze website plaatst geen cookies. We gebruiken geen analytics, geen trackingpixels en
            geen advertentienetwerken. Er is daarom ook geen cookiebanner: er valt niets te
            accepteren of te weigeren.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>
            <span className={styles.number}>07</span> Je rechten
          </h2>
          <p className="par">
            Je mag je gegevens inzien, laten corrigeren of laten verwijderen. Ook kun je bezwaar
            maken tegen de verwerking, je toestemming intrekken of vragen om je gegevens over te
            dragen. Stuur daarvoor een bericht naar{' '}
            <a href="mailto:info@moveadaptevolve.nl" className={styles.link}>
              info@moveadaptevolve.nl
            </a>
            . We reageren binnen vier weken.
          </p>
          <p className="par">
            Kom je er met ons niet uit, dan kun je een klacht indienen bij de Autoriteit
            Persoonsgegevens via{' '}
            <a
              href="https://autoriteitpersoonsgegevens.nl"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              autoriteitpersoonsgegevens.nl
            </a>
            .
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>
            <span className={styles.number}>08</span> Beveiliging
          </h2>
          <p className="par">
            De website draait volledig over een versleutelde verbinding en we delen je gegevens
            alleen met de partijen hierboven. Denk je dat er iets misgaat met je gegevens, of zie je
            een kwetsbaarheid? Laat het ons weten via{' '}
            <a href="mailto:info@moveadaptevolve.nl" className={styles.link}>
              info@moveadaptevolve.nl
            </a>
            .
          </p>
        </section>

        <footer className={styles.footer}>
          <Link href="/" className="btn-accent">
            <span>Terug naar home</span>
          </Link>
        </footer>
      </div>
    </main>
  );
}
