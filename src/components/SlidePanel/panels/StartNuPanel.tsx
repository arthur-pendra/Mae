'use client';

import { useState, useEffect } from 'react';
import { usePanel } from '@/context/PanelContext';
import styles from './StartNuPanel.module.css';

type Step = 'doel' | 'verdieping' | 'contact' | 'bevestiging';

/* ── Fysio flow (Maarten) ── */

type FysioDoel = 'pijnvrij' | 'sterker' | 'terug-sport' | 'preventie' | null;

const FYSIO_DOELEN: { key: FysioDoel; title: string; text: string }[] = [
  { key: 'pijnvrij', title: 'Pijnvrij bewegen', text: 'Klachten, blessures of herstel na een operatie' },
  { key: 'sterker', title: 'Sterker & krachtiger worden', text: 'Meer kracht opbouwen en je lichaam uitdagen' },
  { key: 'terug-sport', title: 'Terug naar sport na blessure', text: 'Veilig en sterk terugkeren op je oude niveau' },
  { key: 'preventie', title: 'Preventie & optimalisatie', text: 'Blessures voorkomen en je lichaam optimaliseren' },
];

const FYSIO_VERDIEPING: Record<string, { question: string; options: string[] }[]> = {
  pijnvrij: [
    {
      question: 'Waar zit de klacht?',
      options: ['Nek / schouder', 'Rug / onderrug', 'Knie', 'Heup', 'Enkel / voet', 'Elleboog / pols', 'Anders'],
    },
    {
      question: 'Hoe lang heb je er al last van?',
      options: ['Minder dan een week', 'Een paar weken', 'Een paar maanden', 'Langer dan een half jaar'],
    },
  ],
  sterker: [
    {
      question: 'Wat is je ervaring met krachtsport?',
      options: ['Helemaal nieuw', 'Een beetje ervaring', 'Regelmatig getraind', 'Ervaren'],
    },
  ],
  'terug-sport': [
    {
      question: 'Welke sport wil je weer oppakken?',
      options: ['Hardlopen', 'Voetbal / veldsport', 'Krachtsport', 'Racket / slagsport', 'Anders'],
    },
    {
      question: 'Hoe lang geleden was de blessure?',
      options: ['Minder dan een maand', 'Een paar maanden', 'Langer dan een half jaar'],
    },
  ],
  preventie: [
    {
      question: 'Waar wil je je op richten?',
      options: ['Mobiliteit verbeteren', 'Sterker worden', 'Blessurepreventie', 'Algehele optimalisatie'],
    },
  ],
};

/* ── Leefstijl flow (Merel) ── */

type LeefstijlDoel = 'lekkerder' | 'energie' | 'eten' | 'afvallen' | 'reset' | null;

const LEEFSTIJL_DOELEN: { key: LeefstijlDoel; title: string; text: string }[] = [
  { key: 'lekkerder', title: 'Lekkerder in je vel zitten', text: 'Meer energie hebben, je fitter voelen en genieten van je dagelijks leven.' },
  { key: 'energie', title: 'Gezond eten en betere gewoontes', text: 'Betere voedingskeuzes maken zonder strenge diëten en weer leren luisteren naar je lichaam.' },
  { key: 'eten', title: 'Een gezonde relatie met eten', text: 'Controle krijgen over je eetproblematiek en je gedachten rondom eten.' },
  { key: 'afvallen', title: 'Afvallen', text: 'Op een duurzame manier gewicht verliezen die past bij jouw normen en waarden.' },
  { key: 'reset', title: 'Een totale reset', text: 'Je hele levensstijl onder de loep nemen en vernieuwen.' },
];

const LEEFSTIJL_VERDIEPING: Record<string, { question: string; options: string[] }[]> = {
  lekkerder: [
    {
      question: 'Waar merk je het meest dat je niet lekker in je vel zit?',
      options: ['Weinig energie', 'Slechte slaap', 'Stress / onrust', 'Fysieke klachten', 'Negatief zelfbeeld', 'Een combinatie van dingen'],
    },
    {
      question: 'Hoe lang speelt dit al?',
      options: ['Een paar weken', 'Een paar maanden', 'Langer dan een half jaar', 'Al jaren'],
    },
  ],
  energie: [
    {
      question: 'Wat is voor jou de grootste uitdaging?',
      options: ['Weten wat gezond is', 'Volhouden van goede gewoontes', 'Geen tijd om gezond te koken', 'Emotioneel eten', 'Snacken en tussendoor eten', 'Structuur in mijn eetpatroon'],
    },
    {
      question: 'Heb je eerder begeleiding gehad op het gebied van voeding?',
      options: ['Nee, dit is nieuw', 'Ja, maar zonder resultaat', 'Ja, maar ik ben teruggevallen', 'Ja, met goed resultaat maar ik wil verder'],
    },
  ],
  eten: [
    {
      question: 'Waar heb je het meeste last van?',
      options: ['Eetbuien', 'Constant bezig zijn met eten', 'Schuldgevoel na het eten', 'Streng lijnen en terugvallen', 'Emotioneel eten', 'Vermijden van bepaalde voedingsmiddelen'],
    },
    {
      question: 'Hoe lang speelt dit al?',
      options: ['Een paar maanden', 'Één tot twee jaar', 'Meerdere jaren', 'Al zo lang ik me kan herinneren'],
    },
  ],
  afvallen: [
    {
      question: 'Heb je al eerder geprobeerd af te vallen?',
      options: ['Nee, dit is de eerste keer', 'Ja, met diëten', 'Ja, met begeleiding', 'Ja, meerdere keren zonder blijvend resultaat', 'Ja, maar ik val steeds terug'],
    },
    {
      question: 'Wat is voor jou het belangrijkst?',
      options: ['Gezonder voelen', 'Meer zelfvertrouwen', 'Fitter worden', 'Beter in mijn kleren passen', 'Medische redenen', 'Een combinatie'],
    },
  ],
  reset: [
    {
      question: 'Welk gebied heeft de meeste aandacht nodig?',
      options: ['Voeding', 'Beweging', 'Slaap en herstel', 'Stress en mindset', 'Alles eigenlijk'],
    },
    {
      question: 'Wat triggerde de wens voor een reset?',
      options: ['Ik voel me al lang niet goed', 'Een life event (scheiding, burn-out, etc.)', 'Gezondheidsklachten', 'Ik herken mezelf niet meer', 'Ik wil gewoon een frisse start'],
    },
  ],
};

export default function StartNuPanel() {
  const { panelVariant, activePanel, setProgress, setOnBack, setPanelStep } = usePanel();
  const [currentStep, setCurrentStep] = useState<Step>('doel');
  const [fysioDoel, setFysioDoel] = useState<FysioDoel>(null);
  const [leefstijlDoel, setLeefstijlDoel] = useState<LeefstijlDoel>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [extra, setExtra] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset all state when variant changes or panel reopens
  useEffect(() => {
    setCurrentStep('doel');
    setFysioDoel(null);
    setLeefstijlDoel(null);
    setAnswers({});
    setCurrentQuestion(0);
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setExtra('');
    setIsSubmitting(false);
    setSubmitError(null);
  }, [panelVariant, activePanel]);

  const isFysio = panelVariant === 'fysio';

  // Get the verdieping questions for the current flow
  const questions = isFysio
    ? FYSIO_VERDIEPING[fysioDoel || ''] || []
    : LEEFSTIJL_VERDIEPING[leefstijlDoel || ''] || [];

  /* ── Handlers ── */

  const doelen = isFysio ? FYSIO_DOELEN : LEEFSTIJL_DOELEN;

  const handleDoel = (choice: FysioDoel | LeefstijlDoel) => {
    if (isFysio) setFysioDoel(choice as FysioDoel);
    else setLeefstijlDoel(choice as LeefstijlDoel);
    setAnswers({});
    setCurrentQuestion(0);
    setCurrentStep('verdieping');
  };

  const buildSummary = (finalAnswers: Record<number, string>) => {
    if (isFysio) {
      const loc = finalAnswers[0]?.toLowerCase();
      const dur = finalAnswers[1]?.toLowerCase();
      const exp = finalAnswers[0]?.toLowerCase();
      const sport = finalAnswers[0]?.toLowerCase();
      const since = finalAnswers[1]?.toLowerCase();
      const focus = finalAnswers[0]?.toLowerCase();

      switch (fysioDoel) {
        case 'pijnvrij':
          return `He Maarten, ik heb last van mijn ${loc} en dit speelt al ${dur}.`;
        case 'sterker':
          return `He Maarten, ik wil graag sterker worden. Mijn ervaring met krachtsport is ${exp}.`;
        case 'terug-sport':
          return `He Maarten, ik wil graag terug naar ${sport}. De blessure was ${since} geleden.`;
        case 'preventie':
          return `He Maarten, ik wil me graag richten op ${focus}.`;
      }
    } else {
      const doelTitle = LEEFSTIJL_DOELEN.find((d) => d.key === leefstijlDoel)?.title.toLowerCase();
      const a0 = finalAnswers[0]?.toLowerCase();
      const a1 = finalAnswers[1]?.toLowerCase();

      switch (leefstijlDoel) {
        case 'lekkerder':
          return `He Merel, ik zit niet lekker in mijn vel. Ik merk dit vooral door ${a0} en dit speelt al ${a1}.`;
        case 'energie':
          return `He Merel, ik wil graag gezonder eten en betere gewoontes. Mijn grootste uitdaging is ${a0}. ${a1 ? `Eerdere ervaring: ${a1}.` : ''}`;
        case 'eten':
          return `He Merel, ik wil werken aan mijn relatie met eten. Ik heb vooral last van ${a0} en dit speelt al ${a1}.`;
        case 'afvallen':
          return `He Merel, ik wil graag afvallen. ${a0 === 'nee, dit is de eerste keer' ? 'Dit is mijn eerste poging' : `Ik heb al eerder geprobeerd: ${a0}`}. Het belangrijkst voor mij is ${a1}.`;
        case 'reset':
          return `He Merel, ik wil een totale reset. Het gebied dat de meeste aandacht nodig heeft is ${a0}. De aanleiding: ${a1}.`;
        default:
          return `He Merel, ik wil graag werken aan ${doelTitle}.`;
      }
    }
    return '';
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setExtra(buildSummary(newAnswers));
      setCurrentStep('contact');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const doel = isFysio
      ? FYSIO_DOELEN.find((d) => d.key === fysioDoel)?.title || ''
      : LEEFSTIJL_DOELEN.find((d) => d.key === leefstijlDoel)?.title || '';

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          extra,
          variant: isFysio ? 'fysio' : 'leefstijl',
          doel,
          answers,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Er ging iets mis.');
      }

      setCurrentStep('bevestiging');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Er ging iets mis. Probeer het opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    if (currentStep === 'bevestiging') {
      setCurrentStep('contact');
    } else if (currentStep === 'contact') {
      if (questions.length > 0) {
        setCurrentStep('verdieping');
        setCurrentQuestion(questions.length - 1);
      } else {
        setCurrentStep('doel');
      }
    } else if (currentStep === 'verdieping') {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
      } else {
        setCurrentStep('doel');
        setFysioDoel(null);
        setLeefstijlDoel(null);
      }
    }
  };

  /* ── Progress ── */

  const totalStepsAfterDoel = questions.length + 2; // verdieping questions + contact + bevestiging

  const currentStepIndex =
    currentStep === 'verdieping' ? 1 + currentQuestion :
    currentStep === 'contact' ? questions.length + 1 :
    currentStep === 'bevestiging' ? totalStepsAfterDoel :
    0;

  useEffect(() => {
    if (currentStep === 'doel') {
      setProgress(0);
      setPanelStep('01');
    } else {
      setProgress(currentStepIndex / totalStepsAfterDoel);
      const stepNumber = currentStep === 'verdieping' ? '02' :
        currentStep === 'contact' ? '03' :
        currentStep === 'bevestiging' ? '04' : '01';
      setPanelStep(stepNumber);
    }
  }, [currentStep, currentStepIndex, totalStepsAfterDoel, setProgress, setPanelStep]);

  // Register back handler
  useEffect(() => {
    if (currentStep === 'doel') {
      setOnBack(null);
    } else {
      setOnBack(() => goBack);
    }
    return () => setOnBack(null);
  }, [currentStep, currentQuestion, fysioDoel, leefstijlDoel, setOnBack]);

  /* ── Render ── */

  const specialist = isFysio ? 'Maarten' : 'Merel';

  return (
    <div className={styles.panel}>
      {/* Step 1: Doel */}
      {currentStep === 'doel' && (
        <div className={styles.stepContent}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Start</span>
            <span className={styles.sectionNumber}>[01]</span>
          </div>
          <h2 className={styles.sectionTitle}>
            {isFysio ? 'Wat is je doel?' : 'Wat wil je bereiken?'}
          </h2>
          <p className={`${styles.subtitle} par`}>
            {isFysio
              ? 'Kies wat het beste bij je situatie past. Maarten stemt alles af op jou.'
              : 'Kies wat het beste bij je past. Merel stemt alles af op jouw situatie.'}
          </p>

          <div className={styles.choiceGrid}>
            {doelen.map((d) => (
              <button
                type="button"
                key={d.key}
                className={styles.choiceCard}
                onClick={() => handleDoel(d.key)}
              >
                <div className={styles.choiceContent}>
                  <h3 className={styles.choiceTitle}>{d.title}</h3>
                  <p className={`${styles.choiceText} par`}>{d.text}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Verdieping */}
      {currentStep === 'verdieping' && questions[currentQuestion] && (
        <div className={styles.stepContent}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Verdieping</span>
            <span className={styles.sectionNumber}>[02]</span>
          </div>
          <h2 className={styles.sectionTitle}>{questions[currentQuestion].question}</h2>

          <div className={styles.optionGrid}>
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option}
                className={styles.optionButton}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Contact */}
      {currentStep === 'contact' && (
        <div className={styles.stepContent}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Contact</span>
            <span className={styles.sectionNumber}>[03]</span>
          </div>
          <h2 className={styles.sectionTitle}>Hoe kunnen we je bereiken?</h2>
          <p className={`${styles.subtitle} par`}>
            {specialist} neemt via WhatsApp contact met je op. Kort, persoonlijk en vrijblijvend.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <input
                id="intake-firstName"
                name="firstName"
                autoComplete="given-name"
                type="text"
                className={styles.formInput}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Voornaam *"
                required
              />
              <input
                id="intake-lastName"
                name="lastName"
                autoComplete="family-name"
                type="text"
                className={styles.formInput}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Achternaam *"
                required
              />
              <input
                id="intake-email"
                name="email"
                autoComplete="email"
                type="email"
                className={styles.formInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mailadres *"
                required
              />
              <input
                id="intake-phone"
                name="phone"
                autoComplete="tel"
                type="tel"
                className={styles.formInput}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefoonnummer *"
                required
              />
            </div>

            <div className={styles.formDivider} />

            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Extra</span>
              <span className={styles.sectionNumber}>[04]</span>
            </div>
            <p className={`${styles.subtitle} par`}>
              Wil je nog iets kwijt? Dat mag hier.
            </p>

            <textarea
              id="intake-extra"
              name="extra"
              className={styles.formTextarea}
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              rows={4}
              placeholder={isFysio
                ? 'Bijvoorbeeld: hoe lang je al klachten hebt, wat je al geprobeerd hebt...'
                : 'Bijvoorbeeld: wat je al geprobeerd hebt, wat je het moeilijkst vindt...'}
            />

            {submitError && (
              <p className={styles.formError}>{submitError}</p>
            )}

            <div className={styles.formActions}>
              <button type="submit" className={styles.ctaButton} disabled={isSubmitting}>
                <span>{isSubmitting ? 'Versturen...' : 'Verstuur'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 4: Bevestiging */}
      {currentStep === 'bevestiging' && (
        <div className={styles.stepContent}>
          <div className={styles.confirmationIcon}>&#10003;</div>
          <h2 className={styles.sectionTitle}>
            Bedankt{firstName ? ` ${firstName}` : ''}!
          </h2>
          <p className={`${styles.confirmationText} par`}>
            {specialist} neemt binnen 24 uur contact met je op via WhatsApp.
          </p>
          <div className={styles.confirmationDetails}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Wat kun je verwachten?</span>
            </div>
            <div className={styles.expectationList}>
              <div className={styles.expectationItem}>
                <span className={styles.expectationNumber}>1</span>
                <div className={styles.expectationContent}>
                  <p className="par">Een kort persoonlijk bericht via WhatsApp</p>
                </div>
              </div>
              <div className={styles.expectationItem}>
                <span className={styles.expectationNumber}>2</span>
                <div className={styles.expectationContent}>
                  <p className="par">
                    {isFysio
                      ? 'Maarten bespreekt samen met jou de beste aanpak'
                      : 'Merel bespreekt samen met jou de beste aanpak'}
                  </p>
                </div>
              </div>
              <div className={styles.expectationItem}>
                <span className={styles.expectationNumber}>3</span>
                <div className={styles.expectationContent}>
                  <p className="par">We plannen een eerste afspraak in — vrijblijvend</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
